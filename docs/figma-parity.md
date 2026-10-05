# Figma ↔ library parity

What the file has, what the library has, and where they disagree. Built by
reading the Figma file directly rather than from memory — each row names what
was read and when.

Rows are only here because something is **missing or different**. A component
that agrees is not listed; silence means parity.

Last read: 2026-10-05

**Summary.** 24 components documented in this pass. The library is ahead of the
file almost everywhere the two differ: six sets have properties with a single
value built, three components have a page but no set, and one — ToggleButton —
has no way to exist in Figma at all. Two things need fixing in the FILE rather
than the code, and they are at the top of the next section.

---

## Needs fixing in the file

Two of these are not gaps but mistakes — they will misread for anything that
parses the variant names, including the converter.

| Set | Problem | Why it matters |
| --- | --- | --- |
| `SpeedDial` | **Ten values in `State` for five states**: `default \| hover \| pressed \| focus-visible \| disabled` AND `Default \| Hover \| Active \| Focus-Visible \| Disabled` | Two naming conventions in one property, with `pressed` and `Active` being the same state twice. Nothing can read this reliably. |
| `Button` vs `Button-Group-Segments` | `Status=unselected` against `Status=not-selected` | One concept, two spellings, in two sets meant to pair. The converter has to special-case it forever unless one moves. |
| `Radio Group` | Pins `Icons=Warning` | Nothing in a radio group reads an Icons mode. Looks like drift; the plugin's Theme panel will now show it as its own dropdown there. |

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
| Stepper | `Count Step` | The number binds `Dynamic-Typography/Dynamic-Button-Number-Font-Size` | The library reads `--Button-Numbers` (Component-Size) | **Two different variables for one number.** The file's is platform-dependent; the library's is per size mode. The CSS emits no dynamic button-number size, so the library cannot read the file's one today. Needs a decision: emit it, or rebind the text to `Button/Button-Numbers`. |
| Stepper | `Step - Line` | `State: complete \| incomplete` | `dashedIncomplete` | Library-only. No dashed form in the file. |
| SpeedDial | `SpeedDial` | No size axis | `size` small/medium/large | **Added to the library 2026-10-05.** Dial 48/56/56 off the FAB ramp; actions stay 32 at every size; gap 8/12/16 = **`FAB/SpeedDial-Gap`**, added to Component-Size 2026-10-05 and written by the payload. Resolved. |
| SpeedDial | `SpeedDial` | No `openOnHover` | `openOnHover`, default false | **Added to the library 2026-10-05, to be added to the file.** Opens the fan on hover, on a fine pointer only, built to WCAG 1.4.13. |
| SpeedDial | `SpeedDial` | 20 variants. `Direction: left \| right \| down \| up`, 3 Child Slots | `actions` of any length, `variant`, `color`, `direction`, `speed`, `showTooltips` | Built for exactly **three** actions — three Child Slots. No `variant` axis (solid/outline) and no color axis. |
| Footer | *(lone component)* | One COMPONENT, 1177×629. No variants, no properties | `brand`, `columns`, `address`, `socialLinks`, `copyright`, `color` | One worked example rather than an axis to match. |
| Copyright | *(lone component)* | One COMPONENT, 1177×53. No variants | `companyName`, `year`, `rights`, `color` | Nothing to match. |
| ToggleButton | *(no set)* | A page with two FRAMES and no component set | `selected`, `onChange`, `value`, icon children | **The clearest gap in the file.** A single on/off button is a real control with five states, and there is nothing to build against. Everything else routes selection through ToggleButtonGroup, which cannot express a group of one. |
| Section / Stack / Container | *(no set)* | Nothing, correctly | surface and theme; flex direction and gap; max width | These are frame properties in Figma — a theme mode, auto-layout, a frame size — so there is nothing to build. Listed so the absence reads as deliberate. |
| Box | *(no set)* | A page with no component set | `theme`, `surface`, `radius`, `elevation`, `component` | A box IS a frame with a theme and surface mode, so there is nothing to build. |
| NumberField | `Field Button` only | The stepper: `Increment: Up \| Down × State`, 48×32, **no size axis** | `size` small/medium/large | The stepper is 48 wide at every size because the file has one width. Should vary per size when the file grows that axis. |

## Spelled differently in two places

| Concept | Where | Where | Note |
| --- | --- | --- | --- |
| The five interaction states | `SpeedDial` uses **both** `default \| hover \| pressed \| focus-visible \| disabled` **and** `Default \| Hover \| Active \| Focus-Visible \| Disabled` | — | **Ten values for five states**, in one property on one set. `pressed` and `Active` are the same state under two names. Worth fixing in the file: nothing can read this reliably. |

| Concept | Button set | Button-Group-Segments | Note |
| --- | --- | --- | --- |
| The unselected state | `Status=unselected` | `Status=not-selected` | One idea, two spellings, in two sets that are meant to pair. The converter has to special-case it forever unless one moves. |

## No Figma counterpart, correctly

These need no set, and the absence is deliberate rather than an oversight.
Listed so nobody goes looking.

| Component | Why |
| --- | --- |
| Section, Stack, Container, Grid, Box | Frame properties in Figma — a theme mode, auto-layout, a frame size, a layout grid. There is nothing to build. |
| Typography | Held as text styles and a 201-variable collection, not a set. |
| Gradient | A fill on a frame. |
| CurvedText | A path effect on a text layer. |
| MiniSwatch | A layer inside the Select and Menu sets rather than a component. |

## Not exported, and still has a Figma page

| Component | Figma | Note |
| --- | --- | --- |
| TransferList | Has a page | In the library but not exported — one of the three `KNOWN_GAPS` in `publicIndex.test.js`. Exporting it is an API decision, so it is flagged rather than done. |
| Sheet | Has a page | Same. |
| Progress | — | Same; superseded by CircularProgress and LinearProgress, which are exported and now documented. |

## Still undocumented

| Component | Why it was left |
| --- | --- |
| BarChart, LineChart, PieChart | Data visualisation, with their own accessibility story (`ChartTable`, hit targets, motion tokens). Worth doing carefully rather than quickly. Figma's page is "Data Visualization". |
| Colors, Spacing | These display the palette and the scale — documentation components rather than things to compose with. They may belong in Foundations instead. |
| MainLayout | An app shell. |

## Resolved

| Component | Was | Now |
| --- | --- | --- |
| Switch | Library 28×16 / 40×24 at small and medium | 35×20 / 42×24, matching the Component-Size collection. Large matched all along, which is why it read as consistent. |
| Switch | Handle derived as `trackH − 4` (16 at small); icon 8/16/16 | Handle 15/20/28 and icon 12/16/24, both read from the collection. |
| Switch | `variant="default"` painted `--Icons-Default` (neutral) | Paints `--Icons-Primary`, the mode the set pins. |
| Switch | Seven of nine variants unregistered, so they fell through to the default | All nine registered. |
| Button | `Fit: default \| fullWidth` variant | Removed. Fill is native sizing; the converter reads sizing now. |
| Radio Group | Figma set mapped to Radio's docs | Mapped to RadioGroup's, which now has a page. |
