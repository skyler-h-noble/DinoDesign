// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import { readFileSync } from 'fs';

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

/* Everything React, MUI or emotion is the APP's copy, subpaths included.
   A list of bare names missed subpaths: Section imported `@mui/system`,
   which matched nothing here, so a second copy of MUI's core was bundled
   into the package and shipped to every consumer alongside their own. */
/* @omni-design/icons is its own package: each icon import stays an import,
   so a consumer's bundler keeps only the icons actually used. */
const external = (id) => /^(react|react-dom)(\/.*)?$/.test(id) || /^@(mui|emotion)\//.test(id) || /^@omni-design\/icons(\/.*)?$/.test(id);

/* Writes the package version into OMNI_DEFAULT_THEME_URL, so the default
   theme it points at is the one published with these components. */
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const omniVersion = {
  name: 'omni-version',
  transform(code) {
    return code.includes('__OMNI_VERSION__')
      ? { code: code.replace(/__OMNI_VERSION__/g, JSON.stringify(version)), map: null }
      : null;
  },
};

const plugins = [
  peerDepsExternal(),
  omniVersion,
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
        /* One file for require(): Footer's lazy BrandIcon is folded in.
           The ESM build below keeps it as its own chunk. */
        inlineDynamicImports: true,
        /* 'auto': an external compiled from ES modules (every @mui/icons-material
           icon) keeps its component under .default. The default interop used
           the module object itself as the component, so under require() —
           server rendering, Jest, older Next.js — SearchField and every other
           icon import threw "Element type is invalid … got: object". */
        interop: 'auto',
      },
    ],
    plugins,
    external,
  },

  /* ── ES modules, one file per source module ─────────────────────────────
     A single bundled file cannot be tree-shaken: a page importing Button
     pulled in all ~150 components (1.5 MB of a 1.6 MB build). With modules
     preserved and "sideEffects": false, a bundler keeps only what is
     imported. Index and provider share ONE build, so there is one
     OmniDesign context, not a copy per entry. */
  {
    input: { 'components/index': 'src/components/index.js', OmniDesignProvider: 'src/OmniDesignProvider.js' },
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
    },
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
        /* One file for require(): Footer's lazy BrandIcon is folded in.
           The ESM build below keeps it as its own chunk. */
        inlineDynamicImports: true,
        /* 'auto': an external compiled from ES modules (every @mui/icons-material
           icon) keeps its component under .default. The default interop used
           the module object itself as the component, so under require() —
           server rendering, Jest, older Next.js — SearchField and every other
           icon import threw "Element type is invalid … got: object". */
        interop: 'auto',
      },
    ],
    plugins,
    external,
  },
];