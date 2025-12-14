import { clamp } from '@core/util/math';

/**
 * Pointer/touch steering: drag left/right. Normalized steer output in [-1, 1].
 * - Designed for kids: direct, forgiving.
 */
export class PointerSteerInput {
  steer = 0;

  private dragging = false;
  private startX = 0;

  constructor(private el: HTMLElement) {
    el.addEventListener('pointerdown', this.onDown, { passive: true });
    el.addEventListener('pointermove', this.onMove, { passive: true });
    el.addEventListener('pointerup', this.onUp, { passive: true });
    el.addEventListener('pointercancel', this.onUp, { passive: true });

    // Keyboard fallback for desktop dev/testing
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.steer = -1;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.steer = 1;
    });
    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) this.steer = 0;
    });
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = true;
    this.startX = e.clientX;
  };

  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.startX;
    // 120px drag → full steer
    this.steer = clamp(dx / 120, -1, 1);
  };

  private onUp = () => {
    this.dragging = false;
    this.steer = 0;
  };
}
