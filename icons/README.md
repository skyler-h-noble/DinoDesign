# @omni-design/icons

The Material Icons as plain SVG React components — the same names, glyphs and
props as `@mui/icons-material` v7, without MUI's styling engine. An icon costs
its path data, not ~70 KB of MUI and emotion.

```bash
npm install @omni-design/icons
```

```jsx
import HomeIcon from '@omni-design/icons/Home';
import { Search, DeleteOutlined } from '@omni-design/icons';

<HomeIcon />
<HomeIcon fontSize="small" />          {/* small | medium | large | inherit */}
<HomeIcon titleAccess="Home" />         {/* gives it an accessible name */}
```

Every icon comes in five styles, as in MUI: `Home`, `HomeOutlined`,
`HomeRounded`, `HomeSharp`, `HomeTwoTone`. Figma's Icon component draws the
Default, Round and Sharp styles from the same Material Icons fonts.

Moving from `@mui/icons-material` is a change of import path. The icons keep
MUI's class names (`MuiSvgIcon-root`, `MuiSvgIcon-fontSize…`), so styles written
against them keep working. Two differences:

- `color="primary"` (and the other palette names) reads the design system's
  `--Icons-*` tokens instead of MUI's own default palette.
- `sx` takes plain CSS properties and the spacing shorthands (`mr`, `px` …);
  selectors and theme callbacks are MUI-only — use `style` or `className`.

The path data is generated from `@mui/icons-material` (MIT) at build time;
the icons are Google's Material Icons (Apache 2.0).
