/**
 * Hand-authored content for the component reference.
 *
 * Three to start — Button, Tabs and Card — because between them they exercise
 * every section: the theming split, states the browser sets, a wrong-component
 * trap, and a value that looks arbitrary until it is explained.
 */

export const BUTTON_DOC = {
  name: 'Button',
  summary: 'Triggers an action. Not for navigation — a thing that changes the URL is a Link.',
  insteadUse: [{
    when: 'It navigates somewhere',
    use: 'Link'
  }, {
    when: 'It is one of a set of mutually exclusive options',
    use: 'ButtonGroup'
  }, {
    when: 'It is the primary action floating over content',
    use: 'Fab'
  }, {
    when: 'It toggles a single on/off value',
    use: 'SwitchInput'
  }],
  props: [{
    /* One prop, two axes, so two rows.
       Figma models them separately — Style is a variant axis (solid / outline /
       ghost) and color is a Buttons MODE — and the note has said they are
       separate axes all along while the page showed them as one list. Reading
       `primary-outline` off a single row, it is not obvious which half is
       which, or that `ghost` takes no color at all. */
    name: 'variant',
    label: 'variant — shape',
    sample: 'variant',
    type: 'string',
    default: 'default',
    values: ['solid (bare)', '{color}-outline', 'ghost'],
    note: 'Color and SHAPE are separate axes, and only `-outline` is a suffix. Every color takes `{color}` and `{color}-outline`; `ghost` is written BARE, with no color prefix, because it reads from the text role (`--Hotlink` for text, `--Quiet` for icon-only) rather than a palette. `text` is an ALIAS of `ghost`, not a fourth shape — Figma\'s Style axis is solid / outline / ghost. There is no `primary-ghost`: an unknown variant warns and renders the default. **The default is `default`, not `primary`** — use `primary` only where the design explicitly marks it.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }, {
    /* The color half of the same prop. Ten values, matching the Buttons
       collection exactly — black-white included, which the FAB cannot reach.
       It was previously listed with nine: black-white is added outside the
       COLORS loop in Button.js and the doc copied the loop. */
    name: 'variant',
    label: 'variant — color',
    sample: 'variantColor',
    type: 'string',
    default: 'default',
    values: ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'black-white'],
    note: 'The same prop as the shape above — a color on its own is the solid button, and `{color}-outline` is that color as an outline. **The default is `default`, not `primary`.** `ghost` takes no color prefix, so there is no `primary-ghost`.'
  }, {
    name: 'iconOnly',
    type: 'boolean — one value of Figma\'s Type axis',
    default: 'false',
    note: 'Figma models TYPE as one axis with four exclusive values — text | iconOnly | letterNumber | Avatar. Code splits it into three independent booleans (`iconOnly`, `letterNumber`, `avatar`), with `text` being all three false, so the code can express combinations the design cannot: setting two at once is undefined. Pick exactly one. Requires an `aria-label`: the library dev-warns without one.'
  }, {
    name: 'elevated',
    type: 'boolean',
    default: 'false',
    note: 'Raises it one elevation level; a button is flat at rest and earns its shadow by being hovered.'
  }, {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    note: 'For a toggled-on button in a group. Suppresses the hover lift so a selected button does not animate when hovered again.'
  }, {
    name: 'fullWidth',
    type: 'boolean — Figma\'s Fit axis',
    default: 'false',
    note: 'Hugs its label by default; `fullWidth` stretches it to the container. There is no longer a Figma variant for this — the Fit property was removed because one button filling its parent is native auto-layout sizing, and a variant for it said one thing twice. Read the button’s horizontal sizing instead: FILL means `fullWidth`. Ignored for iconOnly and letterNumber, which are square by definition.',
    note: 'Text buttons only. It is IGNORED on `iconOnly` and `letterNumber` (Button.js:476), and Figma matches by offering `Fit` only on `Type=text` — there is no such thing as a full-width icon button.'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }, {
    name: 'startDecorator / endDecorator',
    type: 'ReactNode',
    default: 'undefined',
    note: 'An icon OR an avatar, before or after the label. Figma models these as the four booleans start-icon, start-avatar, end-icon, end-avatar. (This row read `startIcon / endIcon` until it was checked against the component — those props do not exist.)'
  }, {
    name: 'avatar',
    type: 'boolean',
    default: 'false',
    note: 'Type=Avatar in Figma. The child is an initial or a person icon; the button becomes a circle.'
  }, {
    name: 'letterNumber',
    type: 'boolean',
    default: 'false',
    note: 'Type=letterNumber in Figma — a single letter or digit. Needs an `aria-label`: the glyph is not a name.'
  }, {
    name: 'swatch',
    type: 'boolean',
    default: 'false',
    note: 'A color chip, filled from `swatchColor`. Not in the Figma Type axis.'
  }],
  states: [{
    state: 'Hover',
    setBy: 'interaction'
  }, {
    state: 'Pressed',
    setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction',
    note: '3px ring, inset 1px from the edge.'
  }, {
    state: 'Disabled',
    setBy: 'prop',
    note: 'The `disabled` prop.'
  }, {
    state: 'Selected',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on the button, or on any ancestor — it inherits.',
    inFigma: 'The Button component pins no Theme mode, so it inherits too. Set the mode on the frame it sits in.'
  }, {
    collection: 'Buttons',
    inCode: '`variant` picks the palette — `variant="success"`.',
    inFigma: 'Set the Buttons mode. Color is not a variant axis in Figma either — it arrives as a mode.'
  }],
  themingNotes: ['Color and theme are different things. `variant="success"` picks a palette; a theme moves the whole surface, including the text and border tones that have to stay readable on it.', 'A button carries no shadow at rest, so theming it is safe. Components that DO — Fab, Chip, AppBar — pin the theme on an inner node instead, so the shadow keeps reading the page.'],
  tokens: [{
    name: '--Buttons-{Color}-Button',
    sets: 'the fill',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Buttons'
  }, {
    name: '--Buttons-{Color}-Border',
    sets: 'the border',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Buttons'
  }, {
    name: '--Button-Height',
    sets: 'height',
    variesWith: 'size mode + device',
    figma: 'Button/Button-Height'
  }, {
    name: '--Button-Radius',
    sets: 'corner',
    variesWith: 'size mode',
    figma: 'Button/Button-Radius'
  }, {
    name: '--Button-Focus-Radius',
    sets: 'focus ring corner',
    variesWith: 'size mode',
    figma: 'Button/Button-Focus-Radius'
  }, {
    name: '--Button-Border-Width',
    sets: 'border thickness',
    variesWith: '—',
    figma: 'Button/Button-Border-Width'
  }, {
    name: '--Button-Padding',
    sets: 'horizontal padding',
    variesWith: 'size mode',
    figma: 'Button/Button-Padding'
  }],
  composition: ['Icons go in `startIcon` / `endIcon`, not as children.', 'A `Badge` anchors to the corner when `badge` is set — do not wrap the button yourself.'],
  accessibility: ['An icon-only button needs `aria-label`; a text button must **not** have one, or it is announced twice.', 'Name the ACTION, not the glyph: `aria-label="Delete item"`, never `aria-label="trash"`.', 'A name that says nothing — `"button"`, `"JD"`, `"3"` — is an error, not a pass. It satisfies every automated checker and silences the dev warning.'],
  gotchas: ['`--Button-Border-Width` is 1px and load-bearing: Figma computes seven other tokens from it as `outer - (border x 2)`.'],
  changes: [
    {
      version: '0.12.0',
      change: '`swatch` and `swatchColor` are retired — use the Swatch component. A swatch uses neither of Button\'s axes: its color is arbitrary data from a picker rather than a palette, and it has no solid / outline / ghost shape. Figma draws Swatch as its own component, so Button/Button-Swatch has no component left to serve.',
      migrate: 'Use <Swatch color={hex} /> — and it fixes the corner, which read --Button-Icon-Radius and so stayed square when a brand set a large radius.',
      silent: true,
    },
    {
      version: '0.12.0',
      change: 'A badged Button no longer derives a badge size from its own. It used to synthesise one, so every <Button badge> tripped Badge\'s removed-prop warning for a value the caller never wrote.',
      silent: true,
    },
    {
      version: '0.9.0',
      change: 'The `-light` shape was removed. It painted --<C>-Color-11, a tinted fill that was never a shape in the design — shape is solid / outline / ghost / text, and color arrives as a Buttons mode.',
      migrate: 'Use the solid variant of that color, or an outline on a brighter surface.',
      silent: true,
    },
  ],
};
export const TABS_DOC = {
  name: 'Tabs',
  summary: 'Switches between views in the same place. The tab list stays put; only the panel changes.',
  insteadUse: [{
    when: 'The views are sequential',
    use: 'Stepper'
  }, {
    when: 'Selecting changes the page or URL',
    use: 'Link or a nav component'
  }, {
    when: 'Panels can be open at once',
    use: 'Accordion'
  }],
  props: [{
    name: 'value / defaultValue',
    type: 'number | string',
    default: '0',
    note: 'Controlled with `value` + `onChange`, uncontrolled with `defaultValue`.'
  }, {
    name: 'orientation',
    type: 'string',
    values: ['horizontal', 'vertical-left', 'vertical-right'],
    default: 'horizontal',
    note: '`vertical` is kept as an alias for `vertical-right`. It decides which edge both the baseline and the indicator sit on.'
  }, {
    name: 'baseline',
    type: 'boolean',
    default: 'true',
    note: 'The 1px rule the tabs sit on. Turn it off where the container already separates them — an AppBar\'s own edge, for instance.'
  }, {
    name: 'variant',
    type: 'string',
    values: ['standard', 'solid', 'light', 'dark'],
    default: 'standard'
  }, {
    name: 'color',
    type: 'string',
    default: 'primary'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }, {
    name: 'scrollable',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Hover',
    setBy: 'interaction',
    note: 'Draws the indicator at 50%, previewing where selection will land.'
  }, {
    state: 'Pressed',
    setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction'
  }, {
    state: 'Selected',
    setBy: 'context',
    note: 'Derived from the Tabs `value`, never set on a Tab.'
  }, {
    state: 'Disabled',
    setBy: 'prop',
    note: 'On the individual `Tab`.'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`TabList` carries the zone: a `variant` other than `standard` sets `data-theme` + `data-surface` for every tab inside.',
    inFigma: 'Neither the Tabs nor the Tab set pins a Theme mode — both inherit. Set the mode on the frame holding the Tabs instance.'
  }, {
    collection: 'Theme',
    inCode: '`standard` sets neither, so it inherits the surface it is dropped on.',
    inFigma: 'Same behaviour, and the reason nothing is pinned: a tab bar usually belongs to the region around it.'
  }],
  tokens: [{
    name: '--Border-Variant',
    sets: 'the 1px baseline',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Buttons-{Color}-Border',
    sets: 'the 2px indicator',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Buttons'
  }, {
    name: '--Text',
    sets: 'selected label',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Quiet',
    sets: 'unselected label',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Hover',
    sets: 'hover background',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Pressed',
    sets: 'pressed background',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Focus-Visible',
    sets: 'the 3px focus ring',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Button-Height',
    sets: "a tab's minimum height",
    variesWith: 'size mode + device',
    figma: 'Button/Button-Height'
  }],
  composition: ['`<Tabs>` wraps `<TabList>` with `<Tab>` children, then `<TabPanel>` per view.', 'Icons go in `startDecorator` / `endDecorator` on a `Tab`.'],
  accessibility: ['Roles, `aria-selected` and arrow-key navigation are handled — do not add them.', 'An icon-only tab needs an `aria-label`, same rule as Button.'],
  gotchas: ['Three thicknesses, deliberately: **baseline 1px, indicator 2px, focus ring 3px**. Each has been collapsed into another at some point.', 'The focus ring uses `outline-offset: -4px`, not `-3px`. The offset is measured to the outline\'s INNER edge, so a 3px ring at -3px lands flush; -4px leaves the 1px gap the design draws.', 'The hover mark is 50% of the indicator\'s own token via `color-mix`, not `--Border-Variant` — that is the baseline\'s token, and using it would read as a thicker baseline rather than a hovered tab.']
};
export const CARD_DOC = {
  name: 'Card',
  summary: 'A surface that groups related content. Clickable only when the whole card is one target.',
  insteadUse: [{
    when: 'You only need a background',
    use: 'Section or Box'
  }, {
    when: 'It is a row in a list',
    use: 'ListItem'
  }, {
    when: 'It floats above everything and traps focus',
    use: 'Modal'
  }],
  props: [{
    name: 'variant',
    type: 'string',
    values: ['solid', 'outlined', 'ghost'],
    default: 'solid'
  }, {
    name: 'color',
    type: 'string',
    default: 'default'
  }, {
    name: 'surface',
    type: 'string',
    default: 'undefined',
    note: 'Overrides the inner content surface. A default-color card uses `Container`; pass `surface="Surface"` when the card is genuinely a Surface-level region, so `--Header` resolves to the Surface tone.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }, {
    name: 'orientation',
    type: 'string',
    values: ['vertical', 'horizontal'],
    default: 'vertical'
  }, {
    name: 'clickable',
    type: 'boolean',
    default: 'false',
    note: 'Makes the whole card a target. Without it the card is not focusable and gets no hover or pressed state.'
  }, {
    name: 'elevated',
    type: 'boolean',
    default: 'false'
  }, {
    name: 'selected',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Hover',
    setBy: 'interaction',
    note: 'Only when `clickable`.'
  }, {
    state: 'Pressed',
    setBy: 'interaction',
    note: 'Only when `clickable`.'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction',
    note: 'A 2px ring sitting 3px OUTSIDE the card — outward, unlike Tabs.'
  }, {
    state: 'Selected',
    setBy: 'prop'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on the card, or wrap it in `<Section>`.',
    inFigma: 'The Card set pins no Theme mode — it inherits. Set the mode on the frame around it.'
  }, {
    collection: 'Theme',
    inCode: '`surface="Surface"` when the card is a Surface-level region rather than a Container.',
    inFigma: '`Card Content` pins `Surface=Container`, which is what makes the inner content read Container tones. That is the node to change if a card should be a Surface.'
  }],
  themingNotes: ['Never `style={{ background }}`. It paints the box and leaves the text and borders on the parent\'s tone, which breaks the moment the surface flips dark.'],
  tokens: [{
    name: '--Background',
    sets: 'the card fill',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Text',
    sets: 'body copy',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Border',
    sets: 'the outline',
    variesWith: 'theme + surface',
    figma: 'Modes → Theme → Surface'
  }, {
    name: '--Card-Radius',
    sets: 'corner',
    variesWith: 'size mode',
    figma: 'Card/Card-Radius'
  }, {
    name: '--Card-Padding',
    sets: 'inner padding',
    variesWith: 'size mode',
    figma: 'Card/Card-Padding'
  }, {
    name: '--Card-Inner-Radius',
    sets: 'a nested surface corner',
    variesWith: 'size mode',
    figma: 'Card/Card-Inner-Radius'
  }, {
    name: '--Card-Focus-Radius',
    sets: 'focus ring corner',
    variesWith: 'size mode',
    figma: 'Card/Card-Focus-Radius'
  }],
  composition: ['Children are yours — the card adds padding and a surface, nothing else.', 'A card inside a card should be `variant="outlined"`; two nested solid surfaces read as one.'],
  accessibility: ['A `clickable` card is a button: it gets a role, focus and keyboard activation. A non-clickable one is a plain region.', 'Do not put a separate link inside a clickable card — nested targets are unreachable by keyboard.'],
  gotchas: ['The focus ring is `Card-Radius + 3` because it sits 3px outside. Tabs insets its ring instead, so the sign is opposite — a ring that crosses the card\'s own curve is this arithmetic backwards.', '`Card-Radius` is per size (small / medium / large) and so is its focus radius. A single focus radius is correct for exactly one of the three.']
};
import { FORM_DOCS } from './componentsForms';
import { SURFACE_DOCS } from './componentsSurfaces';
import { OVERLAY_DOCS } from './componentsOverlays';
import { NAV_DOCS } from './componentsNav';
import { DATA_DOCS } from './componentsData';
import { REST_DOCS } from './componentsRest';
export const BUTTON_GROUP_DOC = {
  name: 'ButtonGroup',
  summary: 'A row of buttons, spaced and grouped. Nothing in it is selected \u2014 they are things you can do, not a choice.',
  insteadUse: [{
    when: 'One of them should be selected \u2014 a choice, not a set of actions',
    use: 'ToggleButtonGroup'
  }, {
    when: 'The options need labels, help text, or more than a word each',
    use: 'RadioGroup'
  }, {
    when: 'There is one action, not a choice',
    use: 'Button'
  }, {
    when: 'It is a filter you add and remove',
    use: 'Chip with `selected`'
  }, {
    when: 'There are more than about five options',
    use: 'Select'
  }],
  props: [{
    /* Figma's ButtonGroup Style axis is Default | Separated, and this prop is
       the same decision — but it is NOT the `variant` prop, which carries
       outlined / light / ghost. Keeping them apart is the whole reason
       `separated` exists: it was once inferred from `spacing === 0`, so an
       explicit choice in the design was a side effect of a number here. */
    name: 'separated',
    type: 'boolean',
    default: 'true',
    note: 'JOINED when false — segments overlap by one border width so the shared edge is a single line, which is what makes the row read as one control. SEPARATED when true, gapped by --Platform-Spacer. Figma calls these Style=Default and Style=Separated.'
  }, {
    name: 'fit',
    type: "'hug' | 'fill' | 'equal'",
    default: "'hug'",
    note: 'HUG — each segment sizes to its own label. FILL — the group fills its container and the segments share the width equally. EQUAL — the group still hugs, but every segment matches the widest. NONE of the three is a Figma variant any more: the Fit property was removed because Fill is native sizing, and `equal` was never expressible there. Read the group’s sizing to tell hug from fill; `equal` is code-only.'
  }, {
    name: 'variant',
    type: "'outlined' | 'light' | 'ghost'",
    default: "'outlined'",
    note: 'The SHAPE of the unselected segments. The selected one is always painted by the group. `light` lightens the unselected segments by changing their SURFACE — data-surface="Surface-Brightest" — not their theme.'
  }, {
    /* No `color` on the group. A button group does not restyle what is
       inside it — each Button carries its own variant, which is why every
       button in a group looks the SAME rather than one being picked out. A
       group that paints one segment differently is a control with a value,
       and that is ToggleButtonGroup. */
    name: 'variant (on the children)',
    sample: 'variant',
    type: 'string',
    note: 'Set on each Button, not on the group. Use the same one throughout \u2014 a solid button beside two outlines reads as "this one is selected", which is the misreading the two components were split to end.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    note: 'Sets each segment’s height and padding from the button tokens — --Small-Button-Height, --Button-Height, --Large-Button-Height, with --Sm-Button-Text / --Button-Text / --Lg-Button-Text for the label. Pass it to the GROUP, not the children: it is forwarded to each segment, and a size on a child is overwritten.'
  }, {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    note: 'Vertical stacks the segments and moves the shared-edge overlap to the top border. A vertical group equalizes its segment widths on its own, so `fit="equal"` is only meaningful horizontally.'
  }, {
    /* The selection props are gone from this table. They still WORK and warn
       once, because removing them silently would leave a group that renders
       correctly and never changes — but documenting them here would keep
       teaching the thing the warning points away from. */
    name: 'aria-label',
    type: 'string',
    default: 'undefined',
    note: 'The group needs a name. Icon-only buttons inside need one each, naming the ACTION rather than the glyph \u2014 "Align left", not "left".'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    note: 'Disables every segment. A single segment takes its own `disabled`.'
  }],
  states: [{
    state: 'Selected',
    setBy: 'prop',
    note: 'Figma carries it as a Status axis on the segment sets — not-selected / selected — rather than as a State, because a segment can be selected AND hovered.'
  }, {
    state: 'Hover',
    setBy: 'interaction'
  }, {
    state: 'Pressed',
    setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction',
    note: 'Per segment, and the ring is an outline so the shared borders do not clip it.'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Buttons',
    inCode: 'The `color` prop. It writes the palette into the token name — `var(--Buttons-Primary-Button)`.',
    inFigma: 'A MODE on the Buttons collection, set on the frame. There is no color variant to pick on the instance.'
  }, {
    collection: 'Theme',
    inCode: '`data-theme` on an ancestor, or the `theme` prop on a wrapping Section.',
    inFigma: 'The segment sets pin nothing and inherit.'
  }],
  tokens: [{
    name: '--Buttons-{Color}-Button',
    sets: 'the selected segment’s fill',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Button'
  }, {
    name: '--Buttons-{Color}-Quiet',
    sets: 'the selected segment’s label at rest',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Quiet'
  }, {
    name: '--Buttons-{Color}-Text',
    sets: 'the selected segment’s label on hover, pressed and focus',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Text'
  }, {
    name: '--Buttons-{Color}-Outline-Quiet',
    sets: 'an unselected segment’s label at rest',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Outline-Quiet'
  }, {
    name: '--Buttons-{Color}-Outline-Text',
    sets: 'an unselected segment’s label on hover, pressed and focus',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Outline-Text'
  }, {
    name: '--Buttons-{Color}-Border',
    sets: 'every segment’s border, and the shared edge',
    variesWith: 'color + theme + surface',
    figma: 'Buttons → Border'
  }, {
    name: '--Hover / --Pressed',
    sets: 'an unselected segment’s hover and pressed tint',
    variesWith: 'theme + surface',
    figma: 'Surface → Hover / Pressed'
  }, {
    name: '--Platform-Spacer',
    sets: 'the gap when `separated`',
    variesWith: 'platform',
    figma: 'Devices-Type'
  }, {
    name: '--Button-Border-Width',
    sets: 'the shared-edge overlap, as a negative margin',
    variesWith: 'fixed at 1px',
    figma: 'Sizing'
  }],
  composition: [
    'Children are `Button`s, and each needs a `value`. The GROUP assigns each segment its variant — the palette when selected, `-outline` when not — so do NOT set `variant` on a child: an explicit one wins, which is how a group ends up with every segment looking selected.',
    'Pass `size` and `color` to the group, not to the children.',
    'A segment is outline or ghost. A solid child is a different control that happens to be in a row, and the group warns about it in development.'
  ],
  accessibility: [
    'The group is a `group` with an accessible name; each segment is a button with `aria-pressed`. Single-select uses `radiogroup` semantics so arrow keys move between options and one tab stop covers the whole control.',
    'Icon-only segments each need a name saying the ACTION — "Align left", not "left".',
    'Selection is not carried by color alone: the selected segment gains a fill AND `aria-pressed`, and its label moves from Quiet to Text.'
  ],
  gotchas: [
    'The joined style overlaps segments by one border width so the shared edge is a single line. Two adjacent 1px borders would read as a 2px rule between segments and a 1px one at the ends.',
    'A SELECTED segment’s fill is frozen across hover and pressed, while its label moves. --Buttons-{Color}-Hover is a LIGHTER tone, so a selected segment that took it lightened on hover and read as deselecting. Figma does move the fill, so this is a deliberate divergence.',
    '`variant="light"` changes the unselected segments’ SURFACE, not their theme. It used to name a {Color}-Light theme, which no longer exists — every one of those names bound nothing, so a light group took whatever palette the page was on.',
    '`fit="equal"` has no Figma counterpart, and cannot have one. It lays a horizontal group out as an inline-grid of equal 1fr columns so every segment matches the widest while the group still hugs — and Figma auto-layout cannot express that, because children only share space when the parent has width to share and a hugging parent has none. It is code-only by necessity rather than by omission.'
  ]
};

export const TOGGLE_BUTTON_DOC = {
  name: 'ToggleButton',
  summary: 'One button that is on or off \u2014 bold, mute, favourite.',
  insteadUse: [{
    when: 'It is one of several options and exactly one is chosen',
    use: 'ToggleButtonGroup'
  }, {
    when: 'Pressing it does something rather than turning something on',
    use: 'Button'
  }, {
    when: 'It is a setting in a form, with a label beside it',
    use: 'SwitchInput'
  }, {
    when: 'It is a row of actions',
    use: 'ButtonGroup'
  }],
  props: [{
    name: 'selected',
    type: 'boolean',
    default: 'false',
    note: 'Whether it is ON. This is the whole component \u2014 a toggle that cannot report its state is a Button.'
  }, {
    name: 'onChange',
    type: 'function',
    default: 'undefined'
  }, {
    name: 'value',
    type: 'any',
    default: 'undefined',
    note: 'Passed back on change, for a handler shared between several toggles.'
  }, {
    name: 'children',
    type: 'ReactNode',
    default: 'undefined',
    note: 'Usually an icon. Give the button an `aria-label` when it is \u2014 and name the ACTION, not the glyph.'
  }],
  states: [{ state: 'Selected', setBy: '`selected`' },
           { state: 'Hover', setBy: 'interaction' },
           { state: 'Pressed', setBy: 'interaction' },
           { state: 'Focus-visible', setBy: 'interaction' },
           { state: 'Disabled', setBy: '`disabled`' }],
  composition: [
    'A toggle is not a group of one. If there are two or more related choices and exactly one is on, that is a ToggleButtonGroup \u2014 it owns the selection, and a row of independent toggles cannot guarantee one is always chosen.',
    'An icon-only toggle needs an `aria-label` naming what it does: "Bold", not "B".',
  ],
  accessibility: [
    'It reports `aria-pressed`, which is what tells a screen reader this is a toggle rather than an action. A Button deliberately does not.',
    'Space and Enter both toggle it, as for any button.',
    '"Pressed" is announced as state, so the label should name the thing being toggled and stay the same in both states \u2014 a label that flips between "Mute" and "Unmute" says the state twice and contradicts itself.',
  ],
  gotchas: [
    'Figma has a ToggleButton PAGE with two frames and NO component set, so there is nothing to match against \u2014 no states, no sizes, no shapes. See the parity table.',
    'A second ToggleButtonGroup is defined in this component\u2019s file and deliberately NOT exported. The group you want comes from ToggleButtonGroup, which owns the selection.',
  ]
};

export const TOGGLE_BUTTON_GROUP_DOC = {
  name: 'ToggleButtonGroup',
  summary: 'A row of segments with a value, where at least one is always selected.',
  insteadUse: [{
    when: 'The buttons are actions, not a state — Save, Cancel, Delete',
    use: 'ButtonGroup'
  }, {
    when: 'The options need labels, help text, or more than a word each',
    use: 'RadioGroup'
  }, {
    when: 'It is a single on/off',
    use: 'SwitchInput'
  }, {
    when: 'There are more than about five options',
    use: 'Select'
  }],
  props: [{
    /* The one that defines the component. Everything else it shares with
       ButtonGroup, which is why the two were collapsed into one for a while. */
    name: 'allowEmpty',
    type: 'boolean',
    default: 'false',
    note: 'FALSE is what makes it a toggle group: the last selected segment cannot be turned off, and the refused click fires no onChange. Set true for a clearable multi-select that still wants toggle styling. Only meaningful with `multiple` — single select has never been able to empty, because clicking the selected segment re-selects it.'
  }, {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    note: 'Any number selected at once. `value` becomes an ARRAY and onChange receives the next array. With `allowEmpty` false that array never empties.'
  }, {
    name: 'value / defaultValue',
    type: 'string | string[]',
    default: 'undefined',
    note: 'Each child needs a `value`. Controlled with `value` + `onChange`, uncontrolled with `defaultValue`.'
  }, {
    name: 'onChange',
    type: 'function',
    default: 'undefined',
    note: 'Called (value, event) — the system`s order. MUI`s component called (event, value), and a caller signalling that older API with `exclusive` or a color in `variant` still gets it that way round.'
  }, {
    name: 'separated',
    type: 'boolean',
    default: 'false',
    note: 'JOINED when false — segments overlap by one border width so the shared edge is a single line, which is what makes the row read as one control. Figma calls these Style=Default and Style=Separated.'
  }, {
    name: 'fit',
    type: "'hug' | 'fill' | 'equal'",
    default: "'hug'",
    note: 'HUG sizes each segment to its label; FILL shares the container width equally; EQUAL hugs but matches every segment to the widest. The Figma Fit property is gone — Fill is native sizing there, and `equal` has no counterpart at all.'
  }, {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    note: 'Vertical stacks the segments and moves the shared-edge overlap to the top border. Its end caps take HALF the button radius — see --Vertical-Button-Radius.'
  }, {
    name: 'variant',
    type: "'outlined' | 'light' | 'ghost'",
    default: "'outlined'",
    note: 'The SHAPE of the unselected segments; the selected one is painted by the group. On MUI`s component this prop named the color, so a palette name here still works and warns once.'
  }, {
    name: 'color',
    type: 'string',
    values: ['default', 'primary', 'secondary', 'tertiary', 'neutral',
             'info', 'success', 'warning', 'error'],
    default: 'default',
    note: 'The palette. It paints the selected segment`s fill and every segment`s label.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    note: 'Pass it to the GROUP, not the children — it is forwarded to each segment and a size on a child is overwritten.'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Selected',
    setBy: 'prop',
    note: 'Figma carries it as a Status axis on the segment sets — not-selected / selected — rather than as a State, because a segment can be selected AND hovered.'
  }, {
    state: 'Hover', setBy: 'interaction'
  }, {
    state: 'Pressed', setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction',
    note: 'Per segment, and the ring is an outline so the shared borders do not clip it.'
  }, {
    state: 'Disabled', setBy: 'prop'
  }],
  theming: [{
    collection: 'Buttons',
    inCode: 'The `color` prop writes the palette into the token name.',
    inFigma: 'A MODE on the Buttons collection, set on the frame.'
  }],
  tokens: [
    { name: '--Buttons-{Color}-Button', sets: 'the selected segment\u2019s fill', variesWith: 'color + theme + surface', figma: 'Buttons \u2192 Button' },
    { name: '--Buttons-{Color}-Text', sets: 'the selected segment\u2019s label', variesWith: 'color + theme + surface', figma: 'Buttons \u2192 Text' },
    { name: '--Buttons-{Color}-Outline-Quiet', sets: 'an unselected label at rest', variesWith: 'color + theme + surface', figma: 'Buttons \u2192 Outline-Quiet' },
    { name: '--Buttons-{Color}-Outline-Text', sets: 'an unselected label on hover, pressed and focus', variesWith: 'color + theme + surface', figma: 'Buttons \u2192 Outline-Text' },
    { name: '--Vertical-Button-Radius', sets: 'the end caps of a vertical group', variesWith: 'size mode', figma: 'Component-Size \u2192 Button' },
  ],
  composition: [
    'Children are `Button`s, each with a `value`. The GROUP assigns each segment its variant, so do NOT set `variant` on a child — an explicit one wins, which is how a group ends up with every segment looking selected.',
    'A segment is outline or ghost. A solid child is a different control that happens to be in a row.',
  ],
  accessibility: [
    'Single select uses radiogroup semantics — arrow keys move between options and one tab stop covers the control. Multiple select is a group of buttons with `aria-pressed`.',
    'Selection is not carried by color alone: the selected segment gains a fill AND `aria-pressed`, and its label moves from Quiet to Text.',
    'Icon-only segments each need a name saying the ACTION — "Align left", not "left".',
  ],
  gotchas: [
    'The LAST selected segment cannot be turned off, and that refused click fires no onChange — firing it with an unchanged array would make a controlled caller re-render for nothing and read as a bug in their own reducer.',
    'This component was retired for a while as "ButtonGroup built a second time". The rendering is the same; the concept is not. A button group is a row of actions, none of them on. If nothing should be selected, that is ButtonGroup.',
    '`variant` names the SHAPE here and named the COLOR on MUI`s component. Both are accepted and told apart by value — the three shapes are a closed set — because there is no version of this that does not silently repaint somebody`s group.',
  ]
};

export const COMPONENT_DOCS = [BUTTON_DOC, TOGGLE_BUTTON_DOC, BUTTON_GROUP_DOC, TOGGLE_BUTTON_GROUP_DOC, TABS_DOC, CARD_DOC, ...FORM_DOCS, ...SURFACE_DOCS, ...OVERLAY_DOCS, ...NAV_DOCS, ...DATA_DOCS, ...REST_DOCS];
