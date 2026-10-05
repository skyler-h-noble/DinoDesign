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
| Stepper | `Count Step` | The number binds `Dynamic-Typography/Dynamic-Button-Number-Font-Size` (line-height bound to the SAME variable, i.e. 1em) | The library reads `--Button-Numbers` (Component-Size) | **Two different variables for one number — still open.** The file's is platform-dependent; the library's is per size mode. The CSS emits no dynamic button-number size, so the library cannot read the file's one today. Needs a decision: emit it, or rebind the text to `Button/Button-Numbers`. The line-height half is settled — bound to the font size means 1em, which is what the library draws. |
| Stepper | `Step-Line` (9383:42912) | `Status: complete \| incomplete \| incomplete-solid`, `Orientation` | `dashedIncomplete` | **Corrected — this row previously said the file had no dashed form. It does.** The dashed variant is the one named `incomplete-solid`: dash `[2,2]` across, `[4,4]` down. **The name is inverted** — `incomplete` is the SOLID line and `incomplete-solid` is the dashed one, so a converter reading the variant name emits the opposite of what it draws. Worth renaming in the file to `incomplete-dashed`. |
| Stepper | `Step-Line` | stroke `Border` (Buttons) when complete, `Quiet` (Surface) when not | was `--Buttons-{C}-Button` / `--Border` | **FIXED in the library.** The travelled segment follows the palette's border tone, not a full-strength fill; the untravelled one follows the page. Two different collections, which is the part that is easy to miss. |
| Stepper | `Step Holder` | `itemSpacing: 0`, no padding; children at x=0 / 32 / 273 against 32px circles | 8px either side of the connector, 4px above/below vertically | **FIXED in the library.** The line now meets the circle. These were margins, so the `gap: 0` already in the size table never applied. |
| Stepper | `Count Step` | Unselected circles fill `Background` | was `transparent` | **FIXED in the library.** Identical on a plain surface; differs on a Container, where transparent lets the container tone through the ring. |
| Stepper | `Count Step` | Hover/Pressed bind Buttons `Hover`/`Pressed` at **every** status | library used surface `--Hover`/`--Pressed` unless current | **FIXED in the library.** Hovering a complete or incomplete step picked up the page's grey instead of the palette's. |
| Stepper | `Count Step` | Label binds `Labels/Label-Font-Family` + the `Dynamic-Label` ramp | library rendered `Caption` / `BodySmall` | **FIXED in the library.** Now the `Label` type style at every size, since the ramp is already per size mode. Gaps too: `Sizing-Half` below, `Sizing-1` beside. |
| Stepper | `Count Step` | Current step's digit binds `Outline-Text` on a solid `Button` fill | library keeps `--Buttons-{C}-Text` | **FILE FIX NEEDED, not a library one.** Per invariant 3 the label is derived from the fill. `Outline-Text` is tuned for text on the SURFACE; it reads on this brand's default palette (dark on pink) and would be dark-on-dark on a palette whose Button is dark. The COMPLETE step is correct — no fill means it really is an outline button, and the library now matches it. |
| Stepper | `Count Step` | Completed step's label binds `Border`, a Buttons token | library now matches | **Contrast question for the file.** `Border` is a 3:1 non-text token carrying text, where text needs 4.5:1. It is consistent in the file (Default and Disabled both, with Hover/Pressed/Focus going to `Text`), so it reads as a deliberate resting tone rather than a slip — but it is the one value here that ships a known shortfall. Say the word and the library reverts to `--Text`. |
| Stepper | `Count Step` | `Status=current, State=Disabled` **exists twice** | — | **FILE BUG.** The duplicate makes `componentPropertyDefinitions` throw `Component set has existing errors`, so the set cannot be read programmatically at all. The two copies also disagree: one greys out (fill `Background`, ring/digit/label `Quiet`), the other is a byte-for-byte copy of `State=Default`. Keep the grey one. |
| Stepper | `Stepper` (8379:13867) | `Style: count \| noCount`, `Orientation`, and a `Step Slot` SLOT | `variant`, `orientation`, `children` | Matches. The slot is how the file repeats the middle steps; in code that is just `children`. |
| Stepper | `Count Step` | Pins no Buttons mode — the circle inherits, so it draws **Default** | `color` defaulted to `primary` | **FIXED in the library.** Now defaults to `default`. Nothing selected a palette, so the file and the library painted two different real colors from the same system, which read as a design choice rather than the wrong token. |
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
