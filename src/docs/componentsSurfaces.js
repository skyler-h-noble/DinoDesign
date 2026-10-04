/**
 * Icon, and the components that float above the page.
 *
 * Between them these cover the parts of the system nothing else documents: the
 * Icons collection (Icon, Tag), the shadow/theme split with a PINNED
 * Theme-Container (Fab, Snackbar), and an UNPINNED one (Accordion).
 */

const surfaceToken = (name, sets) => ({
  name,
  sets,
  variesWith: 'theme + surface',
  figma: 'Modes → Theme → Surface'
});
export const ICON_DOC = {
  name: 'Icon',
  summary: 'Wraps an icon glyph so it takes a system color and size. Decorative unless you name it.',
  /* The library ships no icons — it renders Material Symbols, which arrive
     with the brand's own font. So using Icon means knowing a symbol's NAME,
     and the name list lives on Google's site rather than here. */
  links: [{
    label: 'Browse Material Symbols',
    href: 'https://fonts.google.com/icons?icon.size=24&icon.color=%23e3e3e3',
  }],
  insteadUse: [{
    when: 'It is clickable',
    use: 'Button with iconOnly'
  }, {
    when: 'It is a person or entity',
    use: 'Avatar'
  }, {
    when: 'It carries a count',
    use: 'Badge'
  }],
  props: [{
    name: 'color',
    type: 'string',
    default: 'default',
    values: ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'quiet'],
    note: 'Picks the Icons mode. This is the only way to recolor an icon — do not pass `style={{ color }}`.'
  }, {
    name: 'size',
    type: 'string',
    values: ['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'],
    default: 'medium'
  }, {
    name: 'twoTone',
    type: 'boolean',
    default: 'false',
    note: 'Draws the glyph in the icon color with its secondary shapes at the variant alpha.'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Disabled',
    setBy: 'prop',
    note: 'An icon is decoration; it has no interactive states of its own.'
  }],
  theming: [{
    collection: 'Icons',
    inCode: '`color` — `<Icon color="primary">`. It resolves to `--Icons-Primary`.',
    inFigma: 'The Icon component binds `Vector → Icon` from the Icons collection and pins nothing, so it inherits. Set the Icons mode on it or an ancestor.'
  }],
  themingNotes: ['The Icons collection is 3 variables across 10 modes, the same shape as Buttons. Before it existed each color was its own variable in Surface, so a component had to bind to ONE — which is why Badge could only ever be an error badge in Figma.', 'In CSS there are no modes: the generator flattens each one into a name, so `--Icons-Primary` is what a consumer writes and always has been.'],
  tokens: [{
    name: '--Icons-{Color}',
    sets: 'the glyph',
    variesWith: 'theme + surface',
    figma: 'Icons → Icon'
  }, {
    name: '--Icons-Variant-{Color}',
    sets: "the glyph's secondary shapes",
    variesWith: 'theme + surface',
    figma: 'Icons → Icon-Variant'
  }, {
    name: '--Icons-On-{Color}',
    sets: 'a glyph sitting ON that color',
    variesWith: 'theme + surface',
    figma: 'Icons → On-Icon'
  }, {
    name: '--Icon-Size',
    sets: 'the glyph box',
    variesWith: 'size mode',
    figma: 'Icons & Avatars → Icon-Size'
  }],
  composition: ['Pass a MUI icon as the child — `<Icon color="primary"><CheckIcon/></Icon>`. The wrapper is what makes it take a system color.'],
  accessibility: ['Icons are `aria-hidden` by default. That is correct: an icon beside a label is decoration, and announcing it repeats the label.', 'An icon carrying meaning on its own needs an `aria-label` — but if it is also clickable, the name belongs on the Button, not the Icon, or it is announced twice.'],
  gotchas: ['`Icons & Avatars` sounds like a color collection and is not — it holds Icon-Size and Avatar-Size, and its modes (`in-button`, `in-check`, `xxs`…) are SIZES. A containing component pins it automatically; you never choose it.', 'The variant alpha is one flat number across every theme and surface (`Colors/Icon-Variant-Opacity`, 50). It was adaptive once; flattening it is what let Figma express it as alias-plus-opacity instead of 192 baked colors.']
};
export const FAB_DOC = {
  name: 'Fab',
  summary: 'The one primary action on a screen, floating above the content.',
  insteadUse: [{
    when: 'It sits in the layout rather than over it',
    use: 'Button'
  }, {
    when: 'There is more than one action',
    use: 'SpeedDial'
  }, {
    when: 'It is inside a toolbar or bar',
    use: 'Button with iconOnly'
  }],
  props: [{
    name: 'icon',
    type: 'ReactNode',
    default: 'undefined'
  }, {
    name: 'label',
    type: 'string',
    default: 'undefined',
    note: 'Shown only when `extended`.'
  }, {
    name: 'variant',
    type: 'string',
    values: ['solid', 'outline', 'ghost'],
    default: 'solid'
  }, {
    name: 'color',
    type: 'string',
    values: ['default', 'primary', 'secondary', 'tertiary', 'neutral',
             'info', 'success', 'warning', 'error', 'black-white'],
    default: 'default',
    note: 'The ten modes of Figma\'s Buttons collection. A FAB has no Color '
      + 'variant axis — in FIGMA you change its color by setting the Buttons '
      + 'MODE on the frame, and in CODE it is this prop, taking the same ten '
      + 'names. Defaults to `default`, which on a FAB resolves to the '
      + 'TERTIARY palette: a FAB floats above the content as the one primary '
      + 'action, so it is deliberately not the color of a default Button — '
      + 'otherwise it reads as just another button that happens to be round.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    note: 'Figma carries this in the Component-Size collection rather than on a '
      + 'variant axis: FAB/FAB-Width is 32 / 48 / 56 and FAB/FAB-Icon is '
      + '16 / 24 / 32, so you switch the MODE on the frame.'
  }, {
    name: 'extended',
    type: 'boolean',
    default: 'false',
    note: 'Widens it to carry a label beside the icon.'
  }, {
    name: 'animate',
    type: 'boolean',
    default: 'false',
    note: 'A slow pulse ring, for drawing the eye to a newly available action. '
      + 'Figma draws it as the FAB-Animation set (Start / Middle / End): the '
      + 'ring grows from a 0 to an 8px stroke at 50% opacity, then holds that '
      + 'width and fades to 0 — it does NOT grow and fade at the same time. '
      + 'The ring takes the button\'s own color. It stops entirely under '
      + 'prefers-reduced-motion, since an indefinite animation with no way to '
      + 'stop it is what WCAG 2.2.2 is about.'
  }, {
    name: 'ariaLabel',
    type: 'string',
    default: 'undefined',
    note: 'Required unless `extended` — an icon-only FAB has no visible name.'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Hover',
    setBy: 'interaction',
    note: 'Rises from elevation 3 to 4.'
  }, {
    state: 'Pressed',
    setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on the FAB or an ancestor.',
    inFigma: 'Set the Theme mode on the `Theme-Container` layer — **not** the variant root. The root carries the drop shadows.'
  }],
  themingNotes: ['This is the component the shadow rule exists for. A drop shadow falls on the PAGE, so it has to read the page\'s theme; the fill and bevel belong to the component. Theming the root does both and tints the shadow.', 'The root pins `Elevation`, which IS the component\'s own property. Theme inherits, elevation is pinned — that is the whole split in one sentence.'],
  tokens: [{
    name: '--Buttons-{Color}-Button',
    sets: 'the fill',
    variesWith: 'theme + surface',
    figma: 'Buttons → Button'
  }, {
    name: '--FAB-Width',
    sets: 'diameter',
    variesWith: 'size mode',
    figma: 'FAB/FAB-Width'
  }, {
    name: '--FAB-Icon',
    sets: 'the glyph',
    variesWith: 'size mode',
    figma: 'FAB/FAB-Icon'
  }, {
    name: '--FAB-Focus-Radius',
    sets: 'the focus ring',
    variesWith: 'size mode',
    figma: 'FAB/FAB-Focus-Radius'
  }],
  composition: ['One icon, or an icon plus a label when `extended`. Nothing else goes inside.'],
  accessibility: ['An icon-only FAB needs `ariaLabel` naming the ACTION — "Compose message", not "pencil".', 'There should be one FAB per screen. Two competing primary actions is a design problem no label fixes.'],
  gotchas: ['Its icon sizes are STATED, not derived: 16 / 24 / 32 against widths of 32 / 48 / 56. The large one is 32, not width/2, so the ratio does not describe them.', 'Elevation 3 at rest, 4 on hover — the highest of any component except Dialog. A FAB that does not appear to float is usually one whose shadow got themed.']
};
export const SNACKBAR_DOC = {
  name: 'Snackbar',
  summary: 'A brief message about something that just happened, which dismisses itself.',
  insteadUse: [{
    when: 'It describes the state of the page and stays',
    use: 'Alert'
  }, {
    when: 'It needs a decision before anything continues',
    use: 'Dialog'
  }, {
    when: 'It belongs to one field',
    use: "the field's validation message"
  }],
  props: [{
    name: 'open',
    type: 'boolean',
    default: 'false'
  }, {
    name: 'color',
    type: 'string',
    values: ['info', 'success', 'warning', 'error'],
    default: 'info'
  }, {
    name: 'variant',
    type: 'string',
    default: 'light'
  }, {
    name: 'anchor',
    type: 'string',
    values: ['top', 'bottom'],
    default: 'bottom'
  }, {
    name: 'autoHideDuration',
    type: 'number',
    default: 'undefined',
    note: 'Milliseconds. Omit it and the snackbar stays until dismissed.'
  }, {
    name: 'action',
    type: 'ReactNode',
    default: 'undefined',
    note: 'One action at most — a snackbar is not a dialog.'
  }, {
    name: 'onClose',
    type: 'function',
    default: 'undefined'
  }],
  states: [{
    state: 'Open',
    setBy: 'prop'
  }, {
    state: 'Auto-hiding',
    setBy: 'prop',
    note: '`autoHideDuration` starts the timer; the component calls `onClose`.'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`color` picks the semantic palette. A snackbar rarely wants `data-theme` — the color is the message.',
    inFigma: 'Set the Theme mode on `Theme-Container`. All eight colors are pinned there, one per variant, alongside `Surface-Brightest`.'
  }],
  tokens: [surfaceToken('--Background', 'the bar'), surfaceToken('--Text', 'the message'), {
    name: '--SnackBar-Top / --SnackBar-Bottom',
    sets: 'distance from the edge',
    variesWith: '—',
    figma: '—'
  }],
  composition: ['Message as children, one action in `action`, an icon in `startDecorator`.', 'It positions itself from `anchor` — do not wrap it in your own fixed container.'],
  accessibility: ['A snackbar that disappears on a timer is unreadable for anyone who needs longer. Give an action or a dismiss for anything that matters.', 'It announces politely by default; an error should be assertive so it interrupts.'],
  gotchas: ['Its offsets read `var(--SnackBar-Top, 24px)` so a brand can move it, but nothing generates those tokens — the fallback is what ships unless a consumer defines them.']
};
export const ACCORDION_DOC = {
  name: 'Accordion',
  summary: 'Collapses a section of content behind its own heading.',
  insteadUse: [{
    when: 'Only one section may be open and they are peers',
    use: 'Tabs'
  }, {
    when: 'The content is a sequence',
    use: 'Stepper'
  }, {
    when: 'It is a menu',
    use: 'Dropdown'
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
    default: 'undefined'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }, {
    name: 'spacing',
    type: 'number',
    default: '0',
    note: '0 joins the segments into one block; above 0 they float separately.'
  }, {
    name: 'defaultExpanded',
    type: 'boolean',
    default: 'false'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
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
    note: 'A lone segment gets an OUTER ring; a stacked one an inner ring, because an outer one would overlap its neighbour.'
  }, {
    state: 'Expanded',
    setBy: 'prop'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on the accordion or an ancestor.',
    inFigma: 'Set the Theme mode on `Theme-Container`. It is UNPINNED, so an accordion inherits until you choose otherwise — the layer marks the place, it does not fix a color.'
  }],
  themingNotes: ['Its structure is the model for the shadow rule: `Vertical Container` carries four drop shadows, `Theme-Container` inside it carries the fill and stroke. Theme the inner one and the shadow keeps reading the page.'],
  tokens: [surfaceToken('--Background', 'the segment fill'), surfaceToken('--Border', 'the outline'), {
    name: '--Accordion-Radius',
    sets: 'corner',
    variesWith: 'size mode',
    figma: 'Accordion/Accordion-Radius'
  }, {
    name: '--Accordion-Focus-Radius',
    sets: 'the outer ring',
    variesWith: 'size mode',
    figma: 'Accordion/Accordion-Focus-Radius'
  }, {
    name: '--Accordion-Inner-Focus-Radius',
    sets: 'the inner ring',
    variesWith: 'size mode',
    figma: 'Accordion/Accordion-Inner-Focus-Radius'
  }],
  composition: ['A summary and a details region per segment; several segments stack into one accordion.'],
  accessibility: ['The summary is a button that toggles the details and carries `aria-expanded`.', 'Do not nest an accordion inside an accordion — the heading levels stop making sense.'],
  gotchas: ['Two focus radii, and they are not a mistake: `Accordion-Focus-Radius` is `radius + 3` for the outer ring, `Accordion-Inner-Focus-Radius` is `max(0, radius − 3)` for the inner one. CSS needs neither — a browser draws an outline concentric with the border — but Figma cannot do arithmetic on a variable, so both are stated.']
};

export const BRANDICON_DOC = {
  name: 'BrandIcon',
  summary: 'A company or service mark — GitHub, LinkedIn, Figma. Somebody else\'s artwork, not ours.',
  /* A DIFFERENT list from Icon's, and the separation is the point. Icon is
     Material Symbols; this is Font Awesome 6 Brands, matching the Figma
     Brand-Icons component, which is that font as a ligature. Sending someone
     to the Material list for a brand mark would be sending them somewhere the
     name does not exist. */
  links: [{
    label: 'Browse Font Awesome Brands',
    /* Filtered to the FREE collection. The brand marks are all free, but an
       unfiltered search mixes in Pro results, so the first thing someone sees
       can be a glyph this font does not have — and a ligature miss renders
       blank rather than erroring, which reads as the component being broken
       rather than the name being unavailable. */
    href: 'https://fontawesome.com/search?f=brands&ic=free-collection',
  }],
  insteadUse: [{
    when: 'It is part of the system\'s own vocabulary — a chevron, a trash can',
    use: 'Icon'
  }, {
    when: 'It is clickable on its own',
    use: 'Button with iconOnly, wrapping this'
  }, {
    when: 'It is a person or entity',
    use: 'Avatar'
  }],
  props: [{
    name: 'name',
    type: 'string',
    default: 'undefined',
    note: 'Lowercase and hyphenated, exactly as Font Awesome lists it and as '
      + 'Figma\'s Brand-Icons text layer holds it: `github`, `linkedin`, '
      + '`instagram`, `dribbble`, `x-twitter`. An unknown name renders NOTHING '
      + 'and warns in development rather than drawing a wrong or empty glyph.'
  }, {
    name: 'color',
    type: 'string',
    default: 'currentColor',
    note: 'HOW TO CHANGE THE COLOUR. In CODE, pass any CSS color or token — '
      + '`color="var(--Icons-Primary)"`. Left alone it is `currentColor`, so it '
      + 'takes the color of the text around it, which is what you want beside '
      + 'a label. In FIGMA it is a TEXT layer in a ligature font, so its color '
      + 'is the layer\'s FILL: bind that to a variable the way any text fill is '
      + 'bound. There is no color variant on the component and there should '
      + 'not be — 610 glyphs times a color axis is a set nobody can load.'
  }, {
    name: 'size',
    type: 'string',
    default: '1em',
    note: 'Any CSS length. 1em by default so it rides the text beside it '
      + 'instead of needing to be kept in step with it.'
  }, {
    name: 'title',
    type: 'string',
    default: 'undefined',
    note: 'The accessible name. Omit it for decoration beside visible text — '
      + 'the mark is then aria-hidden, which is the common case in a footer '
      + 'where the link already says "GitHub". Give it only when the mark is '
      + 'the only thing identifying the destination.'
  }],
  states: [{
    state: 'Unknown name',
    setBy: 'prop',
    note: 'Renders nothing and warns in development. A wrong logo is worse '
      + 'than no logo: it looks deliberate.'
  }],
  theming: [{
    collection: 'Icons',
    inCode: 'Inherits currentColor, so it follows whatever text role surrounds '
      + 'it. Pass `color` to pin it to an Icons token instead.',
    inFigma: 'The glyph is text, so it takes the text layer\'s fill. Bind it to '
      + 'Icons/* or Text like any other.'
  }],
  themingNotes: [
    'Monochrome, deliberately. There is no "official brand color" mode: a row '
      + 'of logos in their own corporate colors cannot meet a contrast '
      + 'requirement, because each one is a fixed hex that knows nothing about '
      + 'the surface behind it.',
    'Separate from Icon on purpose. Icon renders the design system\'s own '
      + 'vocabulary and takes the brand\'s icon color and ramp. A brand mark '
      + 'cannot be derived, is not ours to restyle, and carries a trademark.',
  ],
  tokens: [
    { name: 'currentColor', sets: 'the glyph', variesWith: 'the text role around it', figma: 'the text layer fill' },
  ],
  composition: [
    'In a footer, wrap it in the link and let the link own the accessible name.',
    'For a clickable mark on its own, put it inside <Button iconOnly aria-label="...">.',
  ],
  accessibility: [
    'aria-hidden unless you pass `title`, so a mark beside visible text is not '
      + 'announced twice.',
    'Name the DESTINATION, not the glyph — "GitHub", not "octocat".',
  ],
  gotchas: [
    'Path data comes from @fortawesome/free-brands-svg-icons rather than being '
      + 'drawn by hand, because a hand-copied path is a subtly wrong logo and no '
      + 'diff review catches it.',
    'Figma draws these with the Font Awesome 6 Brands LIGATURE font — one '
      + 'component, type the name into the text layer. The web has no bundled '
      + 'ligature equivalent, so the name is resolved to path data instead: '
      + 'same input, same output, different mechanism.',
  ],
  changes: [],
};

export const SURFACE_DOCS = [ICON_DOC, BRANDICON_DOC, FAB_DOC, SNACKBAR_DOC, ACCORDION_DOC];
