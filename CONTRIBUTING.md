# Contributing

1. Use the toolchain in `.tool-versions` (Node 24, pnpm 12). With [mise](https://mise.jdx.dev) or asdf it is picked up automatically; otherwise `corepack enable` provides the pnpm version from `package.json`.
2. `pnpm install`
3. Develop against Storybook: `pnpm storybook`
4. Add or update tests next to the code (`*.test.ts(x)`); run them with `pnpm test:watch`.
5. Before opening a pull request, run `pnpm check` (lint, formatting, typecheck, tests, build and consumer type tests). CI runs the same checks, plus the test suite against React 18.

## Project layout

```
src/
  ColorPicker.tsx        root component: tabs, value / onChange handling, ref API
  components/            Solid, Gradient, color panel, inputs, swatches
  hooks/                 pointer dragging, debouncing, style injection
  utils/                 color + gradient parsing / formatting (pure, unit tested)
  styles/picker.css      the injected stylesheet
stories/                 Storybook stories and docs
test-types/              compile-only consumer usage checked against dist/
```

## Guidelines

- Keep class names and DOM structure stable; consumers style the picker through them.
- `onChange` must only fire for user changes. Don't emit from effects.
- New behaviour needs a test, and bug fixes need a regression test.
