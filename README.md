# @omni-design/components

React components for an OmniDesign design system. The components carry no
colors, fonts or radii of their own — they read them from your design
system's CSS, so the same code renders in any brand, in light or dark, with
text and controls that meet WCAG contrast on every background.

Design systems are made in the OmniDesign studio, which also produces the
matching Figma library.

## Install

```bash
npm install @omni-design/components @mui/material@^7 @mui/icons-material@^7 @emotion/react @emotion/styled
```

MUI 7 is required.

## Use

```jsx
import { OmniDesignProvider, OMNI_DEFAULT_THEME_URL, Section, H2, Body, Button } from '@omni-design/components';

export default function App() {
  return (
    <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>
      <Section theme="Primary" surface="Surface" padding="64px 24px">
        <H2>Hello</H2>
        <Body>Every color here comes from the design system.</Body>
        <Button variant="default">Get started</Button>
      </Section>
    </OmniDesignProvider>
  );
}
```

`OMNI_DEFAULT_THEME_URL` is the package's own theme. For your brand, pass
your design system's `theme.json` URL from the studio instead.

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — the short guide: setup, the components you
  will use, the rules. Written for AI coding tools and just as useful for
  people.
- [`docs/REFERENCE.md`](./docs/REFERENCE.md) — every component, token and
  rule in full.

TypeScript types ship with the package.

## Developing this package

```bash
npm start            # component gallery at http://localhost:3000
npm test             # unit tests
npm run build:lib    # dist/ + type declarations
npm run test:types   # compiles a strict TypeScript consumer page against dist/types
```
