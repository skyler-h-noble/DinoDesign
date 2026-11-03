# @omni-design/components

React components for an OmniDesign design system. The components carry no
colors, fonts or radii of their own — they read them from your design
system's CSS, so the same code renders in any brand, in light or dark, with
text and controls that meet WCAG contrast on every background.

Design systems are made in the OmniDesign studio, which also produces the
matching Figma library.

## Install

```bash
npm install @omni-design/components @omni-design/icons @mui/material@^7 @emotion/react @emotion/styled
```

MUI 7 is required. Icons come from `@omni-design/icons` (the Material Icons
as plain SVG, same names), not `@mui/icons-material`.

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
your design system's `theme.json` URL from the studio instead. The studio also
gives you a CLAUDE.md for that system — its page background, bars, buttons and
cards — to put next to this package's in your project.

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — the short guide: setup, the components you
  will use, the rules. Written for AI coding tools and just as useful for
  people.
- [`docs/API.md`](./docs/API.md) — the component API: every exported
  component's props, defaults, required parent and an example. Generated
  from the same source as the TypeScript types, so it matches them. Read
  this instead of opening `dist/`.
- [`docs/REFERENCE.md`](./docs/REFERENCE.md) — tokens, theming and rules in
  full.

TypeScript types ship with the package, for every component.

## Developing this package

```bash
npm start            # component gallery at http://localhost:3000
npm test             # unit tests
npm run build:lib    # dist/ + type declarations + docs/API.md (from types/)
npm run test:types   # compiles a strict TypeScript consumer page against dist/types,
                     # checks no component's props are `any`, and that docs/API.md is current
```
