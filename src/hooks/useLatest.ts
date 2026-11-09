import { useEffect, useLayoutEffect, useRef } from 'react';

/** `useLayoutEffect` on the client, `useEffect` during SSR (avoids React 18's server warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Ref that always holds the latest value. Read it from event handlers / timers
 * to avoid stale closures without re-subscribing listeners.
 */
export const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
