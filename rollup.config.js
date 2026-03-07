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

  // ── DynoDesignProvider ──────────────────────────────────────────────────
  {
    input: 'src/DynoDesignProvider.js',
    output: [
      {
        file: 'dist/DynoDesignProvider.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/DynoDesignProvider.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
];