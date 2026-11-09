import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { transform } from 'lightningcss';
import { defineConfig } from 'tsdown';

const INLINE_SUFFIX = '?inline';

/**
 * Supports Vite-style `import css from './file.css?inline'` in the library
 * build, so the same source works in tsdown (Rolldown), Vitest and Storybook
 * (both Vite, which understands `?inline` natively).
 *
 * The stylesheet is minified and inlined as a string; the component injects it
 * into the document at runtime, so consumers never have to import CSS.
 */
const inlineCss = () => ({
  name: 'gcolor:inline-css',
  resolveId(source: string, importer: string | undefined) {
    if (!importer || !source.endsWith(`.css${INLINE_SUFFIX}`)) return null;
    return resolve(dirname(importer), source);
  },
  async load(id: string) {
    if (!id.endsWith(`.css${INLINE_SUFFIX}`)) return null;
    const filename = id.slice(0, -INLINE_SUFFIX.length);
    const { code } = transform({
      filename,
      code: await readFile(filename),
      minify: true
    });
    return `export default ${JSON.stringify(code.toString())};`;
  }
});

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2020',
  dts: true,
  sourcemap: true,
  clean: true,
  plugins: [inlineCss()],
  // Both a named and a default export: CJS consumers use `require(...).ReactGPicker`.
  outputOptions: { exports: 'named' },
  // Package sanity checks run on every build. `engines` is intentionally
  // omitted (this is a browser library), so publint suggestions are muted.
  publint: { level: 'warning' },
  attw: { profile: 'node16' }
});
