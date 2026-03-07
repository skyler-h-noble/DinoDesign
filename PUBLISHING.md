# Publishing DynoDesign to npm

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
`--access public` is required for scoped packages (`@dynodesign/components`).

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

```bash
npm install @dynodesign/components
```

```jsx
import { DynoDesignProvider } from '@dynodesign/components/provider';
import { Button, Card, Switch, Alert } from '@dynodesign/components';

function App() {
  return (
    <DynoDesignProvider
      lightModeCSS="/styles/Light-Mode.css"
      darkModeCSS="/styles/Dark-Mode.css"
      baseCSS="/styles/base.css"
      defaultTheme="Default"
      defaultStyle="Modern"
    >
      <Button variant="primary">Hello DynoDesign</Button>
    </DynoDesignProvider>
  );
}
```

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
