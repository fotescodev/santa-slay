import { describe, expect, test } from 'vitest';
import { Game } from '../src/core/game/Game';

describe('Game', () => {
  test('spawns deterministically with fixed seed', () => {
    const g1 = new Game();
    const g2 = new Game();

    for (let i = 0; i < 10; i += 1) {
      g1.update(1, 0);
      g2.update(1, 0);
    }

    const obstacles1 = g1.obstacles.map((o) => `${o.type}:${o.x.toFixed(2)}:${o.z.toFixed(2)}`);
    const obstacles2 = g2.obstacles.map((o) => `${o.type}:${o.x.toFixed(2)}:${o.z.toFixed(2)}`);
    const pickups1 = g1.pickups.map((p) => `${p.x.toFixed(2)}:${p.z.toFixed(2)}:${p.value}`);
    const pickups2 = g2.pickups.map((p) => `${p.x.toFixed(2)}:${p.z.toFixed(2)}:${p.value}`);

    expect(obstacles1).toEqual(obstacles2);
    expect(pickups1).toEqual(pickups2);
  });

  test('collision spills gifts', () => {
    const g = new Game();
    g.obstacles.push({ id: 'o1', type: 'tree', x: 0, z: 0.5, radius: 1, hit: false, cleared: false });
    const startGifts = g.state.gifts;
    g.update(0.016, 0);
    expect(g.state.gifts).toBeLessThan(startGifts);
    expect(g.obstacles.length).toBe(0);
  });

  test('pickup awards gifts', () => {
    const g = new Game();
    g.state.gifts = 1;
    g.pickups.push({ id: 'p1', x: 0, z: 0.5, radius: 1, value: 3, collected: false });
    g.update(0.016, 0);
    expect(g.state.gifts).toBe(4);
    expect(g.pickups.length).toBe(0);
  });
});
