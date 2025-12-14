import { describe, expect, test } from 'vitest';
import { GameState } from '../src/core/state/GameState';

describe('GameState', () => {
  test('spillGifts reduces gifts but not below min', () => {
    const s = new GameState();
    s.gifts = 5;
    s.spillGifts(999);
    expect(s.gifts).toBeGreaterThanOrEqual(0);
  });

  test('addGifts increases gifts', () => {
    const s = new GameState();
    s.gifts = 1;
    s.addGifts(3);
    expect(s.gifts).toBe(4);
  });

  test('tick ramps speed upwards', () => {
    const s = new GameState();
    const start = s.speed;
    s.tick(1);
    expect(s.speed).toBeGreaterThanOrEqual(start);
  });
});
