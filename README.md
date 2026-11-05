# react-gcolor-picker-2

Solid color (hex, rgb(a), hsl(a)) and gradient (linear and radial) picker for **React 18 and 19**.

A maintained fork of [react-gcolor-picker](https://github.com/undind/react-gcolor-picker), inspired by [gpickr](https://github.com/Simonwep/gpickr).

## Install

```bash
pnpm add react-gcolor-picker-2
```

`react` (18 or 19) is a peer dependency. There is no CSS to import: the stylesheet is injected the first time a picker renders.

## Usage

```tsx
import { useState } from 'react';
import { ReactGPicker } from 'react-gcolor-picker-2';

export function Example() {
  const [color, setColor] = useState('#ff6900');
  return <ReactGPicker value={color} onChange={setColor} gradient />;
}
```

The package has both a named (`ReactGPicker`) and a default export, so it can be lazy-loaded directly:

```tsx
const ReactGPicker = lazy(() => import('react-gcolor-picker-2'));
```

### Applying colors from outside (eyedropper, palettes)

The `ref` exposes `applyColor(color)`, which behaves as if the user had picked the color: it replaces the solid color, or recolors the **active gradient stop** (a gradient string replaces the whole gradient). It triggers `onChange`.

```tsx
const pickerRef = useRef<ReactGPickerHandle>(null);

<ReactGPicker ref={pickerRef} value={color} onChange={setColor} gradient />
<button onClick={async () => pickerRef.current?.applyColor((await new EyeDropper().open()).sRGBHex)}>
  Pick from screen
</button>
```

## Props

| Prop                   | Type                      | Default                              | Description                                                                                         |
| :--------------------- | :------------------------ | :----------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `value`                | `string`                  | `undefined`                          | Current color: hex, rgb(a), hsl(a), named, `transparent`, or a linear / radial gradient. See below. |
| `onChange`             | `(value: string) => void` |                                      | Called with the new color (in `format`) when the user changes it.                                   |
| `format`               | `'rgb' \| 'hex' \| 'hsl'` | `'rgb'`                              | Output format.                                                                                      |
| `solid`                | `boolean`                 | `true`                               | Show the solid color picker.                                                                        |
| `gradient`             | `boolean`                 | `false`                              | Show the gradient picker. With `solid` too, both are shown as tabs.                                 |
| `defaultActiveTab`     | `'solid' \| 'gradient'`   | from `value`                         | Initial tab when both are shown.                                                                    |
| `onChangeTabs`         | `(tab) => void`           |                                      | Called when the user switches tabs.                                                                 |
| `debounce`             | `boolean`                 | `true`                               | Debounce `onChange`. When `false`, changes are emitted immediately.                                 |
| `debounceMS`           | `number`                  | `300`                                | Debounce delay. `0` emits synchronously.                                                            |
| `showAlpha`            | `boolean`                 | `true`                               | Show the alpha slider and input. When `false`, emitted colors are opaque.                           |
| `showInputs`           | `boolean`                 | `true`                               | Show the hex / alpha inputs.                                                                        |
| `showGradientResult`   | `boolean`                 | `true`                               | Show the gradient preview (mode, angle and position controls live on it).                           |
| `showGradientStops`    | `boolean`                 | `true`                               | Show the gradient stop editor.                                                                      |
| `showGradientMode`     | `boolean`                 | `true`                               | Show the linear / radial switch.                                                                    |
| `showGradientAngle`    | `boolean`                 | `true`                               | Allow rotating a linear gradient.                                                                   |
| `showGradientPosition` | `boolean`                 | `true`                               | Show the radial position selector.                                                                  |
| `popupWidth`           | `number \| string`        | `267`                                | Width. Numbers are pixels; strings are used as-is (e.g. `'100%'`).                                  |
| `colorBoardHeight`     | `number`                  | `120`                                | Height of the saturation / brightness board in pixels.                                              |
| `defaultColors`        | `readonly string[]`       | [`DEFAULT_COLORS`](src/constants.ts) | Swatches. Solid colors show on the solid tab, gradients on the gradient tab. `[]` hides them.       |
| `className`            | `string`                  |                                      | Extra class for the root element.                                                                   |

Types `ReactGPickerProps`, `ReactGPickerHandle`, `ColorFormat` and `TabValue` are exported.

### How `value` and `onChange` interact

- `onChange` fires only for user changes (or `applyColor`), never on mount or because `value` changed.
- An empty string / `undefined` value means "no color": the picker shows its defaults and stays quiet until the user picks something.
- When you store the emitted value and pass it back, the picker recognizes it and keeps its internal state (active gradient stop, hue of grays, in-progress drags). Any other change to `value` is adopted.
- A pending debounced change is flushed, not dropped, when the picker unmounts.

### Gradients

- `linear-gradient(...)` with an angle (`deg`, `turn`, `rad`, `grad`) or a `to <side>` direction, and `radial-gradient(...)` with `circle at <position>` (the nine positions of the position grid).
- Stop positions must be percentages. Missing positions are filled in the same way CSS does (first 0%, last 100%, others spread evenly), and fractional positions are preserved.
- A leading `background:` / `background-image:` and a trailing `;` are accepted.
- Output looks like `linear-gradient(180deg, rgb(0, 0, 0) 0.00%,rgb(255, 0, 0) 100.00%)`, with stops sorted by position and colors in `format`.
- Values the picker can't edit (e.g. `conic-gradient`, multiple backgrounds, `px` positions) fall back to a default gradient.

### Interaction

- Drag with mouse, touch or pen. Gradient angle drags snap to 45° (22.5° with Shift, 11.25° with Ctrl).
- Click the stop track to add a stop. Remove a stop by double-clicking it, pressing Delete, or dragging it below the track.
- Keyboard: the board, hue, alpha and stops are sliders (arrows, Shift for ×10, Page Up/Down, Home/End). The alpha input steps with ArrowUp / ArrowDown. Tabs, swatches and gradient controls work with Enter / Space.

## Styling

The stylesheet is added once per document (into `<head>`, before other styles, so your rules win on equal specificity), including when the picker renders inside an iframe. Class names are stable, e.g.:

```css
.my-picker .input_rgba .input_rgba-wrap .input_rgba-label {
  display: none;
}
```

## Upgrading from 0.0.9

- Requires React 18 or 19.
- The package ships ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`) through `exports`; deep imports into `dist/` are no longer possible.
- `value` and `onChange` are optional; a default export was added; `popupWidth` accepts strings.
- `ReactGPicker` is a `forwardRef` component now. Props derived with `Parameters<typeof ReactGPicker>[0]` include `ref`, which clashes with `@types/react` 18 when cast to `ComponentType`; use the exported `ReactGPickerProps` type instead. Lazy-loading needs no cast: `lazy(() => import('react-gcolor-picker-2'))`.
- `showAlpha={false}` now produces opaque output in every format (previously only for `hex`).
- Invalid hex input reverts instead of emitting black.
- `onChangeTabs` only fires when the tab actually changes.
- Gradient stops without positions are accepted (filled in like CSS) instead of falling back to the default gradient.

See [CHANGELOG.md](CHANGELOG.md) for the full list of fixes.

## Development

Requires Node 24 and pnpm 12 (see `.tool-versions`).

```bash
pnpm install
pnpm storybook      # interactive playground on http://localhost:6006
pnpm test:watch     # unit + component tests (Vitest)
pnpm check          # lint, format, typecheck, tests, build, consumer type tests
```

| Script                 | What it does                                                             |
| :--------------------- | :----------------------------------------------------------------------- |
| `pnpm build`           | Builds `dist/` with tsdown (Rolldown) and checks it with publint + attw. |
| `pnpm test`            | Runs Vitest (jsdom + Testing Library).                                   |
| `pnpm test:coverage`   | Tests with a v8 coverage report in `coverage/`.                          |
| `pnpm test:types`      | Type-checks consumer usage against `dist/` with TypeScript 6 and 7.      |
| `pnpm lint` / `format` | ESLint (incl. React Compiler rules) / Prettier.                          |

### Releasing

CI runs on every pull request and on `master`. To publish:

```bash
pnpm version minor   # or patch / major / prerelease; commits and tags vX.Y.Z
git push --follow-tags
```

The `Release` workflow re-runs CI, checks the tag matches `package.json`, publishes to npm (pre-releases under the `next` tag) and creates a GitHub release with generated notes. It authenticates with npm trusted publishing, or an `NPM_TOKEN` repository secret.

## License

MIT © undind and margolisj
