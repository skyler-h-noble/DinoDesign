# Getting Started with Dyno Design System

## What is Dyno?

Dyno is a brand-adaptive React component library. Components automatically inherit
their visual style from the theme context around them — colors, typography, spacing,
shadows, and interaction states all resolve at runtime from CSS variables. Swapping
a brand requires only replacing the token CSS files; no component code changes.

---

## Prerequisites

- React 18+
- A Dyno theme URL (provided by Dino after brand generation) **or** local CSS files

---

## Installation

```bash
npm install @dyno/components
```

---

## Setup

Wrap your app root once with `DynoDesignProvider`. That's the only configuration
required.

### Option A — Theme URL (recommended for production)

Point to a hosted Dino-generated theme. The Provider fetches the CSS files
automatically and injects them into the page.

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DynoDesignProvider } from '@dyno/components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DynoDesignProvider themeURL="https://your-theme-cdn.com/brand">
      <App />
    </DynoDesignProvider>
  </React.StrictMode>
);
```

### Option B — Local CSS files (local dev / self-hosted)

```jsx
<DynoDesignProvider
  foundationCSS="/styles/base.css"
  lightModeCSS="/styles/light-mode.css"
  darkModeCSS="/styles/dark-mode.css"
  stylesCSS="/styles/themes.css"
  defaultTheme="Default"
  defaultStyle="Modern"
>
  <App />
</DynoDesignProvider>
```

### Option C — No Provider (CSS imported directly)

If you manage CSS loading yourself, just import the files and use components
directly. No Provider needed.

```jsx
import '@dyno/tokens/base.css';
import '@dyno/tokens/light-mode.css';
import '@dyno/tokens/themes.css';

// Components work without a Provider
<Card variant="solid" color="primary">
  <Button color="primary">Click me</Button>
</Card>
```

---

## Your First Component

Once the Provider is set up, import and use components anywhere in your app.
No additional wiring required — components inherit the active theme automatically.

```jsx
import { Button } from '@dyno/components';

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
import { Card, CardContent, Button } from '@dyno/components';

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

`DynoDesignProvider` manages dark mode for you. Toggle it with the
`useDynoDesign` hook:

```jsx
import { useDynoDesign } from '@dyno/components';

function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDynoDesign();

  return (
    <Button color="neutral" onClick={toggleDarkMode}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
```

Or start in dark mode by default:

```jsx
<DynoDesignProvider
  themeURL="..."
  defaultDarkMode={true}
>
  <App />
</DynoDesignProvider>
```

Or control it externally:

```jsx
const [dark, setDark] = useState(false);

<DynoDesignProvider
  themeURL="..."
  darkMode={dark}
  onDarkModeChange={setDark}
>
  <App />
</DynoDesignProvider>
```

---

## Changing the Active Theme

Use `setTheme` from `useDynoDesign` to change the root theme at runtime:

```jsx
import { useDynoDesign } from '@dyno/components';

function ThemeSwitcher() {
  const { theme, setTheme } = useDynoDesign();

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

## DynoDesignProvider Props

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

## useDynoDesign Hook

Access the active theme state anywhere inside the Provider:

```jsx
import { useDynoDesign } from '@dyno/components';

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
} = useDynoDesign();
```

---

## Handling CSS Load State

The Provider loads CSS asynchronously. Use `cssStatus` if you need to wait
before rendering:

```jsx
function App() {
  const { cssStatus, cssError } = useDynoDesign();

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
import type { DynoTheme, DynoSurface, DynoStyle } from '@dyno/components';
```

---

## Using with Cursor / AI Agents

Dyno ships a `.cursorrules` file that tells Cursor exactly how to use your design system. 

### Option A — Copy from node_modules (quickest)
After installing, copy the file into your project root:
```bash
cp node_modules/@dynodesign/components/.cursorrules .cursorrules
```

### Option B — Copy and paste
Create a `.cursorrules` file at your project root and paste this in:
```
This project uses the @dynodesign/components design system.

Read these docs before writing any code:
- node_modules/@dynodesign/components/docs/getting-started.md
- node_modules/@dynodesign/components/docs/token-system.md
- node_modules/@dynodesign/components/docs/components.md

ALWAYS import components from '@dynodesign/components'
ALWAYS import CSS at the top of App.js:
  import '@dynodesign/components/public/styles/foundations.css'
  import '@dynodesign/components/public/styles/core.css'
  import '@dynodesign/components/public/styles/Light-Mode.css'
  import '@dynodesign/components/public/styles/base.css'

ALWAYS wrap content in a div with data-theme, data-surface, and data-style attributes.
```

Once in place, any prompt you give Cursor will automatically use your Dyno components correctly.

## Next Steps

- **[Token System](./token-system.md)** — how CSS variables cascade through layers
- **[Components](./components.md)** — full component API reference
- **[Theming](./theming.md)** — advanced theme nesting and surface patterns
- **[Generating a Brand](./brand-generation.md)** — how Dino creates token files from an image
