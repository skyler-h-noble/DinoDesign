// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';

// Babel must run BEFORE commonjs so JSX is transformed first
const babelConfig = {
  babelHelpers: 'bundled',
  exclude: 'node_modules/**',
  extensions: ['.js', '.jsx'],
  presets: [
    ['@babel/preset-env', { targets: '> 0.5%, last 2 versions, not dead' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@mui/material',
  '@mui/icons-material',
  '@emotion/react',
  '@emotion/styled',
];

const plugins = [
  peerDepsExternal(),
  babel(babelConfig),                         // ← 1st: transform JSX → JS
  resolve({ extensions: ['.js', '.jsx'] }),   // ← 2nd: resolve modules
  commonjs(),                                 // ← 3rd: convert CJS → ESM
  terser(),                                   // ← 4th: minify
];

export default [
  // ── Main component library ──────────────────────────────────────────────
  {
    input: 'src/components/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        /* 'auto': an external compiled from ES modules (every @mui/icons-material
           icon) keeps its component under .default. The default interop used
           the module object itself as the component, so under require() —
           server rendering, Jest, older Next.js — SearchField and every other
           icon import threw "Element type is invalid … got: object". */
        interop: 'auto',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },

  // ── OmniDesignProvider ──────────────────────────────────────────────────
  {
    input: 'src/OmniDesignProvider.js',
    output: [
      {
        file: 'dist/OmniDesignProvider.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        /* 'auto': an external compiled from ES modules (every @mui/icons-material
           icon) keeps its component under .default. The default interop used
           the module object itself as the component, so under require() —
           server rendering, Jest, older Next.js — SearchField and every other
           icon import threw "Element type is invalid … got: object". */
        interop: 'auto',
      },
      {
        file: 'dist/OmniDesignProvider.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
];