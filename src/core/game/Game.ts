import balance from '../../../config/balance.v1.json';
import { clamp } from '../util/math';
import { mulberry32, weightedPick } from '../util/random';
import { GameState } from '../state/GameState';

export type GamePhase = 'running' | 'finished' | 'out-of-gifts';

type ObstacleType = 'tree' | 'rock' | 'fence';

export interface ObstacleInstance {
  id: string;
  type: ObstacleType;
  x: number;
  z: number;
  radius: number;
  hit: boolean;
  cleared: boolean;
}

export interface PickupInstance {
  id: string;
  x: number;
  z: number;
  radius: number;
  value: number;
  collected: boolean;
}

const HALF_TRACK_WIDTH = 10;
const SLEIGH_RADIUS = 0.8;
const LOOKAHEAD = 80;

export class Game {
  state = new GameState();
  phase: GamePhase = 'running';

  sleighX = 0;
  sleighZ = 0;
  combo = 0;
  elapsed = 0;

  obstacles: ObstacleInstance[] = [];
  pickups: PickupInstance[] = [];

  private rng = mulberry32(balance.seed);
  private spawnBudget = 0;
  private lastSpawnZ = 24;
  private idCounter = 0;

  update(dt: number, steerInput: number) {
    if (this.phase !== 'running') return;

    this.elapsed += dt;
    this.state.tick(dt);

    this.sleighZ += this.state.speed * dt;
    this.sleighX = clamp(
      this.sleighX + steerInput * this.state.steerSpeed * dt,
      -HALF_TRACK_WIDTH + 1,
      HALF_TRACK_WIDTH - 1
    );

    this.spawnBudget += dt * this.currentSpawnRate();
    while (this.spawnBudget >= 1) {
      this.spawnBudget -= 1;
      this.spawnEntity();
    }

    this.handlePickups();
    this.handleObstacles();
    this.cleanupPassed();

    if (this.elapsed >= balance.runLengthSeconds) this.phase = 'finished';
    if (this.state.gifts <= 0) this.phase = 'out-of-gifts';
  }

  private currentSpawnRate() {
    const a = Math.min(1, this.elapsed / balance.spawns.rampSeconds);
    return balance.spawns.basePerSecond + (balance.spawns.maxPerSecond - balance.spawns.basePerSecond) * a;
  }

  private spawnEntity() {
    const z = this.lastSpawnZ + 10 + this.rng() * 12;
    this.lastSpawnZ = z;
    const x = (this.rng() * 2 - 1) * (HALF_TRACK_WIDTH - 1.4);

    // 30% pickups, 70% obstacles
    const spawnPickup = this.rng() < 0.3;
    if (spawnPickup) {
      const valueRange = balance.rewards.giftPickupSmall;
      const value = valueRange[0] + Math.round(this.rng() * (valueRange[1] - valueRange[0]));
      this.pickups.push({
        id: this.nextId(),
        x,
        z,
        radius: 0.8,
        value,
        collected: false
      });
      return;
    }

    const type = weightedPick<ObstacleType>(balance.spawns.types.map((t) => ({ item: t.id as ObstacleType, weight: t.weight })), this.rng);
    const radius: Record<ObstacleType, number> = {
      tree: 1.2,
      rock: 0.8,
      fence: 1.3
    };

    this.obstacles.push({
      id: this.nextId(),
      type,
      x,
      z,
      radius: radius[type],
      hit: false,
      cleared: false
    });
  }

  private handleObstacles() {
    for (const obstacle of this.obstacles) {
      if (obstacle.hit) continue;

      const dx = obstacle.x - this.sleighX;
      const dz = obstacle.z - this.sleighZ;
      const r = obstacle.radius + SLEIGH_RADIUS;
      if (dx * dx + dz * dz < r * r) {
        obstacle.hit = true;
        this.combo = 0;
        this.state.spillGifts(balance.collisions.giftLossPerHit);
        continue;
      }

      // Clean pass reward once we are safely past it
      if (!obstacle.cleared && obstacle.z + obstacle.radius < this.sleighZ - SLEIGH_RADIUS) {
        obstacle.cleared = true;
        this.rewardCleanPass();
      }
    }
  }

  private handlePickups() {
    for (const pickup of this.pickups) {
      if (pickup.collected) continue;
      const dx = pickup.x - this.sleighX;
      const dz = pickup.z - this.sleighZ;
      const r = pickup.radius + SLEIGH_RADIUS;
      if (dx * dx + dz * dz < r * r) {
        pickup.collected = true;
        this.state.addGifts(pickup.value);
      }
    }
  }

  private rewardCleanPass() {
    this.state.addGifts(balance.rewards.cleanPassGift);
    this.combo += 1;
    if (this.combo > 0 && this.combo % balance.rewards.comboEvery === 0) {
      const bonus =
        balance.rewards.comboGiftMin + Math.round(this.rng() * (balance.rewards.comboGiftMax - balance.rewards.comboGiftMin));
      this.state.addGifts(bonus);
    }
  }

  private cleanupPassed() {
    const minZ = this.sleighZ - LOOKAHEAD;
    this.obstacles = this.obstacles.filter((o) => o.z > minZ && !o.hit);
    this.pickups = this.pickups.filter((p) => p.z > minZ && !p.collected);
  }

  private nextId() {
    this.idCounter += 1;
    return `e${this.idCounter}`;
  }
}
