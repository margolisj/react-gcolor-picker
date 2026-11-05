import type { ColorFormat } from '../types';

/** Imperative API every tab panel implements; the root forwards `ref.applyColor` to it. */
export interface ColorApplier {
  applyColor: (color: string) => void;
}

/** Props shared by the solid and gradient panels. */
export interface PanelProps {
  value: string | undefined;
  /**
   * Bumped by the root whenever `value` changes from outside (i.e. it isn't the
   * echo of a value this picker emitted). Panels re-read `value` when it changes.
   */
  revision: number;
  format: ColorFormat;
  showAlpha: boolean;
  showInputs: boolean;
  colorBoardHeight: number;
  defaultColors: readonly string[];
  /** Sends a value to `onChange` (debounced / de-duplicated by the root). */
  emit: (value: string) => void;
}
