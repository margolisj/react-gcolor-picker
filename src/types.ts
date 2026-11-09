export type TabValue = 'solid' | 'gradient';

/** Output format for the value passed to `onChange`. */
export type ColorFormat = 'rgb' | 'hsl' | 'hex';

export interface ReactGPickerProps {
  /**
   * Current color. Accepts hex, rgb(a), hsl(a), named colors, `transparent`,
   * and `linear-gradient(...)` / `radial-gradient(...)` strings.
   * An empty string or `undefined` means "no color": the picker shows its
   * defaults and does not call `onChange` until the user picks something.
   */
  value?: string;
  /** Format of the string passed to `onChange`. @default 'rgb' */
  format?: ColorFormat;
  /** Show the gradient picker. @default false */
  gradient?: boolean;
  /** Show the solid color picker. @default true */
  solid?: boolean;
  /** Debounce delay for `onChange` in milliseconds. @default 300 */
  debounceMS?: number;
  /** Enable debouncing of `onChange`. When `false`, changes are emitted immediately. @default true */
  debounce?: boolean;
  /** Show the alpha slider and input. When `false`, emitted colors are opaque. @default true */
  showAlpha?: boolean;
  /** Show the hex / alpha inputs. @default true */
  showInputs?: boolean;
  /** Show the gradient preview (with mode / angle / position controls). @default true */
  showGradientResult?: boolean;
  /** Show the gradient color stops editor. @default true */
  showGradientStops?: boolean;
  /** Show the linear / radial mode switch. @default true */
  showGradientMode?: boolean;
  /** Allow changing the linear gradient angle. @default true */
  showGradientAngle?: boolean;
  /** Show the radial gradient position selector. @default true */
  showGradientPosition?: boolean;
  /** Popup width. Numbers are pixels; strings are used as-is (e.g. `'100%'`). @default 267 */
  popupWidth?: number | string;
  /** Height of the saturation / brightness board in pixels. @default 120 */
  colorBoardHeight?: number;
  /** Swatches shown under the picker. Pass `[]` to hide them. */
  defaultColors?: readonly string[];
  /** Initially selected tab when both `solid` and `gradient` are enabled. */
  defaultActiveTab?: TabValue;
  /** Extra class name for the root element. */
  className?: string;
  /** Called when the user switches tabs. */
  onChangeTabs?: (tab: TabValue) => void;
  /** Called with the new color string (in `format`) when the user changes the color. */
  onChange?: (value: string) => void;
}

/** Imperative handle exposed through `ref`. */
export interface ReactGPickerHandle {
  /**
   * Apply a color as if the user had picked it: on the solid tab it replaces
   * the color, on the gradient tab it recolors the active stop (or, when given
   * a gradient string, replaces the whole gradient). Triggers `onChange`.
   * Useful for eyedroppers and palettes rendered outside the picker.
   */
  applyColor: (color: string) => void;
}

/** @deprecated Use `ReactGPickerProps`. */
export type IPropsMain = ReactGPickerProps;
