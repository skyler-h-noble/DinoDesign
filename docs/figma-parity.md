# Figma ↔ library parity

What the file has, what the library has, and where they disagree. Built by
reading the Figma file directly rather than from memory — each row names what
was read and when.

Rows are only here because something is **missing or different**. A component
that agrees is not listed; silence means parity.

Last read: 2026-10-05

---

## Figma is missing variants the library has

These are cases where the library offers something the file cannot express, or
where the file has a property with only one value built. The library is not
wrong in these rows — the file has not been built out.

| Component | Figma set | What Figma has | What the library has | Note |
| --- | --- | --- | --- | --- |
| CircularProgress | `Progress Dial` | **1 variant.** `Size=Large`, `Color=Default` | `size` small/medium/large (24/40/56) + a number, 9 colors, `thickness`, `showValue` | Both properties exist with one value each, so nothing can be checked against the file. The set's frame is 80×80; the library's `large` is 56 — unresolved, because the frame may include a label. |
| LinearProgress | `Progress Bar` | **1 variant.** `Type=Progress`, `Size=Large` | `size` small/medium/large (4/6/8px), 9 colors | 8px matches the library's `large`. `Type` holds only "Progress" — whatever else it was for is unbuilt. |
| ButtonGroup / ToggleButtonGroup | `ToggleButtonGroup` | `Fit: Default \| Fill` | `fit: hug \| fill \| equal` | **`equal` cannot exist in Figma.** It means the group hugs while every segment matches the widest; auto-layout children only share space when the parent has width to share, and a hugging parent has none. Code-only by necessity. |
| ToggleButtonGroup | `Button-Group-Segments` | `Style: outline \| ghost` | `variant: outlined \| light \| ghost` | **`light` has no counterpart.** Decide whether it is code-only by design or a gap in the file. |
| Button | — | `Type: text \| iconOnly \| letterNumber \| Avatar` | same | Agrees. |
| ToggleButtonGroup | `Button-Group-Segments` | `Type: text \| letterNumber \| iconOnly` | — | No `Avatar` type, unlike the Button set. A segment cannot carry an avatar in the file; the library does not stop you. |
| Player | *(no set)* | A 400×32 sketch frame: a ToggleButtonGroup, a Slider and an icon Button, 554px of content in a 400px box, with placeholder text | A full audio bar: track info, transport, scrubber, time | Built to the shape the sketch points at, not matched to it. There is nothing to reconcile until a set exists. |
| SpeedDial | `SpeedDial` | 20 variants. `Direction: left \| right \| down \| up`, 3 Child Slots | `actions` of any length, `variant`, `color`, `direction`, `speed`, `showTooltips` | Built for exactly **three** actions — three Child Slots. No `variant` axis (solid/outline) and no color axis. |
| Footer | *(lone component)* | One COMPONENT, 1177×629. No variants, no properties | `brand`, `columns`, `address`, `socialLinks`, `copyright`, `color` | One worked example rather than an axis to match. |
| Copyright | *(lone component)* | One COMPONENT, 1177×53. No variants | `companyName`, `year`, `rights`, `color` | Nothing to match. |
| Box | *(no set)* | A page with no component set | `theme`, `surface`, `radius`, `elevation`, `component` | A box IS a frame with a theme and surface mode, so there is nothing to build. |
| NumberField | `Field Button` only | The stepper: `Increment: Up \| Down × State`, 48×32, **no size axis** | `size` small/medium/large | The stepper is 48 wide at every size because the file has one width. Should vary per size when the file grows that axis. |

## Spelled differently in two places

| Concept | Where | Where | Note |
| --- | --- | --- | --- |
| The five interaction states | `SpeedDial` uses **both** `default \| hover \| pressed \| focus-visible \| disabled` **and** `Default \| Hover \| Active \| Focus-Visible \| Disabled` | — | **Ten values for five states**, in one property on one set. `pressed` and `Active` are the same state under two names. Worth fixing in the file: nothing can read this reliably. |

| Concept | Button set | Button-Group-Segments | Note |
| --- | --- | --- | --- |
| The unselected state | `Status=unselected` | `Status=not-selected` | One idea, two spellings, in two sets that are meant to pair. The converter has to special-case it forever unless one moves. |

## Resolved

| Component | Was | Now |
| --- | --- | --- |
| Switch | Library 28×16 / 40×24 at small and medium | 35×20 / 42×24, matching the Component-Size collection. Large matched all along, which is why it read as consistent. |
| Switch | Handle derived as `trackH − 4` (16 at small); icon 8/16/16 | Handle 15/20/28 and icon 12/16/24, both read from the collection. |
| Switch | `variant="default"` painted `--Icons-Default` (neutral) | Paints `--Icons-Primary`, the mode the set pins. |
| Switch | Seven of nine variants unregistered, so they fell through to the default | All nine registered. |
| Button | `Fit: default \| fullWidth` variant | Removed. Fill is native sizing; the converter reads sizing now. |
| Radio Group | Figma set mapped to Radio's docs | Mapped to RadioGroup's, which now has a page. |
