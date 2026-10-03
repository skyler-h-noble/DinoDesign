// @ts-nocheck
/* Checking is off for THIS FILE ONLY, and the reason is narrow.
 *
 * The lib's components are plain JS, so their prop types are INFERRED from
 * destructuring: a prop with no default reads as required. `Tab` therefore
 * "requires" startDecorator, `Accordion` requires expanded, `Link` requires
 * target/rel/onClick. Every example below is correct usage that tsc reports as
 * an error for that reason alone.
 *
 * The rest of src/docs IS checked — it is data, and errors there are real. If
 * the components ever gain hand-written prop types, delete this line.
 */
/**
 * A live example per component, rendered in the user's own design system.
 *
 * This is the point of the docs page: a prop table describes a component, an
 * example shows the one the user actually has — their radius, their type,
 * their palette. The uuid in /docs/:uuid/:component is what makes that
 * possible, and it is why the page is per design system rather than shared.
 *
 * Not every component gets one. A Modal or a Drawer needs open state and a
 * portal, and a half-working example is worse than none — it teaches a shape
 * that does not run. Those fall through to the props table, which is honest.
 *
 * The Input example imports TEXTINPUT, not Input. The package publishes the
 * component under that name — `export { Input as TextInput }`, which the
 * library's index calls the preferred one — while the doc entry, the Figma page
 * and figmaComponentMap all still say "Input". Importing `Input` here threw at
 * RUNTIME ("does not provide an export named 'Input'") and took the whole docs
 * page down, not just this example.
 *
 * TypeScript could not have caught it: src/types/dynodesign.d.ts `declare
 * module`s the package, and a declared module REPLACES the real types, so the
 * compiler stopped being able to tell the truth about what the package exports.
 * That is the AvatarMenu warning in this repo's CLAUDE.md, played out.
 *
 * Tag and Loader still have no example. They were missing from the library's
 * index entirely and have been added, but the studio installs the PUBLISHED
 * package — so they arrive here on the next release, not before.
 */
import React from 'react';
/* Imported from each component's OWN module, never from '../components'.
 *
 * The barrel re-exports these docs, so a barrel import here closes a cycle:
 * components/index.js -> ../docs -> ./examples -> ../components. At runtime the
 * cycle resolves half-initialised and the component references come back
 * undefined, which React reports as "type is invalid ... but got: object" and
 * renders as a blank page. Direct paths cannot cycle. */
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { BrandIcon } from '../components/BrandIcon/BrandIcon';
import { Fab } from '../components/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from '../components/Link';
import { Divider } from '../components/Divider';
import { Checkbox } from '../components/Checkbox';
import { Radio, RadioGroup } from '../components/Radio';
import { SwitchInput } from '../components/Switch';
import { Slider } from '../components/Slider';
import { Rating } from '../components/Rating';
import { Input as TextInput } from '../components/Input';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Tabs, TabList, Tab, TabPanel } from '../components/Tabs';
import { ButtonGroup } from '../components/ButtonGroup';
import { Accordion } from '../components/Accordion';
import { Body, H3 } from '../components/Typography';
import { VStack, HStack } from '../components/Stack';
import { Caption } from '../components/Typography';
// Relative, not the package name: this file now lives INSIDE the library, and
// importing the package from within it would resolve to the installed copy
// rather than this source — a second React tree and a stale component set.

/** Rendered inside the provider, so every token resolves to the user's brand. */
export const EXAMPLES = {
  /* ONE instance, in its default configuration — enough to recognise the
     component. The variants, sizes and states are shown further down, beside
     the prop that controls them (PROP_EXAMPLES), so a sample sits where the
     reader is already asking the question rather than all at the top. */
  Button: () => <Button>Button</Button>,
  /* The default instance: medium, default color, icon only. Not extended
     and not animated, because a sample that moves on a page of prose draws
     the eye away from the prose. */
  BrandIcon: () => <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
    {['github', 'linkedin', 'instagram', 'dribbble', 'x-twitter'].map(n => (
      <BrandIcon key={n} name={n} size="24px" />
    ))}
  </HStack>,
  Fab: () => <Fab icon={<Icon size="medium"><AddIcon /></Icon>} ariaLabel="Add" />,
  ButtonGroup: () => <ButtonGroup value="a" onChange={() => {}} size="small">
      <Button value="a" size="small">Day</Button>
      <Button value="b" size="small">Week</Button>
      <Button value="c" size="small">Month</Button>
    </ButtonGroup>,
  Chip: () => <HStack gap="var(--Sizing-1)">
      <Chip label="Unselected" />
      <Chip label="Selected" selected />
      <Chip label="Dismissible" onDelete={() => {}} />
    </HStack>,
  Badge: () => <HStack gap="var(--Sizing-3)">
      <Badge badgeContent={3}><Icon><span>✉</span></Icon></Badge>
      <Badge dot><Icon><span>🔔</span></Icon></Badge>
    </HStack>,
  Alert: () => <VStack gap="var(--Sizing-1)">
      <Alert color="info">Something worth knowing.</Alert>
      <Alert color="error">Something went wrong.</Alert>
    </VStack>,
  Card: () => <Card padding="medium">
      <VStack gap="var(--Sizing-1)">
        <H3>Card title</H3>
        <Body>What a card looks like in this design system.</Body>
      </VStack>
    </Card>,
  Avatar: () => <HStack gap="var(--Sizing-1)">
      <Avatar initials="LN" />
      <Avatar />
    </HStack>,
  Icon: () => <HStack gap="var(--Sizing-1)">
      <Icon color="primary"><span>★</span></Icon>
      <Icon color="success"><span>✓</span></Icon>
      <Icon color="error"><span>✕</span></Icon>
    </HStack>,
  Link: () => <Link href="#example">A link, which thickens rather than recolors on hover</Link>,
  Divider: () => <Divider indicatorText="OR" />,
  Checkbox: () => <VStack gap="var(--Sizing-Half)">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
    </VStack>,
  Radio: () => <RadioGroup defaultValue="a" name="docs-radio">
      <Radio value="a" label="First" />
      <Radio value="b" label="Second" />
    </RadioGroup>,
  Input: () => <TextInput label="Email" placeholder="you@example.com" />,
  SwitchInput: () => <VStack gap="var(--Sizing-Half)">
      <SwitchInput label="Off" />
      <SwitchInput label="On" defaultChecked />
    </VStack>,
  Slider: () => <Slider defaultValue={40} />,
  Rating: () => <Rating defaultValue={3} />,
  Breadcrumbs: () => <Breadcrumbs>
      <Link href="#a">Home</Link>
      <Link href="#b">Products</Link>
      <Body>Current</Body>
    </Breadcrumbs>,
  Pagination: () => <Pagination count={8} defaultPage={3} />,
  Accordion: () => <Accordion>
      <Body>An accordion segment, open.</Body>
    </Accordion>,
  Tabs: () => <Tabs defaultValue={0}>
      <TabList>
        <Tab value={0}>Overview</Tab>
        <Tab value={1}>Details</Tab>
      </TabList>
      <TabPanel value={0}><Body>The first panel.</Body></TabPanel>
      <TabPanel value={1}><Body>The second panel.</Body></TabPanel>
    </Tabs>
};
export function hasExample(component) {
  return component in EXAMPLES;
}

/**
 * Samples keyed to the PROP they illustrate.
 *
 * `PROP_EXAMPLES[component][prop]` renders beside that prop's row in the
 * Summary tab, so the picture appears where the question is asked — the
 * variants next to `variant`, the sizes next to `size` — instead of one strip
 * at the top that answers none of them specifically.
 *
 * Optional and partial on purpose: a prop whose meaning is obvious from its
 * name and values (`disabled`, `fullWidth`) needs no picture, and a component
 * with none simply shows its prop table as before.
 *
 * Each sample is called with the live picker state — `({ theme, surface })` —
 * so it can reflect what the reader has selected. Most do not need it: the
 * sample already renders INSIDE that theme and surface, and the design system
 * defines `--Buttons-Default-*` per scope, so a `variant="default"` button
 * is already "whatever the user has set" without doing anything. The argument
 * is there for the samples that must name a theme explicitly.
 */
export const PROP_EXAMPLES = {
  Fab: {
    /* Figma carries FAB size in the Component-Size collection
       (FAB/FAB-Width 32 / 48 / 56) rather than on a variant axis, so there is
       no Size dropdown on the component — you switch the mode on the frame.
       The icon rides the same collection: FAB/FAB-Icon is 16 / 24 / 32. */
    size: () => <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
      <Fab size="small"  icon={<Icon size="small"><AddIcon /></Icon>}  ariaLabel="Add, small" />
      <Fab size="medium" icon={<Icon size="medium"><AddIcon /></Icon>} ariaLabel="Add, medium" />
      <Fab size="large"  icon={<Icon size="large"><AddIcon /></Icon>}  ariaLabel="Add, large" />
    </HStack>,

    /* Color, and this entry used to get it wrong in a way worth recording.
       It said "set the Buttons MODE on the frame". Verified against the real
       file (FAB, 6778:14825): the FAB's fill is bound to Buttons/Default/Button
       and its stroke to Buttons/Default/Border — PINNED to Default, so the
       Buttons mode is not the axis and setting it on the frame does nothing.

       What varies the color is a THEME mode on an inner frame named
       Theme-Container, shipped at Tertiary. The Theme changes what
       Buttons/Default/* resolves to, which is why the fill can stay pinned.

       That lands in the same trap as component size and the Alt Display: the
       control is a variable mode on a frame INSIDE the instance, so there is
       nothing to find on the instance itself and the component looks like it
       has one color. Hence the screenshot slot on the showcase.

       The two sides agree on the default — Figma ships Theme-Container at
       Tertiary and getTokens() maps `default` to tertiary — but they reach it
       along different collections, so the names are NOT one list:

         Theme    9 modes   Default Primary Secondary Tertiary Neutral
                            Info Success Warning Error
         Buttons 10 modes   the same nine, lowercase, plus black-white

       black-white is therefore reachable from code and NOT from Figma. It is
       shown below because it renders and someone will pass it, but it has no
       counterpart in the design file — a FAB built in Figma cannot be that
       color. Flagged rather than removed: the gap is in the Theme collection,
       not in this sample. */
    color: () => {
      /* The DEFAULT sits on its own at the left, labelled, with a rule between
         it and the rest — otherwise it is just one swatch among ten and the
         thing a reader most needs ("what do I get if I pass nothing?") is the
         hardest to find.

         All ten of the Buttons collection's modes are here. An earlier version
         showed six and silently dropped neutral, info and warning, which reads
         as those colors not existing rather than as the sample being partial. */
      const swatch = (c, isDefault) => (
        <VStack key={c} gap="var(--Sizing-Half)" style={{ alignItems: 'center' }}>
          <Fab color={c} size="small"
               icon={<Icon size="small"><AddIcon /></Icon>}
               ariaLabel={'Add, ' + c} />
          <Caption color={isDefault ? 'standard' : 'quiet'}>{c}</Caption>
        </VStack>
      );
      return (
        <HStack gap="var(--Sizing-2)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {swatch('default', true)}
          <Divider orientation="vertical" flexItem />
          {['primary', 'secondary', 'tertiary', 'neutral', 'info',
            'success', 'warning', 'error', 'black-white'].map(c => swatch(c, false))}
        </HStack>
      );
    },

    /* Extended is a BOOLEAN in Figma (Extended#9244:80, default false), not a
       size or a shape — the same FAB widened to carry a label beside the icon.
       Shown next to the plain one, because the point is the difference. */
    extended: () => <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
      <Fab icon={<Icon size="medium"><EditIcon /></Icon>} ariaLabel="Edit" />
      <Fab icon={<Icon size="medium"><EditIcon /></Icon>} extended label="Edit" />
    </HStack>,

    /* animate is a BOOLEAN in Figma now — Animate#9244:86, default false,
       beside Extended on the FAB set. This said it was code-only, which was
       true when written and stopped being true when the property was added;
       the comment had no way to notice.

       It is backed by a FAB-Animation component set with a Property 1 axis of
       Start | Middle | End — the three keyframes of the pulse, drawn as states
       because a static file cannot show motion. The instance sits inside
       Theme-Container at 48x48 and is hidden on every State variant, so the
       boolean reveals it rather than swapping a variant.

       So the design does not specify the TIMING, only the shape of each
       keyframe. The duration and easing remain code's to choose, and that is
       the honest line to draw rather than "Figma has no such property". */
    animate: () => <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
      <Fab icon={<Icon size="medium"><AddIcon /></Icon>} ariaLabel="Add" />
      <Fab icon={<Icon size="medium"><AddIcon /></Icon>} animate ariaLabel="Add, animated" />
    </HStack>,

    /* Disabled is a STATE on Figma's State axis (Default / Hover / Pressed /
       Disabled / Focus-Visible), not a separate component. */
    disabled: () => <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
      <Fab icon={<Icon size="medium"><AddIcon /></Icon>} ariaLabel="Add" />
      <Fab icon={<Icon size="medium"><AddIcon /></Icon>} disabled ariaLabel="Add, disabled" />
    </HStack>,
  },
  Button: {
    /* SHAPE only, all in the default color — the three values of Figma's Style
       axis: solid, outline, ghost. Color is a SEPARATE axis and is shown where
       color is discussed, so this sample does not mix the two.

       `text` is an ALIAS of ghost, not a fourth shape, so it is not shown:
       placing them side by side implies a difference that does not exist.
       Ghost takes no color prefix at all — it reads from the text role
       (--Hotlink for text, --Quiet for icon-only) rather than a palette. */
    variant: () => <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap' }}>
      <Button>solid</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
    </HStack>,
    size: () => <HStack gap="var(--Sizing-1)" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="small">small</Button>
      <Button size="medium">medium</Button>
      <Button size="large">large</Button>
    </HStack>,

    /* All ten Buttons modes, laid out like the FAB's: the DEFAULT on its own at
       the left behind a rule, then the rest. Otherwise it is one swatch among
       ten and the thing a reader most needs — "what do I get if I pass
       nothing?" — is the hardest thing on the page to find.

       Solid and outline on one row each, because they are the same colour in
       two shapes and showing only solid implies outline is a tenth colour
       rather than a shape. Ghost is absent on purpose: it takes no colour
       prefix at all. */
    variantColor: () => {
      const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info',
                      'success', 'warning', 'error', 'black-white'];
      const row = (suffix) => (
        <HStack gap="var(--Sizing-1)" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant={suffix ? 'default' + suffix : 'default'} size="small">default</Button>
          <Divider orientation="vertical" flexItem />
          {COLORS.map(c => (
            <Button key={c} variant={suffix ? c + suffix : c} size="small">{c}</Button>
          ))}
        </HStack>
      );
      return (
        <VStack gap="var(--Sizing-2)">
          <VStack gap="var(--Sizing-Half)">
            <Caption color="quiet">solid</Caption>
            {row('')}
          </VStack>
          <VStack gap="var(--Sizing-Half)">
            <Caption color="quiet">outline</Caption>
            {row('-outline')}
          </VStack>
        </VStack>
      );
    },
    disabled: () => <HStack gap="var(--Sizing-1)">
      <Button>enabled</Button>
      <Button disabled>disabled</Button>
    </HStack>,

    /* The four Figma booleans — start-icon, start-avatar, end-icon, end-avatar
       — are one prop pair in code: startDecorator / endDecorator take either an
       icon or an avatar, so the position is the prop and the content is the
       argument. */
    'startDecorator / endDecorator': () => <VStack gap="var(--Sizing-1)">
      <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <Button startDecorator={<Icon><AddIcon /></Icon>}>start icon</Button>
        <Button endDecorator={<Icon><ArrowForwardIcon /></Icon>}>end icon</Button>
      </HStack>
      {/* A BARE <Avatar /> is the photo — that is the component's default, and
          `initials` is the override. Button resizes an Avatar in a decorator
          slot automatically (16 / 20 / 40 by button size), so no size is set
          here. */}
      <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <Button startDecorator={<Avatar />}>start avatar</Button>
        <Button endDecorator={<Avatar />}>end avatar</Button>
      </HStack>
    </VStack>,

    /* Figma's TYPE axis — one dropdown, four exclusive values:
       text | iconOnly | letterNumber | Avatar.

       Code splits it into three booleans instead, so `text` is all three false.
       The three that show no readable text each need an accessible name, which
       is why they carry aria-label. */
    iconOnly: () => <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>text</Button>
      <Button iconOnly aria-label="Delete item"><DeleteIcon /></Button>
      <Button letterNumber aria-label="3 unread">3</Button>
      {/* FOUR buttons, one per value of the axis — no fifth.
 
          A bare <Avatar /> and no size: Figma binds the Avatar inside an avatar
          button to Button-Height, so it FILLS the button edge to edge. Passing
          customSize here fought that and drew a small circle floating inside a
          larger one. */}
      <Button avatar aria-label="Jane Doe"><Avatar /></Button>
    </HStack>,

    /* Flat at rest, raised by one level when `elevated`. A button earns its
       shadow by being hovered, so the difference here is the RESTING state. */
    elevated: () => <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>standard</Button>
      <Button elevated>raised</Button>
    </HStack>,

    /* Figma's FIT axis: default hugs the label, fullWidth stretches to the
       container. Shown in a bounded box, because "full width" means nothing
       without a container to be full of. */
    fullWidth: () => <VStack gap="var(--Sizing-1)" style={{ width: '100%', maxWidth: 320 }}>
      <Button>default fit</Button>
      <Button fullWidth>full width</Button>
    </VStack>,
  },
};

/** Does this component have a sample for this prop? */
export function hasPropExample(component, prop) {
  return Boolean(PROP_EXAMPLES[component] && PROP_EXAMPLES[component][prop]);
}
