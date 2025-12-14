import balance from '../../../config/balance.v1.json';

/**
 * Engine-agnostic state container for the current run.
 * V1: minimal loop scaffolding. Expand with phases (Title/Running/Ended) later.
 */
export class GameState {
  gifts = balance.startingGifts;

  // Forward speed is currently constant-ish and ramps up.
  speed = balance.speed.start;
  private speedMax = balance.speed.max;
  private rampSeconds = balance.speed.rampSeconds;

  // Steering sensitivity (tunable)
  steerSpeed = 18;

  private t = 0;

  tick(dt: number) {
    this.t += dt;
    const a = Math.min(1, this.t / this.rampSeconds);
    this.speed = balance.speed.start + (this.speedMax - balance.speed.start) * a;
  }

  spillGifts(amount: number) {
    this.gifts = Math.max(balance.collisions.minGiftsAfterHit, this.gifts - amount);
  }

  addGifts(amount: number) {
    this.gifts = Math.min(999, this.gifts + amount);
  }
}
