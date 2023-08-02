import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';

// const pkg = {
//   main: 'dist/index.js',
//   module: 'dist/index/es/js'
// };

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json' }),
    sass({ insert: true }),
    commonjs({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      include: /node_modules/
    })
    // typescript({
    //   // rollupCommonJSResolveHack: true,
    //   // clean: true
    // })
    // commonjs({
    //   include: ['node_modules/**'],
    //   extensions: ['.js', '.ts']
    // })
  ]
};
