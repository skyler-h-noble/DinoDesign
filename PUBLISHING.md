# Publishing OmniDesign to npm

## First-time setup

### 1. Install build tools
```bash
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-terser rollup-plugin-peer-deps-external
```

### 2. Create an npm account
If you don't have one: https://www.npmjs.com/signup

### 3. Log in from terminal
```bash
npm login
```
Enter your username, password, and email when prompted.

---

## Publishing

### 1. Build the library
```bash
npm run build:lib
```
This creates the `dist/` folder with the compiled components.

### 2. Check what will be published
```bash
npm pack --dry-run
```
Confirms only `dist/`, `CLAUDE.md`, and `README.md` are included.

### 3. Publish
```bash
npm publish --access public
```
`--access public` is required for scoped packages (`@omni-design/components`).

---

## Updating the version

Every publish needs a new version number. Use npm's versioning commands:

```bash
npm version patch   # 0.1.0 → 0.1.1  (bug fixes)
npm version minor   # 0.1.0 → 0.2.0  (new features)
npm version major   # 0.1.0 → 1.0.0  (breaking changes)
```
Then push the version tag to GitHub:
```bash
git push && git push --tags
```
Then publish:
```bash
npm run build:lib
npm publish --access public
```

---

## How consumers install and use it

### 1. Install peer dependencies

`@omni-design/components` is built on MUI and uses Emotion for styling. These are peer dependencies — they must be installed in the consuming app:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 2. Install OmniDesign

```bash
npm install @omni-design/components
```

### 3. Wrap your app in OmniDesignProvider

The `OmniDesignProvider` handles all MUI ThemeProvider setup, CSS injection, and token wiring automatically. No manual MUI theme configuration needed.

```jsx
import { OmniDesignProvider } from '@omni-design/components/provider';
import { Button, Card, Switch, Alert } from '@omni-design/components';

function App() {
  return (
    <OmniDesignProvider
      lightModeCSS="/styles/Light-Mode.css"
      darkModeCSS="/styles/Dark-Mode.css"
      baseCSS="/styles/base.css"
      defaultTheme="Default"
      defaultStyle="Modern"
    >
      <Button variant="primary">Hello OmniDesign</Button>
    </OmniDesignProvider>
  );
}
```

> **Why peer dependencies?** MUI is not bundled inside `@omni-design/components` to avoid shipping duplicate copies of React and MUI in apps that already use them. The consuming app provides MUI; OmniDesign provides the token-driven theme on top of it.

### Required peer dependency versions

| Package | Version |
|---------|---------|
| `react` | `>=18.0.0` |
| `react-dom` | `>=18.0.0` |
| `@mui/material` | `>=5.0.0` |
| `@mui/icons-material` | `>=5.0.0` |
| `@emotion/react` | `>=11.0.0` |
| `@emotion/styled` | `>=11.0.0` |

---

## File overview

| File | Purpose |
|------|---------|
| `rollup.config.js` | Builds `src/components/` → `dist/` for npm |
| `package.json` | npm metadata, peer deps, build scripts |
| `CLAUDE.md` | Tells AI coding tools how to use the system |
| `dist/` | Compiled output — gitignored, published to npm |

## Add dist/ to .gitignore

```bash
echo "dist/" >> .gitignore
git add .gitignore
git commit -m "Add dist to gitignore"
git push
```