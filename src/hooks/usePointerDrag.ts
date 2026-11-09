import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { useLatest } from './useLatest';

export interface DragPoint {
  x: number;
  y: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
}

export interface PointerDragHandlers {
  /** Pointer pressed on the element. */
  onStart?: (point: DragPoint) => void;
  /** Pointer moved while pressed. */
  onMove?: (point: DragPoint) => void;
  /** Pointer released (or the gesture was cancelled). */
  onEnd?: (point: DragPoint) => void;
}

const toPoint = (event: PointerEvent | ReactPointerEvent): DragPoint => ({
  x: event.clientX,
  y: event.clientY,
  shiftKey: event.shiftKey,
  ctrlKey: event.ctrlKey,
  altKey: event.altKey
});

/**
 * Mouse, touch and pen dragging via Pointer Events. Returns an `onPointerDown`
 * handler; move / up listeners live on the element's window for the duration
 * of the gesture and are always removed (including on unmount). Handlers are
 * read through a ref, so they never see stale props or state.
 */
export const usePointerDrag = (handlers: PointerDragHandlers) => {
  const latest = useLatest(handlers);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  return useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Only the primary mouse button starts a drag; touch / pen always do.
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const target = event.currentTarget;
      // Prevent text selection / native drag. This also prevents the default
      // focus change, so focus the control explicitly (this blurs a focused
      // text input, which commits its value).
      event.preventDefault();
      target.focus({ preventScroll: true });
      const activeElement = target.ownerDocument
        .activeElement as HTMLElement | null;
      if (
        activeElement &&
        activeElement !== target &&
        typeof activeElement.blur === 'function'
      ) {
        // The target isn't focusable: mimic the native behaviour of moving focus away.
        activeElement.blur();
      }
      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        // Not supported (e.g. jsdom) or pointer already released; window listeners still work.
      }

      cleanupRef.current?.();
      const win = target.ownerDocument.defaultView ?? window;
      const { pointerId } = event;

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        latest.current.onMove?.(toPoint(e));
      };
      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        cleanup();
        latest.current.onEnd?.(toPoint(e));
      };
      const cleanup = () => {
        win.removeEventListener('pointermove', onMove);
        win.removeEventListener('pointerup', onUp);
        win.removeEventListener('pointercancel', onUp);
        cleanupRef.current = null;
      };

      win.addEventListener('pointermove', onMove);
      win.addEventListener('pointerup', onUp);
      win.addEventListener('pointercancel', onUp);
      cleanupRef.current = cleanup;

      latest.current.onStart?.(toPoint(event));
    },
    [latest]
  );
};
