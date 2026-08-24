# Getting Started with Dyno Design System

## What is Dyno?

Dyno is a brand-adaptive React component library. Components automatically inherit
their visual style from the theme context around them — colors, typography, spacing,
shadows, and interaction states all resolve at runtime from CSS variables. Swapping
a brand requires only replacing the token CSS files; no component code changes.

---

## Prerequisites

- React 18+
- A Dyno theme URL (provided by OmniDesign after brand generation) **or** local CSS files

---

## Installation

### 1. Install peer dependencies

`@omnidesign/components` is built on MUI and uses Emotion for styling. These must be installed in your app — they are not bundled inside the package:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 2. Install OmniDesign

```bash
npm install @omnidesign/components
```

> **Why peer dependencies?** MUI is not bundled inside `@omnidesign/components` to avoid shipping duplicate copies of React and MUI in apps that already use them. Your app provides MUI; OmniDesign provides the token-driven theme layer on top of it. You never need to configure MUI directly — `OmniDesignProvider` handles all of that automatically.

### Required peer dependency versions

| Package | Minimum Version |
|---------|----------------|
| `react` | `18.0.0` |
| `react-dom` | `18.0.0` |
| `@mui/material` | `5.0.0` |
| `@mui/icons-material` | `5.0.0` |
| `@emotion/react` | `11.0.0` |
| `@emotion/styled` | `11.0.0` |

---

## Setup

Wrap your app root once with `OmniDesignProvider`. That's the only configuration
required.

### Option A — Theme URL (recommended for production)

Point to a hosted Dino-generated theme. The Provider reads the manifest, then
loads each CSS file as a `<link rel="stylesheet">` tag so the browser fetches
them in parallel, caches them, and blocks paint until they apply — no flash
of unbranded styling. The Provider wrapper is `visibility: hidden` while the
sheets load and becomes visible the moment they're ready.

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { OmniDesignProvider } from '@omnidesign/components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OmniDesignProvider themeURL="https://your-theme-cdn.com/brand">
      <App />
    </OmniDesignProvider>
  </React.StrictMode>
);
```

### Option B — Local CSS files (local dev / self-hosted)

```jsx
<OmniDesignProvider
  foundationCSS="/styles/base.css"
  lightModeCSS="/styles/light-mode.css"
  darkModeCSS="/styles/dark-mode.css"
  stylesCSS="/styles/themes.css"
  defaultTheme="Default"
  defaultStyle="Modern"
>
  <App />
</OmniDesignProvider>
```

### Option C — No Provider (CSS imported directly)

If you manage CSS loading yourself, just import the files and use components
directly. No Provider needed.

```jsx
import '@omnidesign/tokens/base.css';
import '@omnidesign/tokens/light-mode.css';
import '@omnidesign/tokens/themes.css';

// Components work without a Provider
<Card variant="solid" color="primary">
  <Button color="primary">Click me</Button>
</Card>
```

### Option D — Render-blocking `<link>` in HTML (fastest first paint)

The Provider's `<link>` injection (Options A/B) loads CSS as fast as
JavaScript can mount the React tree — but the JS bundle still has to
download first. For the fastest possible time-to-styled-paint, put the
brand `<link>` tags directly in your HTML's `<head>`, *before* the bundle.
The browser fetches CSS in parallel with JS, then applies it before the
React tree first renders.

```html
<!-- public/index.html (or your SSR template) -->
<head>
  <link rel="preconnect" href="https://your-theme-cdn.com" crossorigin>
  <link rel="stylesheet" id="omni-foundation" data-omni="true" href="https://your-theme-cdn.com/<uuid>/foundation.css">
  <link rel="stylesheet" id="omni-core"       data-omni="true" href="https://your-theme-cdn.com/<uuid>/core.css">
  <link rel="stylesheet" id="omni-mode"       data-omni="true" href="https://your-theme-cdn.com/<uuid>/Light-Mode.css">
  <link rel="stylesheet" id="omni-base"       data-omni="true" href="https://your-theme-cdn.com/<uuid>/base.css">
  <link rel="stylesheet" id="omni-styles"     data-omni="true" href="https://your-theme-cdn.com/<uuid>/styles.css">
  <script type="module" src="/main.js" defer></script>
</head>
```

The `id="omni-*"` attributes match the Provider's internal tag ids — so
when `<OmniDesignProvider>` later calls `loadCSSSource`, it finds the
existing `<link>` by id and uses it instead of re-fetching.

Mount the Provider with `themeURL` (or individual props) anyway so dark-mode
swap still works — the Provider's `<link>` adoption skips the initial fetch
but it still needs to know about the dark-mode source to swap on toggle.

If you're hosting on a platform with edge functions (Netlify, Vercel,
Cloudflare), this can be automated per-request by reading a query
parameter or subdomain and templating the `<link>` tags in. See
`netlify/edge-functions/playground-css.ts` in the OmniDesign Studio repo
for a reference implementation.

---

## Your First Component

Once the Provider is set up, import and use components anywhere in your app.
No additional wiring required — components inherit the active theme automatically.

```jsx
import { Button } from '@omnidesign/components';

function MyPage() {
  return (
    <Button color="primary" variant="solid">
      Get Started
    </Button>
  );
}
```

---

## Theme Inheritance

Components automatically adapt to the theme of their nearest surface ancestor.
You never need to pass a theme down manually.

```jsx
import { Card, CardContent, Button } from '@omnidesign/components';

// Card sets the surface context — Button inherits it automatically
<Card variant="solid" color="primary">
  <CardContent>
    <p>Everything inside this card reads Primary theme variables.</p>
    <Button color="primary">Confirm</Button>
  </CardContent>
</Card>
```

To nest a different theme inside another:

```jsx
// Outer context: Primary
<Card variant="solid" color="primary">
  <CardContent>
    {/* Inner context: Default — Card inherits from its own data-theme */}
    <Card variant="default">
      <Button color="primary">Different surface, same button</Button>
    </Card>
  </CardContent>
</Card>
```

---

## Dark Mode

`OmniDesignProvider` manages dark mode for you. Toggle it with the
`useOmniDesign` hook:

```jsx
import { useOmniDesign } from '@omnidesign/components';

function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useOmniDesign();

  return (
    <Button color="neutral" onClick={toggleDarkMode}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
```

Or start in dark mode by default:

```jsx
<OmniDesignProvider
  themeURL="..."
  defaultDarkMode={true}
>
  <App />
</OmniDesignProvider>
```

Or control it externally:

```jsx
const [dark, setDark] = useState(false);

<OmniDesignProvider
  themeURL="..."
  darkMode={dark}
  onDarkModeChange={setDark}
>
  <App />
</OmniDesignProvider>
```

---

## Changing the Active Theme

Use `setTheme` from `useOmniDesign` to change the root theme at runtime:

```jsx
import { useOmniDesign } from '@omnidesign/components';

function ThemeSwitcher() {
  const { theme, setTheme } = useOmniDesign();

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="Default">Default</option>
      <option value="Primary">Primary</option>
      <option value="Secondary">Secondary</option>
      <option value="Neutral">Neutral</option>
    </select>
  );
}
```

---

## OmniDesignProvider Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `themeURL` | string | — | Base URL of a Dino-generated theme folder |
| `foundationCSS` | string | — | URL or raw CSS string for base tokens |
| `lightModeCSS` | string | — | URL or raw CSS string for light mode |
| `darkModeCSS` | string | — | URL or raw CSS string for dark mode |
| `stylesCSS` | string | — | URL or raw CSS string for theme selectors |
| `defaultTheme` | string | `'Default'` | Starting theme |
| `defaultStyle` | string | `'Modern'` | Starting style variant |
| `defaultSurface` | string | `'Surface'` | Root surface type |
| `defaultDarkMode` | boolean | `false` | Start in dark mode |
| `darkMode` | boolean | — | Controlled dark mode |
| `onDarkModeChange` | function | — | Controlled dark mode handler |
| `fullHeight` | boolean | `true` | Adds `minHeight: 100vh` to root div |
| `className` | string | — | Class on root div |
| `style` | object | — | Inline styles on root div |

---

## useOmniDesign Hook

Access the active theme state anywhere inside the Provider:

```jsx
import { useOmniDesign } from '@omnidesign/components';

const {
  theme,           // active theme name e.g. 'Primary'
  style,           // active style variant e.g. 'Modern'
  surface,         // root surface type e.g. 'Surface'
  isDark,          // boolean
  cssStatus,       // 'loading' | 'ready' | 'error'
  cssError,        // error message string or null
  setTheme,        // (themeName: string) => void
  setStyle,        // (styleName: string) => void
  setSurface,      // (surfaceName: string) => void
  toggleDarkMode,  // () => void
  themes,          // string[] — all valid theme names
  styles,          // string[] — all valid style names
  surfaces,        // string[] — all valid surface names
} = useOmniDesign();
```

---

## Handling CSS Load State

The Provider loads CSS asynchronously. Use `cssStatus` if you need to wait
before rendering:

```jsx
function App() {
  const { cssStatus, cssError } = useOmniDesign();

  if (cssStatus === 'loading') return <div>Loading theme...</div>;
  if (cssStatus === 'error')   return <div>Theme error: {cssError}</div>;

  return <YourApp />;
}
```

---

## Available Themes

```
Default
Primary-Light    Primary    Primary-Dark
Secondary-Light  Secondary  Secondary-Dark
Tertiary-Light   Tertiary   Tertiary-Dark
Neutral-Light    Neutral    Neutral-Dark
Info-Light       Success-Light   Warning-Light   Error-Light
Info-Dark        Success-Dark    Warning-Dark    Error-Dark
App-Bar          Nav-Bar         Status
```

## Available Surfaces

```
Surface    Surface-Dim    Surface-Bright
Container  Container-Low  Container-Lowest  Container-High  Container-Highest
```

## Available Styles

```
Professional   Modern   Bold   Playful
```

---

## TypeScript

Types are included. Import them as needed:

```ts
import type { DynoTheme, DynoSurface, DynoStyle } from '@omnidesign/components';
```

---

## Using with Cursor / AI Agents

Dyno ships a `.cursorrules` file that tells Cursor exactly how to use your design system. 

### Option A — Copy from node_modules (quickest)
After installing, copy the file into your project root:
```bash
cp node_modules/@omnidesign/components/.cursorrules .cursorrules
```

### Option B — Copy and paste
Create a `.cursorrules` file at your project root and paste this in:
```
This project uses the @omnidesign/components design system.

Read these docs before writing any code:
- node_modules/@omnidesign/components/docs/getting-started.md
- node_modules/@omnidesign/components/docs/token-system.md
- node_modules/@omnidesign/components/docs/components.md

ALWAYS import components from '@omnidesign/components'
ALWAYS import CSS at the top of App.js:
  import '@omnidesign/components/public/styles/foundation.css'
  import '@omnidesign/components/public/styles/core.css'
  import '@omnidesign/components/public/styles/Light-Mode.css'
  import '@omnidesign/components/public/styles/base.css'

ALWAYS wrap content in a div with data-theme, data-surface, and data-style attributes.
```

Once in place, any prompt you give Cursor will automatically use your Dyno components correctly.

## Next Steps

- **[Token System](./token-system.md)** — how CSS variables cascade through layers
- **[Components](./components.md)** — full component API reference
- **[Theming](./theming.md)** — advanced theme nesting and surface patterns
- **[Generating a Brand](./brand-generation.md)** — how Dino creates token files from an image