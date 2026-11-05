# Changelog

Notable changes to this project. From 1.0.0 on, release notes are also generated on each GitHub release.

## Unreleased (planned 1.0.0)

### Breaking

- Requires React 18 or 19 (peer `react: ^18 || ^19`); `react-dom` is no longer a peer dependency.
- Package entry points are defined by `exports`: ESM `dist/index.js`, CommonJS `dist/index.cjs`. The previous CommonJS build was named `index.js` inside a `"type": "module"` package, so Node treated it as ESM and `require()` broke.
- `showAlpha={false}` emits opaque colors in every format (previously only `hex` dropped alpha).
- `onChangeTabs` only fires when the tab changes.

### Added

- `ref` with `applyColor(color)`: sets the solid color or the active gradient stop, e.g. for eyedroppers.
- Default export, and exported `ReactGPickerProps`, `ReactGPickerHandle`, `ColorFormat`, `TabValue` and `DEFAULT_COLORS`.
- `popupWidth` accepts strings (e.g. `'100%'`); `className` prop.
- Keyboard support: board, hue, alpha and gradient stops are ARIA sliders; tabs, swatches and gradient controls are keyboard operable. ArrowUp / ArrowDown step the alpha input.
- Gradient parsing: stops without positions (filled like CSS), double-position stops, angle units (`turn`, `rad`, `grad`), negative angles, `ellipse` / reordered radial positions.

### Fixed

- Gradient: after `value` changed from outside, the highlighted stop and the stop being edited could differ, and edits could be lost until a stop was clicked (stops were matched by position instead of identity).
- Gradient: a `value` change could make the picker re-emit `onChange` (a reformatted copy of the new value), and stale debounced values could reset an in-progress drag.
- Gradient: stop markers were re-created on every render (random keys), and fractional positions were truncated (8.5% became 8%).
- Gradient: switching radial → linear always reset the angle to 180° and left an invalid rotation on the angle indicator.
- Solid: `debounce={false}` never emitted changes made with the board or sliders.
- A pending debounced change was dropped when the picker unmounted (e.g. closing a popover right after a change).
- Invalid hex input emitted `rgb(0, 0, 0)`; typing `05` in the alpha input produced `0`.
- Hue jumped back to red when a color passed through white / gray / black.
- Event listeners leaked when a picker unmounted mid-drag; touch dragging relied on non-passive listeners.
- React warning about an `activeTab` prop passed to `React.Fragment`; input labels pointed at the wrong elements (random ids regenerated on every render).
- Removed an invalid CSS selector and ~50% of dead / legacy CSS (unused rc-color-picker rules, vendor prefixes, IE fallbacks).

### Internal

- Build: Rollup 3 + plugins → tsdown (Rolldown), with publint and are-the-types-wrong checks; bundled `.d.ts` / `.d.cts`; `sideEffects: false`; ES2020 target (was ES5 with tslib helpers); `tinycolor2` is an external dependency instead of being copied into the bundle.
- Styles are injected on first render (per document) instead of at import time, so the package is SSR-safe and tree-shakeable.
- Tests: react-scripts + Enzyme → Vitest + Testing Library (150+ tests), plus consumer type tests with TypeScript 6 and 7.
- Tooling: TypeScript 6, ESLint 9 flat config (incl. React Compiler rules), Prettier 3, Storybook 10 (Vite), pnpm 12, Node 24; GitHub Actions CI (incl. React 18) and tag-driven npm releases.


#### [0.0.9](https://github.com/margolisj/react-gcolor-picker/compare/0.0.8...0.0.9)

- More rollup fixes [`f1c3756`](https://github.com/margolisj/react-gcolor-picker/commit/f1c3756d8183adf4ea0c000387bed4ab3f19c4b8)
- Scripts. [`1649a3e`](https://github.com/margolisj/react-gcolor-picker/commit/1649a3eff010489043e4689d0d819556b54dc77b)
- Lint fix. [`b73a590`](https://github.com/margolisj/react-gcolor-picker/commit/b73a590dfc5741aeeb1e4249468c9707a39592ad)

#### [0.0.8](https://github.com/margolisj/react-gcolor-picker/compare/0.0.7...0.0.8)

> 2 August 2023

- Simple one to try. [`899ee7b`](https://github.com/margolisj/react-gcolor-picker/commit/899ee7bf40e4082c1943f1b7188f4656b5198cc4)
- Lint fix. [`0a08de7`](https://github.com/margolisj/react-gcolor-picker/commit/0a08de76dba4e0d9347c54f6d03064731a948772)
- Release v0.0.8 [`742e11c`](https://github.com/margolisj/react-gcolor-picker/commit/742e11ce2c2a69f1d17329d4c9cfb0825823c61b)

#### [0.0.7](https://github.com/margolisj/react-gcolor-picker/compare/0.0.6...0.0.7)

> 2 August 2023

- Roll Up TS Bug [`#8`](https://github.com/margolisj/react-gcolor-picker/pull/8)
- Release v0.0.7 [`592f6d5`](https://github.com/margolisj/react-gcolor-picker/commit/592f6d5e0c0aeebe5ccfbeacce7669b3990debb9)

#### [0.0.6](https://github.com/margolisj/react-gcolor-picker/compare/0.0.5...0.0.6)

> 2 August 2023

#### [0.0.5](https://github.com/margolisj/react-gcolor-picker/compare/0.0.4...0.0.5)

> 2 August 2023

- Re-adds react-scripts + CI [`#7`](https://github.com/margolisj/react-gcolor-picker/pull/7)
- More improvements with types and package upgrades  [`#6`](https://github.com/margolisj/react-gcolor-picker/pull/6)
- Release v0.0.5 [`18d7f88`](https://github.com/margolisj/react-gcolor-picker/commit/18d7f883fbe99d32d9fc467fd7dea1e9a03c78a0)

#### [0.0.4](https://github.com/margolisj/react-gcolor-picker/compare/0.0.2...0.0.4)

> 22 May 2023

- Fix minor type issues and updates more documents. [`#5`](https://github.com/margolisj/react-gcolor-picker/pull/5)
- 0.0.3 [`#4`](https://github.com/margolisj/react-gcolor-picker/pull/4)
- Release v0.0.3 [`b2f67c5`](https://github.com/margolisj/react-gcolor-picker/commit/b2f67c545e88294e935383ca0ebc9994837ded9c)
- Release v0.0.4 [`e64dc1e`](https://github.com/margolisj/react-gcolor-picker/commit/e64dc1efc8b735864496c748d9623bffc3d01775)

#### 0.0.2

> 17 April 2023

- Clean up for NPM Publish [`#3`](https://github.com/margolisj/react-gcolor-picker/pull/3)
- Bugfix missing gradient end value [`#2`](https://github.com/margolisj/react-gcolor-picker/pull/2)
- Upgrades Packages: Storybook, react, all babel + rollup [`#1`](https://github.com/margolisj/react-gcolor-picker/pull/1)
- Fix minor bugs [`#28`](https://github.com/margolisj/react-gcolor-picker/pull/28)
- patch: remove color stop on double click [`#22`](https://github.com/margolisj/react-gcolor-picker/pull/22)
- fix: update peerDependencies [`#21`](https://github.com/margolisj/react-gcolor-picker/pull/21)
- patch: add new props [`#17`](https://github.com/margolisj/react-gcolor-picker/pull/17)
- bug: fix mousedown conflict [`#15`](https://github.com/margolisj/react-gcolor-picker/pull/15)
- fix: render components and scss styles [`#13`](https://github.com/margolisj/react-gcolor-picker/pull/13)
- patch: remove color stops [`#12`](https://github.com/margolisj/react-gcolor-picker/pull/12)
- Update prop value [`#8`](https://github.com/margolisj/react-gcolor-picker/pull/8)
- chore: fix hsl string regexp [`#5`](https://github.com/margolisj/react-gcolor-picker/pull/5)
- Default colors panel [`#4`](https://github.com/margolisj/react-gcolor-picker/pull/4)
- patch: add format component prop [`#3`](https://github.com/margolisj/react-gcolor-picker/pull/3)
- fix: react jsx runtime error [`#2`](https://github.com/margolisj/react-gcolor-picker/pull/2)
- patch: mobile touch events [`#1`](https://github.com/margolisj/react-gcolor-picker/pull/1)
- init [`8cb39a8`](https://github.com/margolisj/react-gcolor-picker/commit/8cb39a843d4c9ed310d1eb11256d9c2581fc52d1)
- Really big update for files, yarn, disables prepare currently, tool-version. [`2726075`](https://github.com/margolisj/react-gcolor-picker/commit/27260751757ce59b96a919e0a5382639a534fdb4)
- Updates storybook, adds babel presets, updates enzyme plugin for 18. [`dad43d4`](https://github.com/margolisj/react-gcolor-picker/commit/dad43d4449cffea51af68a48d65caade36399ea5)
