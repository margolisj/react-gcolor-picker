import type { RefObject } from 'react';

import css from '../styles/picker.css?inline';
import { useIsomorphicLayoutEffect } from './useLatest';

export const STYLE_ELEMENT_ID = 'react-gcolor-picker-styles';

/** Adds the picker stylesheet to `doc` once. Safe to call repeatedly. */
export const injectStyles = (doc: Document) => {
  if (!css || doc.getElementById(STYLE_ELEMENT_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = css;
  // Prepend so consumer stylesheets win over the defaults on equal specificity.
  doc.head.prepend(style);
};

/**
 * Injects the stylesheet into the document the picker is rendered in (which
 * may be an iframe, e.g. the WordPress block editor canvas) before paint.
 * Nothing happens at import time, so the package is side-effect free and SSR safe.
 */
export const useInjectStyles = (ref: RefObject<HTMLElement | null>) => {
  useIsomorphicLayoutEffect(() => {
    const doc = ref.current?.ownerDocument;
    if (doc) injectStyles(doc);
  }, [ref]);
};
