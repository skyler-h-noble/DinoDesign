/**
 * The last batch: the Select family, and the components with no Figma page.
 *
 * The undesigned ones still get a full doc. A component missing from the
 * reference is indistinguishable from one an agent has not found, so each says
 * plainly that there is no drawing and to build from the props — which the
 * renderer emits as its own line rather than an empty Figma section.
 */

const surfaceToken = (name, sets) => ({
  name,
  sets,
  variesWith: 'theme + surface',
  figma: 'Modes → Theme → Surface'
});
const inherits = (what = 'an ancestor') => [{
  collection: 'Theme',
  inCode: `\`data-theme\` on ${what}.`,
  inFigma: 'No Figma counterpart — it inherits whatever zone it is dropped into.'
}];
export const SELECT_DOC = {
  name: 'Select',
  summary: 'Picks one or more values from a fixed list.',
  insteadUse: [{
    when: 'The user types and the list narrows',
    use: 'Autocomplete'
  }, {
    when: 'There are five or fewer options',
    use: 'RadioGroup'
  }, {
    when: 'The list is actions, not values',
    use: 'Menu'
  }],
  props: [{
    name: 'options',
    type: 'array',
    default: '[]'
  }, {
    name: 'defaultValue',
    type: 'string',
    default: "''"
  }, {
    name: 'label',
    type: 'string',
    default: 'undefined'
  }, {
    name: 'labelPosition',
    type: 'string',
    values: ['top', 'floating'],
    default: 'top'
  }, {
    name: 'variant',
    type: 'string',
    default: 'outline',
    note: 'The `light` variant was removed — see the Button note on `-light`.'
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
    name: 'mode',
    type: 'string',
    values: ['standard', 'multiselect', 'searchable'],
    default: 'standard'
  }],
  states: [{
    state: 'Hover',
    setBy: 'interaction'
  }, {
    state: 'Pressed',
    setBy: 'interaction'
  }, {
    state: 'Focus-visible',
    setBy: 'interaction'
  }, {
    state: 'Open',
    setBy: 'interaction'
  }, {
    state: 'Disabled',
    setBy: 'prop'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on an ancestor.',
    inFigma: 'Neither `Select` nor `SelectMenu` pins a Theme mode. Set it on the frame around them.'
  }],
  themingNotes: ['In Figma the trigger and the panel are separate sets: `Select` is a Button instance with `type = default | multiselect | searchable`, `SelectMenu` is the panel it opens — and the panel is itself a TreeView instance built from Menu Item.'],
  tokens: [surfaceToken('--Border', 'the trigger outline'), surfaceToken('--Text', 'the chosen value'), surfaceToken('--Quiet', 'the placeholder'), {
    name: '--Input-Height',
    sets: 'the trigger height',
    variesWith: 'size mode + device',
    figma: 'Input/Input-Height'
  }, {
    name: '--Dropdown-Frame-Radius',
    sets: 'the panel corner',
    variesWith: 'size mode',
    figma: 'Menu/Dropdown-Frame-Radius'
  }],
  composition: ['Options are data. The panel is the component’s own — do not place a Menu beside it.'],
  accessibility: ['It needs a label. A select showing "Choose…" with no label is unlabelled.', 'Arrow keys move through options, Enter picks, Escape closes without changing the value.', 'Multiselect must announce how many are chosen, not just the first.'],
  gotchas: ['`--Dropdown-Frame-Radius` is `min(Input-Radius, Card-Radius, 16px)` in pixels, not a percent: the panel follows the input it opens from, is never rounder than the cards it floats above, and caps at 16 because rows are full-bleed and a larger corner clips the first and last row’s hover.']
};
export const MENU_DOC = {
  name: 'Menu',
  summary: 'A list of actions opened from a control.',
  insteadUse: [{
    when: 'It picks a value for a form',
    use: 'Select'
  }, {
    when: 'It is permanent navigation',
    use: 'Rail or Sidebar'
  }, {
    when: 'It holds arbitrary content, not a list',
    use: 'Popover'
  }],
  props: [{
    name: 'variant',
    type: 'string',
    default: 'outline'
  }, {
    name: 'color',
    type: 'string',
    default: 'default'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }],
  states: [{
    state: 'Open',
    setBy: 'context',
    note: 'From the `Dropdown` root, which owns the state.'
  }, {
    state: 'Hover / Focus-visible',
    setBy: 'interaction',
    note: 'Per item.'
  }, {
    state: 'Disabled',
    setBy: 'prop',
    note: 'Per `MenuItem`.'
  }],
  theming: [{
    collection: 'Theme',
    inCode: '`data-theme` on an ancestor.',
    inFigma: '`Menu Item` pins nothing and inherits. It has its own page because TreeView and SelectMenu both build from it.'
  }],
  tokens: [surfaceToken('--Background', 'the panel'), surfaceToken('--Hover', 'row hover'), {
    name: '--Dropdown-Frame-Radius',
    sets: 'the panel corner',
    variesWith: 'size mode',
    figma: 'Menu/Dropdown-Frame-Radius'
  }, {
    name: '--Menu-Item-Radius',
    sets: 'a row corner',
    variesWith: 'size mode',
    figma: 'Menu/Menu-Item-Radius'
  }],
  composition: ['Always `<Dropdown>` as the root — it supplies the open state through context. A `<Menu>` on its own reads the default context, whose `open` is false, so it renders NOTHING with no warning.', 'Then `<MenuButton>` as the trigger and `<MenuItem>` / `<MenuDivider>` inside.'],
  accessibility: ['The trigger carries `aria-haspopup`, `aria-expanded` and `aria-controls`; the panel is a `menu` of `menuitem`s. All handled.', 'Arrow keys move, Escape closes and returns focus to the trigger.'],
  gotchas: ['**It does not portal.** The panel is `position: absolute` inside the Dropdown wrapper, and z-index cannot lift a positioned element out of an `overflow: hidden` or transformed ancestor — so inside a scrolling container or a clipped card it is cut off. Use the portal pattern for those, and tag it `MISSING-LIB-COMPONENT: Popover`.', 'Its 18 failing ARIA tests are TEST bugs: they assert on `getByText(...)`, which returns the inner Typography `<p>`, while the ARIA attributes are correctly on the ancestor `<button>`. Do not "fix" the component to satisfy them.']
};
const undesigned = (name, summary, insteadUse, props, states, tokens, composition, accessibility, gotchas) => ({
  name,
  summary,
  insteadUse,
  props,
  states,
  theming: inherits(),
  tokens,
  composition,
  accessibility,
  gotchas
});
export const CODE_BLOCK_DOC = {
  name: 'CodeBlock',
  summary: 'A block of code, a shell command or a copyable URL, with its own copy button.',
  insteadUse: [{
    when: 'It is one word of code inside a sentence',
    use: 'inline `code` in the Markdown'
  }, {
    when: 'You only need the copy affordance',
    use: 'CopyButton'
  }],
  props: [{
    name: 'code',
    type: 'string',
    default: "''",
    note: 'The text shown AND the text copied — they are the same string, so what the user pastes is what they read.'
  }, {
    name: 'language',
    type: 'string',
    default: "'JSX'",
    note: 'The header label: `"bash"`, `"JSX"`, `"CSS"`, `"URL"`. A label, not a syntax highlighter.'
  }, {
    name: 'showCopy',
    type: 'boolean',
    default: 'true'
  }, {
    name: 'showHeader',
    type: 'boolean',
    default: 'true'
  }, {
    name: 'maxHeight',
    type: 'string | number',
    default: 'undefined',
    note: 'Caps the code area and scrolls past it.'
  }, {
    name: 'wrap',
    type: 'boolean',
    default: 'false',
    note: 'Wrap long lines instead of scrolling horizontally.'
  }],
  states: [{
    state: 'Copied',
    setBy: 'interaction',
    note: 'The component owns the flag, the confirmation and the timer.'
  }],
  theming: [{
    collection: 'Theme',
    inCode: 'None to set. The root declares `data-theme="Neutral"` + `data-surface="Surface-Dimmest"` itself, so the dark region follows the brand\'s own neutrals.',
    inFigma: 'The component pins the same pair. Change the Neutral ramp, not this component, to move it.'
  }],
  tokens: [surfaceToken('--Background', 'the dark code region — via Surface-Dimmest'), surfaceToken('--Text', 'the code'), surfaceToken('--Border', 'the edge and the header rule')],
  composition: ['It brings its own copy button, confirmation and timer, so the surrounding component should NOT keep a `copied` flag of its own.'],
  accessibility: ['The copy control is a button with a name, not an icon alone — "Copy code", not "copy".', 'Copying is announced; a purely visual tick tells a screen-reader user nothing.'],
  gotchas: ['Its dark region is NOT a hardcoded color. The wrapper declares `data-theme="Neutral"` + `data-surface="Surface-Dimmest"`, so it follows the brand\'s neutrals and stays legible in both modes. Do not override its background — that is the one change that breaks dark mode for it.', 'Any block of code, shell command or copyable URL uses this. Hand-rolling a `<pre>`/`<code>` panel with its own copy button is what it replaces, and the studio still has ten of those.']
};
export const PLAYER_DOC = {
  name: 'Player',
  summary: 'An audio player bar: who is playing, the transport, and where you are in it.',
  insteadUse: [{
    when: 'The user is choosing a value rather than watching one',
    use: 'Slider'
  }, {
    when: 'It is a single action with no state to show',
    use: 'Button'
  }, {
    when: 'You only need to show progress of something running',
    use: 'LinearProgress'
  }],
  props: [{
    name: 'title / subtitle',
    type: 'string',
    default: 'undefined',
    note: 'Both optional. With neither, and no avatar, the meta block is not rendered at all \u2014 a bare transport is a real shape.'
  }, {
    name: 'avatarSrc / avatarInitials',
    type: 'string',
    default: 'undefined',
    note: 'Artwork, through the lib\u2019s Avatar. Its alt text is derived from `title`.'
  }, {
    name: 'position / defaultPosition',
    type: 'number',
    default: '0',
    note: 'Seconds elapsed. Controlled or not, like every other input here.'
  }, {
    name: 'duration',
    type: 'number',
    default: '0',
    note: 'Seconds. The scrubber\u2019s max, and the right-hand clock.'
  }, {
    name: 'onSeek',
    type: 'function',
    default: 'undefined',
    note: 'Absent means the scrubber is disabled \u2014 a player you can watch and not scrub, which is a preview rather than a broken control.'
  }, {
    name: 'playing / defaultPlaying',
    type: 'boolean',
    default: 'false'
  }, {
    name: 'onPlayPause',
    type: 'function',
    default: 'undefined',
    note: 'Called with the state it is moving TO, so `onPlayPause={setPlaying}` works.'
  }, {
    name: 'onPrevious / onNext',
    type: 'function',
    default: 'undefined',
    note: 'Absent means the button is not rendered. A player with no previous track should not show a dead control.'
  }, {
    name: 'variant',
    type: 'string',
    default: 'default',
    note: 'The palette, passed to the buttons and the scrubber together so they cannot disagree.'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium'
  }, {
    name: 'showTime',
    type: 'boolean',
    default: 'true',
    note: 'Elapsed and total either side of the scrubber. Off for a bar too narrow to carry them.'
  }, {
    name: 'disabled',
    type: 'boolean',
    default: 'false'
  }],
  composition: [
    'Every part is an existing component \u2014 Avatar, Button, Slider, Typography \u2014 arranged. There is no new primitive, and there should not be: a player that drew its own round button would be a second button with its own focus ring to keep in step.',
    'The meta block, the transport and the scrubber each disappear when they have nothing to show, so one component covers a full bar and a bare transport without a `variant` for each.',
  ],
  accessibility: [
    'The bar is one `role="group"` with a name, so a screen reader announces it as a player rather than as three loose controls.',
    'The play button is named for what pressing it DOES \u2014 "Play" when paused. A button named for the current state tells you where you are and not what you get.',
    'The scrubber reports `aria-valuetext` as "0:42 of 3:15". Without it a screen reader reads "42", leaving the listener to work out what that is of.',
    'Elapsed and total use `tabular-nums`, so the track does not shuffle sideways as the digits change.',
  ],
  gotchas: [
    'Time is NOT a slider label. `valueLabelDisplay` puts a bubble over the thumb, which is right for a value you are choosing and wrong for a clock you are reading \u2014 it moves, it covers the track, and it vanishes when you let go.',
    '`onPlayPause` receives the NEXT state, not the current one.',
    'Figma\u2019s Player page is a sketch rather than a component set \u2014 a 400px row holding 554px of placeholder content. This is built to the shape it points at, not matched to it variant by variant.',
  ]
};

export const CIRCULAR_PROGRESS_DOC = {
  name: 'CircularProgress',
  summary: 'Shows that something is running, and how far along it is when that is known.',
  insteadUse: [{
    when: 'The wait is a whole page or a region settling',
    use: 'Loader'
  }, {
    when: 'Progress reads better as a line \u2014 a form, an upload, a step bar',
    use: 'LinearProgress'
  }, {
    when: 'The shape of the thing being loaded is known',
    use: 'Skeleton'
  }],
  props: [{
    name: 'value',
    type: 'number',
    default: 'undefined',
    note: '0\u2013100. OMIT IT for indeterminate: a spinner that does not know how far along it is should not draw an arc that implies it does.'
  }, {
    name: 'color',
    type: 'string',
    default: 'primary'
  }, {
    name: 'size',
    type: "'small' | 'medium' | 'large' | number",
    default: 'medium',
    note: 'A number is a diameter in px, and the thickness scales with it. The named sizes are 24 / 40 / 56.'
  }, {
    name: 'thickness',
    type: 'number',
    default: 'undefined',
    note: 'Overrides the ring weight the size would give. Rarely needed \u2014 the ramp is tuned so a small dial does not read as a hairline.'
  }, {
    name: 'showValue',
    type: 'boolean',
    default: 'false',
    note: 'Prints the percentage in the middle. Meaningless without `value`, and ignored at `small`, where there is no room for legible digits.'
  }],
  states: [{ state: 'Indeterminate', setBy: 'omitting `value`' },
           { state: 'Determinate', setBy: '`value`' }],
  theming: [{
    collection: 'Theme',
    inCode: '`color`, or `data-theme` on an ancestor.',
    inFigma: 'The Progress Dial set pins nothing and inherits.'
  }],
  themingNotes: ['The track is the surface\u2019s own quiet tone and the arc is the palette, so a dial reads on any surface without being told which one it is on.'],
  tokens: [{ name: '--Icons-{Color}', sets: 'the arc', variesWith: 'Icons mode', figma: 'Icons' }],
  composition: [
    'Give it a `value` only when you have one. An arc that creeps to 90% and stops is worse than a spinner, because it made a promise.',
  ],
  accessibility: [
    'It carries `role="progressbar"`. With a `value` it reports `aria-valuenow`; without one it reports nothing, which is how a screen reader tells determinate from indeterminate.',
    'A spinner alone says something is happening and not WHAT. Put a line of text beside it, or label it, when the wait is longer than a moment.',
  ],
  gotchas: [
    'Figma\u2019s Progress Dial has ONE variant \u2014 Size=Large, Color=Default. The properties exist with a single value each, so there is nothing in the file to check small or medium against, and the lib\u2019s large (56px) does not match the set\u2019s 80x80 frame. See the parity table in the Change Log.',
    '`showValue` without `value` prints nothing. It is not a spinner label.',
  ]
};

export const LINEAR_PROGRESS_DOC = {
  name: 'LinearProgress',
  summary: 'A bar that fills as something runs \u2014 an upload, a form, a step.',
  insteadUse: [{
    when: 'It is a spinner in a button or beside a line of text',
    use: 'CircularProgress'
  }, {
    when: 'The whole page or region is waiting',
    use: 'Loader'
  }, {
    when: 'The steps are named and the user moves between them',
    use: 'Stepper'
  }],
  props: [{
    name: 'value',
    type: 'number',
    default: 'undefined',
    note: '0\u2013100. Omit for indeterminate, which animates rather than filling.'
  }, {
    name: 'color',
    type: 'string',
    default: 'primary'
  }, {
    name: 'size',
    type: 'string',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    note: 'The bar HEIGHT: 4 / 6 / 8px. Width comes from the container, because a progress bar spans the thing it is about.'
  }],
  states: [{ state: 'Indeterminate', setBy: 'omitting `value`' },
           { state: 'Determinate', setBy: '`value`' }],
  theming: [{
    collection: 'Theme',
    inCode: '`color`, or `data-theme` on an ancestor.',
    inFigma: 'The Progress Bar set pins nothing and inherits.'
  }],
  themingNotes: ['The track is the surface\u2019s quiet tone; the fill is the palette.'],
  tokens: [{ name: '--Icons-{Color}', sets: 'the fill', variesWith: 'Icons mode', figma: 'Icons' }],
  composition: [
    'It fills its container, so put it in something with a width rather than giving it one.',
  ],
  accessibility: [
    '`role="progressbar"`, with `aria-valuenow` when determinate and none when not.',
    'A bar with no label says something is progressing and not what. Name it, or put the text that explains it directly above.',
  ],
  gotchas: [
    'Figma\u2019s Progress Bar has ONE variant \u2014 Type=Progress, Size=Large. The size ramp has no other value built, so small and medium cannot be checked against the file. Its 8px height does match the lib\u2019s large.',
    'The Type property exists with only "Progress" in it. Whatever else it was meant to hold has not been built.',
  ]
};

export const REST_DOCS = [SELECT_DOC, MENU_DOC, CODE_BLOCK_DOC, PLAYER_DOC,
  CIRCULAR_PROGRESS_DOC, LINEAR_PROGRESS_DOC, undesigned('Autocomplete', 'A text field whose list narrows as the user types.', [{
  when: 'The list is short and fixed',
  use: 'Select'
}, {
  when: 'It searches a page rather than picking a value',
  use: 'SearchField'
}], [{
  name: 'options',
  type: 'array',
  default: '[]'
}, {
  name: 'defaultValue',
  type: 'object',
  default: 'null'
}, {
  name: 'placeholder',
  type: 'string',
  default: "'Type to search'"
}, {
  name: 'label',
  type: 'string',
  default: 'undefined'
}, {
  name: 'labelPosition',
  type: 'string',
  values: ['top', 'floating'],
  default: 'top'
}, {
  name: 'variant',
  type: 'string',
  default: 'outline'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}], [{
  state: 'Focus-visible',
  setBy: 'interaction'
}, {
  state: 'Open',
  setBy: 'interaction',
  note: 'Opens as the user types, not on focus.'
}, {
  state: 'Disabled',
  setBy: 'prop'
}], [surfaceToken('--Border', 'the field outline'), surfaceToken('--Background', 'the suggestion panel')], ['Options are data. The panel is the component’s own.'], ['The suggestion list must be announced as it changes — a silently updating list is invisible to a screen reader.', 'Arrow keys move through suggestions without losing what has been typed.'], ['No Figma drawing. Its trigger is a text field and its panel matches SelectMenu — build from those two rather than inventing a third.']), undesigned('TextField', 'One line of typed text. The lower-level field that Input builds on.', [{
  when: 'You want the full field with label and validation',
  use: 'Input'
}, {
  when: 'More than one line',
  use: 'TextArea'
}], [{
  name: 'label',
  type: 'string',
  default: 'undefined'
}, {
  name: 'value',
  type: 'string',
  default: "''"
}, {
  name: 'placeholder',
  type: 'string',
  default: 'undefined'
}, {
  name: 'error',
  type: 'boolean',
  default: 'false'
}, {
  name: 'errorMessage',
  type: 'string',
  default: "''"
}, {
  name: 'helperText',
  type: 'string',
  default: "''"
}, {
  name: 'variant',
  type: 'string',
  default: 'outlined'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}], [{
  state: 'Focus-visible',
  setBy: 'interaction'
}, {
  state: 'Error',
  setBy: 'prop'
}, {
  state: 'Disabled',
  setBy: 'prop'
}], [surfaceToken('--Border', 'the outline'), surfaceToken('--Text', 'the value')], ['Label, helper and error are props — the wiring is what makes them announced with the field.'], ['Every field needs a label; a placeholder is not one, because it disappears on focus.', '`error` should set `aria-invalid` and tie the message with `aria-describedby`.'], ['Prefer `Input`, which is the designed one. TextField exists for cases Input’s API does not reach.']), undesigned('SearchField', 'A field for searching, with a clear button and a submit.', [{
  when: 'It picks from a fixed list',
  use: 'Select or Autocomplete'
}, {
  when: 'It is a general text field',
  use: 'Input'
}], [{
  name: 'defaultValue',
  type: 'string',
  default: "''"
}, {
  name: 'placeholder',
  type: 'string',
  default: "'Search…'"
}, {
  name: 'showClearButton',
  type: 'boolean',
  default: 'true'
}, {
  name: 'onSubmit',
  type: 'function',
  default: 'undefined'
}, {
  name: 'onClear',
  type: 'function',
  default: 'undefined'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}, {
  name: 'color',
  type: 'string',
  default: 'default'
}], [{
  state: 'Focus-visible',
  setBy: 'interaction'
}, {
  state: 'Has value',
  setBy: 'interaction',
  note: 'Reveals the clear button.'
}], [surfaceToken('--Border', 'the outline'), surfaceToken('--Quiet', 'the placeholder and icon')], ['The search icon and clear button are the component’s own — do not add decorators for them.'], ['The clear button needs a name — "Clear search", not an X.', 'It should be a `<form>` with `role="search"` so it can be jumped to as a landmark.'], ['No Figma drawing. It is an Input with two fixed decorators; build it from the Input design.']), undesigned('Popover', 'A floating panel anchored to an element, holding arbitrary content.', [{
  when: 'It is a list of actions',
  use: 'Menu'
}, {
  when: 'It is a short label on hover',
  use: 'Tooltip'
}, {
  when: 'It blocks the page',
  use: 'Modal'
}], [{
  name: 'open',
  type: 'boolean',
  default: 'false'
}, {
  name: 'anchorRef',
  type: 'ref',
  default: 'undefined'
}, {
  name: 'placement',
  type: 'string',
  default: 'bottom-end'
}, {
  name: 'theme',
  type: 'string',
  default: 'Default'
}, {
  name: 'surface',
  type: 'string',
  default: 'Surface-Bright'
}, {
  name: 'width',
  type: 'number',
  default: '320'
}, {
  name: 'maxHeight',
  type: 'number',
  default: '400'
}], [{
  state: 'Open',
  setBy: 'prop'
}], [surfaceToken('--Background', 'the panel'), surfaceToken('--Border', 'its edge')], ['Anchored with `anchorRef` rather than by nesting, which is what lets it escape a clipped ancestor.'], ['It must close on Escape and on outside click, and return focus to whatever opened it.', 'A popover containing controls needs focus moved into it; one holding only text does not.'], ['**This is the portal-based panel the Menu cannot be.** Menu is `position: absolute` and gets clipped inside a scrolling container; Popover portals to the body. It is also the component `MISSING-LIB-COMPONENT: Popover` refers to.', 'It takes `theme` and `surface` directly, unlike most components — a floating panel has no ancestor to inherit a zone from once it portals.']), undesigned('Paper', 'A plain raised surface. The unopinionated version of Card.', [{
  when: 'It holds grouped content with padding',
  use: 'Card'
}, {
  when: 'It is a page region',
  use: 'Section'
}], [{
  name: 'surface',
  type: 'string',
  default: 'Container'
}, {
  name: 'outlined',
  type: 'boolean',
  default: 'false'
}, {
  name: 'variant',
  type: 'string',
  values: ['elevation', 'outlined'],
  default: 'elevation'
}], [{
  state: 'None',
  setBy: 'prop'
}], [surfaceToken('--Background', 'the surface'), surfaceToken('--Border', 'the outline when outlined')], ['Children are yours entirely — Paper adds a surface and nothing else, not even padding.'], ['It is a region, not a control. Do not give it a role.'], ['Prefer `Card`, which is designed and carries padding and radius. Paper is for cases where you want the surface without the opinions.']), undesigned('Sidebar', 'A wide panel of navigation down the side, usually with nested sections.', [{
  when: 'It is narrow and icon-led',
  use: 'Rail'
}, {
  when: 'It slides in and is dismissed',
  use: 'Drawer'
}], [{
  name: 'items',
  type: 'array',
  default: '[]'
}, {
  name: 'width',
  type: 'number',
  default: '280'
}, {
  name: 'variant',
  type: 'string',
  values: ['temporary', 'permanent'],
  default: 'temporary'
}, {
  name: 'header',
  type: 'ReactNode',
  default: 'undefined'
}, {
  name: 'footer',
  type: 'ReactNode',
  default: 'undefined'
}], [{
  state: 'Open',
  setBy: 'prop',
  note: 'Only meaningful when temporary.'
}, {
  state: 'Selected',
  setBy: 'context'
}], [surfaceToken('--Background', 'the panel'), surfaceToken('--Hover', 'item hover')], ['Items are data, with header and footer as slots.'], ['A `<nav>` of links with `aria-current` on the active one.', 'A temporary sidebar traps focus; a permanent one must not.'], ['No Figma drawing. The Rail page has `Nav Rail`, `Nav Rail Item` and `Drawer Title`, which is the closest design — a sidebar is a rail that stays expanded.']), undesigned('Toolbar', 'A row of actions belonging to a region or a selection.', [{
  when: 'It is the top-level application bar',
  use: 'AppBar'
}, {
  when: 'It is one set of exclusive choices',
  use: 'ButtonGroup'
}], [{
  name: 'items',
  type: 'array',
  default: '[]'
}, {
  name: 'type',
  type: 'string',
  values: ['floating', 'docked'],
  default: 'floating'
}, {
  name: 'orientation',
  type: 'string',
  values: ['horizontal', 'vertical'],
  default: 'horizontal'
}, {
  name: 'color',
  type: 'string',
  default: 'default'
}, {
  name: 'fab',
  type: 'object',
  default: 'undefined'
}], [{
  state: 'Hover / Focus-visible',
  setBy: 'interaction',
  note: 'Per item.'
}, {
  state: 'Selected',
  setBy: 'prop'
}], [surfaceToken('--Background', 'the bar'), surfaceToken('--Hover', 'item hover')], ['Items are data. A FAB comes from `fab` rather than being nested.'], ['Icon-only items each need a name saying the action.', 'A toolbar is a `toolbar` role with arrow-key navigation between items, and one tab stop for the whole thing.'], ['No Figma drawing. `AppBar` shares its elevation group — AppBar, Toolbars and Menus are one row in the elevation table.']), undesigned('IconBadge', 'An icon with a badge already positioned on it.', [{
  when: 'You are badging something else',
  use: 'Badge around it'
}, {
  when: 'There is no badge',
  use: 'Icon'
}], [{
  name: 'color',
  type: 'string',
  default: 'primary'
}, {
  name: 'variant',
  type: 'string',
  default: 'solid'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}], [{
  state: 'None',
  setBy: 'prop'
}], [{
  name: '--Icons-{Color}',
  sets: 'the glyph',
  variesWith: 'theme + surface',
  figma: 'Icons → Icon'
}], ['The icon is the child; the badge is the component’s own.'], ['The badge number means nothing alone — the accessible name must carry both, "Messages, 3 unread".'], ['No Figma drawing, but both halves are designed: `Icon` and `Badge Counter`. It is those two composed, not a third thing.']), undesigned('DropZone', 'An area that accepts dropped or chosen files.', [{
  when: 'It is a plain file input',
  use: 'an input of type file'
}, {
  when: 'It is an image placeholder',
  use: 'ImagePlaceholder'
}], [{
  name: 'onFiles',
  type: 'function',
  default: 'undefined'
}, {
  name: 'accept',
  type: 'string',
  default: 'undefined'
}, {
  name: 'multiple',
  type: 'boolean',
  default: 'false'
}, {
  name: 'label',
  type: 'ReactNode',
  default: 'undefined'
}, {
  name: 'sublabel',
  type: 'ReactNode',
  default: 'undefined'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}, {
  name: 'disabled',
  type: 'boolean',
  default: 'false'
}], [{
  state: 'Dragging over',
  setBy: 'interaction'
}, {
  state: 'Focus-visible',
  setBy: 'interaction'
}, {
  state: 'Disabled',
  setBy: 'prop'
}], [surfaceToken('--Border', 'the dashed edge'), surfaceToken('--Hover', 'the drag-over fill')], ['Label and sublabel are props. It contains a real file input so the keyboard path works.'], ['Drag and drop is not keyboard-operable, so a DropZone must also be clickable and focusable — the hidden input is what provides that.', '`accept` should be stated in the sublabel too; a rejected file with no explanation is a dead end.'], ['No Figma drawing. It is a bordered region with an icon and two lines of text — build from `ImagePlaceholder` and `Card`.']), undesigned('StateMessage', 'What to show when there is nothing to show: empty, error or no results.', [{
  when: 'Something is loading',
  use: 'Loader or Skeleton'
}, {
  when: 'It is a transient message',
  use: 'Snackbar'
}, {
  when: 'It sits in the page as a warning',
  use: 'Alert'
}], [{
  name: 'type',
  type: 'string',
  values: ['empty', 'error', 'no-results'],
  default: 'empty'
}, {
  name: 'title',
  type: 'string',
  default: 'undefined'
}, {
  name: 'body',
  type: 'string',
  default: 'undefined'
}, {
  name: 'action',
  type: 'ReactNode',
  default: 'undefined',
  note: 'The way out. An empty state with no next step is a dead end.'
}, {
  name: 'icon',
  type: 'ReactNode',
  default: 'undefined'
}, {
  name: 'size',
  type: 'string',
  values: ['small', 'medium', 'large'],
  default: 'medium'
}], [{
  state: 'None',
  setBy: 'prop',
  note: 'The `type` IS the state.'
}], [surfaceToken('--Text', 'the title'), surfaceToken('--Quiet', 'the body')], ['Title, body and action are props. Table and List take it through their own `empty` and `error` props.'], ['An error state must say what to do, not only what failed.', 'It should be announced when it replaces content, or a screen reader user sees the list simply vanish.'], ['No Figma drawing. It is a centred icon, a title, a body and one action — build from Typography and Button.'])];
