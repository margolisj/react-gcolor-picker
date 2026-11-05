import { useCallback, useEffect, useRef } from 'react';

import { useLatest } from './useLatest';

/**
 * Debounces `fn` by `delay` ms; a delay of 0 calls it synchronously.
 * A pending call is flushed (not dropped) on unmount, so closing a popover
 * right after a change doesn't lose it.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) => {
  const fnRef = useLatest(fn);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef<Args | null>(null);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    const args = pending.current;
    pending.current = null;
    if (args) fnRef.current(...args);
  }, [fnRef]);

  useEffect(() => flush, [flush]);

  return useCallback(
    (...args: Args) => {
      if (delay <= 0) {
        clearTimeout(timer.current);
        pending.current = null;
        fnRef.current(...args);
        return;
      }
      pending.current = args;
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [delay, flush, fnRef]
  );
};
