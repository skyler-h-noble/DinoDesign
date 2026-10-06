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
    default: 'solid',
    note: 'Solid is the only shape. The design\u2019s FAB set has no shape axis \u2014 its axes are State plus the Extended and Animate booleans \u2014 so outline and ghost FABs were library inventions. Anything else normalises to solid and warns in development.'
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

export const BOX_DOC = {
  name: 'Box',
  summary: 'A div that can paint a surface: theme, level, radius and elevation, without writing a color.',
  insteadUse: [{
    when: 'The region is a section of a page',
    use: 'Section'
  }, {
    when: 'It is a card with the system\u2019s own chrome',
    use: 'Card'
  }, {
    when: 'You only need to lay children out',
    use: 'Stack'
  }],
  props: [{
    name: 'theme / surface',
    type: 'string',
    default: 'undefined',
    note: 'Sets `data-theme` / `data-surface`, which is what exposes the whole paired token set. Absent means inherit \u2014 do not pass an empty string.'
  }, {
    name: 'radius',
    type: 'string',
    values: ['none', 'small', 'medium', 'large'],
    default: 'none',
    note: 'Reads the brand\u2019s own corner tokens rather than a fixed px, so a square brand stays square.'
  }, {
    name: 'elevation',
    type: 'number',
    default: '0',
    note: '0\u20135. The shadow AND the container tone move together \u2014 elevation is a level, not just a shadow.'
  }, {
    name: 'component',
    type: 'string',
    default: 'div',
    note: 'The element to render. Use it to keep the markup honest: a Box standing in for a `<section>` or `<aside>` should say so.'
  }],
  composition: [
    'This is the primitive the rule "never write `background: var(--Surface)`" points at. Set `theme` and `surface` and the background, text, border and state tones all arrive together, tuned for that level.',
    'It has no padding of its own. Padding is the layout\u2019s decision, and a box that padded itself could not be used as a plain surface.',
  ],
  accessibility: [
    'A div by default, so it contributes nothing to the accessibility tree \u2014 which is right for a surface. Pass `component` when it is really a landmark.',
    'Changing `surface` changes contrast for everything inside it, and the paired tokens are what keep that legible. Painting a background by hand is what breaks it.',
  ],
  gotchas: [
    'Figma has a Box page with no component set. There is nothing to match variant by variant; a box IS a frame with a theme and surface mode on it, which is the same thing this component does.',
    '`elevation` is not only a shadow: the container tone moves with it, and the shadow direction flips in dark mode. Setting a `box-shadow` by hand gets the first half and not the second.',
  ]
};

export const FOOTER_DOC = {
  name: 'Footer',
  summary: 'The bottom of a page: the brand, the columns of links, and the line that says who owns it.',
  insteadUse: [{
    when: 'It is the bar at the top',
    use: 'AppBar'
  }, {
    when: 'It is navigation down the side',
    use: 'Sidebar'
  }, {
    when: 'You only need the legal line',
    use: 'Copyright'
  }],
  props: [{
    name: 'brand',
    type: 'ReactNode',
    default: 'undefined'
  }, {
    name: 'columns',
    type: 'Array<{ title, links }>',
    default: '[]',
    note: 'The link columns. Each is a heading and its list.'
  }, {
    name: 'address',
    type: 'ReactNode',
    default: 'undefined'
  }, {
    name: 'socialLinks',
    type: 'Array<{ icon, href, label }>',
    default: '[]',
    note: 'Each needs a `label` \u2014 a social icon with no name announces as nothing.'
  }, {
    name: 'copyright',
    type: 'ReactNode',
    default: 'undefined',
    note: 'Rendered through Copyright when a string, so the year stays current on its own.'
  }, {
    name: 'color',
    type: 'string',
    default: 'default'
  }],
  composition: [
    'A footer is a landmark. It renders as `<footer>`, so there should be one per page and it should hold the page\u2019s own ending rather than a repeated block inside a region.',
  ],
  accessibility: [
    'Renders as `<footer>`, which is the `contentinfo` landmark \u2014 screen reader users jump to it directly.',
    'Every social link needs a label. An icon alone is announced as "link" and nothing else.',
  ],
  gotchas: [
    'Figma\u2019s Footer is a single COMPONENT, not a set \u2014 1177\u00d7629, no variants and no properties. So its layout is one worked example rather than an axis to match; the columns, the social row and the legal line are all composed here rather than selected.',
  ]
};

export const COPYRIGHT_DOC = {
  name: 'Copyright',
  summary: 'The legal line at the bottom, with the year kept current on its own.',
  insteadUse: [{
    when: 'You need the whole bottom of the page',
    use: 'Footer'
  }],
  props: [{
    name: 'companyName',
    type: 'string',
    default: 'undefined'
  }, {
    name: 'year',
    type: 'number',
    default: 'the current year',
    note: 'Pass one only to pin it. The default reads the clock, which is the point: a hardcoded year is wrong every January.'
  }, {
    name: 'rights',
    type: 'string',
    default: 'All rights reserved.'
  }, {
    name: 'color',
    type: 'string',
    default: 'default'
  }],
  composition: [
    'Let `year` default. The one thing this component is for is not having to remember to change it.',
  ],
  accessibility: [
    'Plain text in the footer landmark. It carries no role of its own because it is a statement, not a control.',
  ],
  gotchas: [
    'Figma\u2019s Copyright is a single COMPONENT (1177\u00d753) with no variants, so there is no axis to match.',
  ]
};

export const SPEED_DIAL_DOC = {
  name: 'SpeedDial',
  summary: 'A floating button that opens a small set of related actions.',
  insteadUse: [{
    when: 'There is one primary action',
    use: 'Fab'
  }, {
    when: 'The actions belong to a selection or a panel',
    use: 'Toolbar'
  }, {
    when: 'It is a list of commands rather than 3\u20135 actions',
    use: 'Menu'
  }],
  props: [{
    name: 'actions',
    type: 'Array<{ icon, name, onClick }>',
    default: '[]',
    note: 'Three to five. More than that is a menu \u2014 a fan of icons stops being scannable.'
  }, {
    name: 'variant',
    type: 'string',
    default: 'solid',
    note: 'Solid is the only shape. The design\u2019s FAB set has no shape axis \u2014 its axes are State plus the Extended and Animate booleans \u2014 so outline and ghost FABs were library inventions. Anything else normalises to solid and warns in development.'
  }, {
    name: 'color',
    type: 'string',
    default: 'default'
  }, {
    name: 'direction',
    type: 'string',
    values: ['up', 'down', 'left', 'right'],
    default: 'up',
    note: 'Which way the actions fan. Match it to where the dial sits \u2014 a bottom-right dial opens up.'
  }, {
    name: 'speed',
    type: 'number',
    default: '50',
    note: 'Milliseconds between each action appearing, so they stagger rather than arriving at once.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    note: 'Steps the dial down the FAB ramp (48 / 56 / 56) and the gap along the sizing scale (8 / 12 / 16, which is `SpeedDial-Gap`). The ACTIONS stay 32 at every size \u2014 the hierarchy comes from the dial growing, not from the targets shrinking.'
  }, {
    name: 'openOnHover',
    type: 'boolean',
    default: 'true',
    note: 'Opens the fan when the pointer is over the dial. ON by default, matching the file\u2019s openOnHover boolean. It needs no false default to be safe on touch: every hover path is gated behind `(hover: hover) and (pointer: fine)`, so a touch device never opens on hover whatever this says. Click works either way.'
  }, {
    name: 'showTooltips',
    type: 'boolean',
    default: 'false',
    note: 'Shows each action\u2019s name beside it. The name is the accessible name either way.'
  }, {
    name: 'open / onOpen / onClose',
    type: 'boolean / function',
    default: 'undefined',
    note: 'Controlled when supplied; it manages its own open state otherwise.'
  }],
  composition: [
    'Give every action a `name`. It is the accessible name whether or not tooltips are shown, and an icon without one is announced as "menu item".',
  ],
  accessibility: [
    'The dial is `aria-haspopup` with `aria-expanded`; the fan is `role="menu"` and each action is a `role="menuitem"`.',
    'Escape closes it and returns focus to the dial, so the keyboard does not get stranded in an open fan.',
    '`openOnHover` is built to WCAG 1.4.13, which asks three things of content that appears on hover. DISMISSIBLE \u2014 Escape closes it. HOVERABLE \u2014 closing is delayed and cancelled if the pointer lands anywhere in the container, so you can reach across the 12px gap into the fan without it shutting underneath you. PERSISTENT \u2014 it never times out on its own; the delay only governs closing after the pointer has left.',
    'Hover is gated on `(hover: hover) and (pointer: fine)`, which asks what the user is holding rather than what they are sitting at. A Surface has both; an iPad with a trackpad is a "mobile" device with a fine pointer.',
  ],
  tokens: [{
    name: '--SpeedDial-Gap',
    sets: 'the space between the dial and its actions, and between the actions',
    variesWith: 'size mode',
    figma: 'Component-Size/FAB/SpeedDial-Gap'
  }, {
    name: '--FAB-Width',
    sets: 'the dial, through Fab',
    variesWith: 'size mode',
    figma: 'Component-Size/FAB/FAB-Width'
  }],
  gotchas: [
    'Figma\u2019s SpeedDial set has TEN values in its State property for five states: `default | hover | pressed | focus-visible | disabled` AND `Default | Hover | Active | Focus-Visible | Disabled`. Two naming conventions in one property, and `pressed` and `Active` are the same state under two names. See the parity table.',
    'The set has three Child Slots, so it is built for exactly three actions. The component takes any number, and more than five stops being scannable.',
  ]
};

export const SECTION_DOC = {
  name: 'Section',
  summary: 'A region of a page that paints its own surface \u2014 the thing to reach for instead of writing a background.',
  insteadUse: [{
    when: 'You need the attributes but something inside paints itself',
    use: 'ThemedZone'
  }, {
    when: 'It is a surface rather than a region of the page',
    use: 'Box'
  }, {
    when: 'It is a card with the system\u2019s chrome',
    use: 'Card'
  }],
  props: [{
    name: 'theme',
    type: 'string',
    default: 'undefined',
    note: 'Absent means inherit, which is usually what a section inside an already-themed page wants.'
  }, {
    name: 'surface',
    type: 'string',
    default: 'Surface',
    note: 'The level within the theme. Surface, Container, and the Dim / Bright steps either side.'
  }, {
    name: 'as',
    type: 'string',
    default: 'section',
    note: 'The element. A `<section>` by default because that is usually what a page region is \u2014 pass `div` when it is not a landmark.'
  }, {
    name: 'padding',
    type: 'string',
    default: 'undefined',
    note: 'A CSS padding value. Not on the sizing scale by accident: a page region\u2019s inset is a layout decision, not a token.'
  }],
  composition: [
    'This is what the rule "never write `background: var(--Surface)`" points at. Setting theme and surface exposes the whole matched set \u2014 background, text, quiet, border, hover, link \u2014 all tuned for that level, so nothing inside has to be told what it is sitting on.',
    'Reach for ThemedZone instead when the thing inside paints its own background, such as an AppBar. Section paints; ThemedZone only declares.',
  ],
  accessibility: [
    'Renders a `<section>`, which is a landmark ONLY when it has an accessible name. An unnamed section is just a div to a screen reader, which is fine \u2014 but if it is meant to be navigable, give it an `aria-label`.',
    'Changing the surface changes contrast for everything inside, and the paired tokens are what keep it legible. Painting a background by hand is what breaks that.',
  ],
  gotchas: [
    'No Figma counterpart, and there should not be one: a section in Figma is a frame with a theme and surface mode set on it. This component is that, expressed in CSS.',
  ]
};

export const STACK_DOC = {
  name: 'Stack',
  summary: 'Lays children in a row or a column with a real gap, and keeps small text from crowding.',
  insteadUse: [{
    when: 'The children form a grid',
    use: 'Grid'
  }, {
    when: 'You are painting a surface rather than arranging things',
    use: 'Box'
  }],
  props: [{
    name: 'direction',
    type: 'string',
    values: ['row', 'column'],
    default: 'column',
    note: '`HStack` and `VStack` are the two you will usually import \u2014 they are this with the direction already chosen.'
  }, {
    name: 'gap',
    type: 'string | number',
    default: 'undefined',
    note: 'A `--Sizing-*` token, not a number of pixels. The scale is what keeps two stacks beside each other in rhythm.'
  }, {
    name: 'enforceMinGap',
    type: 'boolean',
    default: 'true',
    note: 'Raises the gap when a child is small text, so a label and its description do not touch.'
  }, {
    name: 'useFlexGap',
    type: 'boolean (advanced)',
    default: 'true',
    note: 'Uses flexbox gap rather than margins between children. Off only for a browser that needs it; there is nothing to see either way.'
  }],
  composition: [
    'Use `HStack` and `VStack`. The bare `OmniStack` exists so the two can share an implementation, not because the direction is usually worth stating twice.',
    'Gaps come from the sizing scale. A literal pixel gap is the thing that stops tracking when the brand changes it.',
  ],
  accessibility: [
    'A div with flexbox on it \u2014 no role, no semantics. That is correct: arrangement is not meaning, and a stack that announced itself would be noise.',
  ],
  gotchas: [
    '`enforceMinGap` raises the gap when it thinks a child is "small", and the list of small things includes typography components \u2014 Caption, Label, BodySmall, Legal. A label-and-description pair gets pushed apart whether or not you wanted it. Pass `enforceMinGap={false}` where the tight pairing is the point.',
    'No Figma counterpart: a stack is auto-layout, and auto-layout is a frame property rather than a component.',
  ]
};

export const CONTAINER_DOC = {
  name: 'Container',
  summary: 'Caps the page\u2019s reading width and centres it.',
  insteadUse: [{
    when: 'The region needs a surface',
    use: 'Section'
  }, {
    when: 'You are arranging children rather than bounding them',
    use: 'Stack'
  }],
  props: [{
    name: 'maxWidth',
    type: 'string | false',
    default: 'lg',
    note: 'A breakpoint name, or `false` for no cap.'
  }, {
    name: 'disableGutters',
    type: 'boolean',
    default: 'false',
    note: 'Removes the side padding. Rarely right \u2014 the gutter is what stops text touching a phone\u2019s edge.'
  }],
  composition: [
    'A container bounds; it does not paint. Wrap it in a Section when the region needs a surface, rather than giving the container one.',
  ],
  accessibility: [
    'No role of its own. Width is not meaning.',
    'Keep the gutters on at phone width. Text against the screen edge is hard to read and, on a rounded display, partly clipped.',
  ],
  gotchas: [
    'No Figma counterpart. Max width is expressed there as the frame\u2019s own size.',
  ]
};


/* Sheet had no doc entry at all, so its Summary tab opened on an empty page.
   Not a missing field — a missing ENTRY, which renders as nothing rather
   than as a gap, which is why it survived. */
export const SHEET_DOC = {
  name: 'Sheet',
  summary: 'A plain surface to put things on, when the thing on it is not a Card.',
  insteadUse: [{
    when: 'It has a header, media or actions',
    use: 'Card'
  }, {
    when: 'It only needs to group things for layout',
    use: 'Box'
  }, {
    when: 'It slides in over the page',
    use: 'Drawer'
  }],
  props: [{
    name: 'surface',
    type: 'string',
    values: ['Surface', 'Surface-Dim', 'Surface-Dimmest',
             'Surface-Bright', 'Surface-Brightest'],
    default: 'Surface',
    note: 'The LEVEL. This is the whole component \u2014 pick a level and the cascade paints the background, the text and the border to match.'
  }, {
    name: 'color',
    type: 'string',
    default: 'default',
    note: 'The THEME, as `data-theme`.'
  }, {
    name: 'elevated',
    type: 'boolean',
    default: 'false',
    note: 'Adds the shadow. A Sheet that is flat on the page needs none; one that reads as lifted off it does.'
  }, {
    name: 'component',
    type: 'string',
    default: 'div',
    note: 'The element rendered. `section` or `aside` where the region means something.'
  }],
  states: [{
    state: 'None',
    setBy: 'prop',
    note: 'A Sheet is not interactive. What sits on it is.'
  }],
  tokens: [surfaceToken('--Background', 'the sheet'), surfaceToken('--Text', 'anything in it')],
  composition: ['Anything. It sets a surface and gets out of the way.'],
  accessibility: [
    'It is a surface, not a landmark. Pass `component="section"` with a heading, or `aria-label`, where the region is one a reader should be able to skip to.',
    'Nesting sheets stacks surface levels; two levels that land on the same tone leave a border doing all the separating.',
  ],
  gotchas: [
    'It used to carry variant="solid | light | dark", which only ever chose between three of the five surface levels under names that did not say which. `surface` takes any of the five and names it.',
  ],
};

/* Same gap as Sheet: no entry, so an empty Summary. */
export const TRANSFER_LIST_DOC = {
  name: 'TransferList',
  summary: 'Moves items between two lists — what is available, and what has been chosen.',
  insteadUse: [{
    when: 'The choice is one of a few',
    use: 'RadioGroup'
  }, {
    when: 'Items are picked but never ordered or grouped',
    use: 'Checkbox, or a multi Select'
  }, {
    when: 'There is one list and the question is which rows are selected',
    use: 'Table or List'
  }],
  props: [{
    name: 'mode',
    type: 'string',
    values: ['basic', 'enhanced'],
    default: 'basic',
    note: 'BASIC gives one button each direction. ENHANCED adds move-all in both directions and a select-all checkbox in each header.'
  }, {
    name: 'defaultLeftItems',
    type: 'array',
    default: '[]',
    note: 'Plain strings. The panel keys on the item and renders it straight into a BodySmall, so an object throws.'
  }, {
    name: 'defaultRightItems',
    type: 'array',
    default: '[]'
  }, {
    name: 'leftItems',
    type: 'array',
    default: 'undefined',
    note: 'Controlled. Pass both sides with `onChange`, or neither.'
  }, {
    name: 'rightItems',
    type: 'array',
    default: 'undefined'
  }, {
    name: 'leftTitle',
    type: 'string',
    default: 'Available'
  }, {
    name: 'rightTitle',
    type: 'string',
    default: 'Chosen'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }],
  states: [{
    state: 'Checked',
    setBy: 'interaction',
    note: 'Per row. The move buttons act on what is checked, and are disabled while nothing is.'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  tokens: [surfaceToken('--Background', 'each panel'), surfaceToken('--Border', 'the panel outline'), {
    token: '--Border-Variant',
    role: 'the rule under each header',
  }],
  composition: [
    'Two panels, each an elevation wrapper around a Container-surfaced frame: header, divider, list.',
    'A column of move buttons between them.',
  ],
  accessibility: [
    'The whole thing is one `role="group"`; each panel\u2019s rows are checkboxes, so the count in the header is what tells a screen-reader user how long the list is.',
    'A move button says which direction it moves and is disabled while nothing is checked, so it never looks operable with nothing to operate on.',
  ],
  gotchas: [
    'The panels top-align rather than centring. They rarely hold the same number of rows \u2014 that is the point of the component \u2014 and centring floated the shorter one down the page so the two headers stopped lining up.',
    'The header is 40 tall INCLUDING its padding. Without border-box the min applied to the content box and the 12px above and below were added to it, so a header specified as 40 came out 64.',
  ],
};

export const SURFACE_DOCS = [ICON_DOC, BRANDICON_DOC, FAB_DOC, SNACKBAR_DOC, ACCORDION_DOC,
  BOX_DOC, FOOTER_DOC, COPYRIGHT_DOC, SPEED_DIAL_DOC, SHEET_DOC, TRANSFER_LIST_DOC,
  SECTION_DOC, STACK_DOC, CONTAINER_DOC];
