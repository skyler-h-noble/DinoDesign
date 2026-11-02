# Self-hosted fonts

These files are served next to the theme CSS so a page never waits on
fonts.googleapis.com. The `@font-face` rules that point at them live in
`../core.css` and `../typography-tokens.css`.

| Files | Family | What was done |
| --- | --- | --- |
| `google-sans-flex-640-w72-*.woff2` | Google Sans Flex | Static instance (wdth 72, wght 640) cut from the variable font with fontTools, then split per alphabet. Google serves the full 136 KB variable font however the axes are pinned; the Latin file here is 23 KB. |
| `poppins-{400,600,700}-*.woff2` | Poppins | Google Fonts' own per-alphabet files, unchanged. |
| `raleway-400-*.woff2` | Raleway | Google Fonts' own per-alphabet files, unchanged. |

Each `@font-face` carries a `unicode-range`, so a browser downloads only
the alphabets a page actually uses.

## License

All three families are licensed under the SIL Open Font License 1.1
(https://openfontlicense.org). The OFL allows the fonts to be bundled,
subset and redistributed with software. A subset or instanced file is a
Modified Version under the license, which is allowed as long as it is not
sold by itself and keeps the license.

- Google Sans Flex: Copyright Google LLC
- Poppins: Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins)
- Raleway: Copyright 2010 The Raleway Project Authors (https://github.com/impallari/Raleway)
