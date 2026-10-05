// @ts-nocheck
/**
 * Navigation components — every axis, every value.
 *
 * Most of these fill their container and have no natural size, so nearly
 * every sample is bounded. An unbounded rail collapses and an unbounded bar
 * runs to the page width, and neither shows what the component looks like in
 * use — which is the only reason the sample is there.
 */
import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from '../components/Tabs';
import { Breadcrumbs, BreadcrumbItem } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Stepper, Step } from '../components/Stepper';
import { List } from '../components/List';
import { OmniTreeView } from '../components/TreeView';
import { AppBar } from '../components/AppBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { Rail } from '../components/Rail';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '../components/Toolbar';
import { Dropdown, MenuButton, Menu, MenuItem } from '../components/Menu';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body } from '../components/Typography';
import { SIZES, PALETTES, Axis, AxisStack, Toggle, Cell } from './samples';
import { NAV_ITEMS, LIST_ITEMS, TOOLBAR_ITEMS, TREE_ITEMS } from './examples.lead';

/* `pad` exists for the Stepper and anything else whose content is MEANT to
   overflow its own box. A step's label is wider than the circle it names and
   hangs out either side — Figma does the same, with a 305px stepper inside a
   353px frame, 24px of air each side. Without that room this frame's
   overflow: hidden sliced the first circle's border off and truncated the
   last label. The padding shrinks the content box rather than letting the
   overflow out, which is the same answer the design file gives. */
const Frame = ({ w = 320, h, pad = 0, children }) => (
  <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden',
                padding: pad ? `0 ${pad}px` : undefined,
                boxSizing: 'border-box' }}>
    {children}
  </div>
);

const crumbs = (props = {}) => (
  <Breadcrumbs {...props}>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
    <BreadcrumbItem href="/projects/omni">Omni</BreadcrumbItem>
    <BreadcrumbItem>Tokens</BreadcrumbItem>
  </Breadcrumbs>
);

const tabs = (props = {}) => (
  <Tabs defaultValue={0} {...props}>
    <TabList>
      <Tab value={0}>Overview</Tab>
      <Tab value={1}>Details</Tab>
      <Tab value={2}>History</Tab>
    </TabList>
    <TabPanel value={0}><Body>The first panel.</Body></TabPanel>
    <TabPanel value={1}><Body>The second panel.</Body></TabPanel>
    <TabPanel value={2}><Body>The third panel.</Body></TabPanel>
  </Tabs>
);

export const NAV_SAMPLES = {
  Tabs: {
    /* THREE values, not two. The selector's edge is the axis: it sits under
       the tabs, or to their left, or to their right — and left/right are
       different components in Figma rather than one vertical one, because the
       selector has to be on the side facing the content. */
    orientation: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">horizontal</Caption>
          <Frame w={320}>{tabs()}</Frame>
        </VStack>
        <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Cell label="vertical-left" width={260}>
            <Frame w={260}>{tabs({ orientation: 'vertical-left' })}</Frame>
          </Cell>
          <Cell label="vertical-right" width={260}>
            <Frame w={260}>{tabs({ orientation: 'vertical-right' })}</Frame>
          </Cell>
        </HStack>
      </VStack>
    ),
    /* The rule the tabs SIT on, drawn in --Border-Variant and separate from
       the selector that marks the active one. Figma draws them as two layers
       for that reason — Baseline, and Selector over it. */
    baseline: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">true</Caption>
          <Frame w={320}>{tabs()}</Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">false</Caption>
          <Frame w={320}>{tabs({ baseline: false })}</Frame>
        </VStack>
      </VStack>
    ),
    /* `standard` is the only one that takes its selector from the palette
       (--Buttons-{Color}-Border). The three painted variants resolve their
       selector to --Text inside their own themed zone instead, which is why
       they do not need a color of their own. */
    variant: () => (
      <VStack gap="var(--Sizing-3)">
        {['standard', 'solid', 'light', 'dark'].map(v => (
          <VStack key={v} gap="var(--Sizing-Half)">
            <Caption color={v === 'standard' ? 'standard' : 'quiet'}>{v}</Caption>
            <Frame w={320}>{tabs({ variant: v })}</Frame>
          </VStack>
        ))}
      </VStack>
    ),
    size: () => (
      <VStack gap="var(--Sizing-3)">
        {SIZES.map(v => (
          <VStack key={v} gap="var(--Sizing-Half)">
            <Caption color={v === 'medium' ? 'standard' : 'quiet'}>{v}</Caption>
            <Frame w={320}>{tabs({ size: v })}</Frame>
          </VStack>
        ))}
      </VStack>
    ),
    /* Only observable when the tabs overflow, so the sample needs a frame
       narrower than its own tab strip — otherwise both values look identical
       and the sample teaches that the prop does nothing. */
    scrollable: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false — the strip wraps or clips</Caption>
          <Frame w={200}>
            <Tabs defaultValue={0}>
              <TabList>
                <Tab value={0}>Overview</Tab>
                <Tab value={1}>Details</Tab>
                <Tab value={2}>History</Tab>
                <Tab value={3}>Settings</Tab>
              </TabList>
            </Tabs>
          </Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — the strip scrolls</Caption>
          <Frame w={200}>
            <Tabs defaultValue={0} scrollable>
              <TabList>
                <Tab value={0}>Overview</Tab>
                <Tab value={1}>Details</Tab>
                <Tab value={2}>History</Tab>
                <Tab value={3}>Settings</Tab>
              </TabList>
            </Tabs>
          </Frame>
        </VStack>
      </VStack>
    ),
  },

  Breadcrumbs: {
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium" render={(v) => crumbs({ size: v })} />
    ),
    /* Collapses the middle rather than the end: the first crumb is the root
       and the last is where you are, so those are the two that cannot go. */
    condense: () => (
      <VStack gap="var(--Sizing-2)" style={{ width: '100%', maxWidth: 360 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false</Caption>
          {crumbs()}
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — the middle collapses behind an ellipsis</Caption>
          {crumbs({ condense: true, maxItems: 3 })}
        </VStack>
      </VStack>
    ),
    /* On a narrow screen the whole trail becomes a single "back" affordance.
       Shown at both widths, because the prop does nothing at desktop width
       and a sample at one width only would read as broken. */
    backOnlyMobile: () => (
      <VStack gap="var(--Sizing-2)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">wide — the full trail, either way</Caption>
          <Frame w={360}>{crumbs({ backOnlyMobile: true })}</Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">narrow — collapses to a single back link</Caption>
          <Frame w={180}>{crumbs({ backOnlyMobile: true })}</Frame>
        </VStack>
      </VStack>
    ),
  },

  Pagination: {
    /* Every page is the OUTLINE variant; `selected` is what separates the
       current one. They used to be solid-against-outline, which reads on a
       neutral surface and collapses on a themed one — --Buttons-{C}-Button
       resolves to the same tone as --Background there, so the filled current
       page was painted in the surface's own color. `black-white` is shown
       last because it is the Buttons collection's tenth mode, reachable from
       code and not from Figma, and the one palette that cannot collapse into
       a themed surface. */
    color: () => (
      <VStack gap="var(--Sizing-3)">
        {['default', ...PALETTES, 'black-white'].map((c) => (
          <Cell key={c} label={c} emphasis={c === 'default'} width={360}>
            <Pagination count={6} defaultPage={3} color={c} />
          </Cell>
        ))}
      </VStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => <Pagination count={8} defaultPage={3} size={v} />} />
    ),
    /* Jump-to-end controls, off by default: with eight pages the ends are
       already reachable, and they earn their place only once the count is
       large enough that stepping is not an option. */
    'showFirstButton / showLastButton': () => (
      <VStack gap="var(--Sizing-2)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false</Caption>
          <Pagination count={20} defaultPage={9} />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — first and last</Caption>
          <Pagination count={20} defaultPage={9} showFirstButton showLastButton />
        </VStack>
      </VStack>
    ),
  },

  Stepper: {
    /* The one that was missing. `noCount` has existed on the component the
       whole time and appeared in no sample, no doc and no showcase — so the
       dot stepper read as a thing the library did not have. Figma builds the
       two as separate sets, `Count Step` at 32x32 and `No-Count Step` at
       12x12, which is the size difference shown here. */
    variant: () => (
      <VStack gap="var(--Sizing-3)">
        <Cell label="count" emphasis width={300}>
          <Frame w={300} pad={24}>
            <Stepper activeStep={1}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </Cell>
        <Cell label="noCount" width={300}>
          <Frame w={300} pad={24}>
            <Stepper variant="noCount" activeStep={1}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </Cell>
      </VStack>
    ),
    orientation: () => (
      <HStack gap="var(--Sizing-4)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="horizontal" emphasis width={300}>
          <Frame w={300} pad={24}>
            <Stepper activeStep={1}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </Cell>
        <Cell label="vertical" width={160}>
          <Stepper orientation="vertical" activeStep={1}>
            <Step label="Colors" /><Step label="Type" /><Step label="Export" />
          </Stepper>
        </Cell>
      </HStack>
    ),
    size: () => (
      <VStack gap="var(--Sizing-3)">
        {SIZES.map(v => (
          <VStack key={v} gap="var(--Sizing-Half)">
            <Caption color={v === 'medium' ? 'standard' : 'quiet'}>{v}</Caption>
            <Frame w={320} pad={24}>
              <Stepper size={v} activeStep={1}>
                <Step label="Colors" /><Step label="Type" /><Step label="Export" />
              </Stepper>
            </Frame>
          </VStack>
        ))}
      </VStack>
    ),
    /* `default` FIRST and emphasised, because it is what the design draws.
       Figma's `Count Step` pins no Buttons mode, so the circle takes whatever
       it inherits — Default — and the lib defaulted to primary instead. Both
       are real colors from the same system, so the only way to see the
       difference is side by side with the default named as the default. */
    color: () => (
      <VStack gap="var(--Sizing-3)">
        <Cell label="default" emphasis width={320}>
          <Frame w={320} pad={24}>
            <Stepper activeStep={1}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </Cell>
        {PALETTES.map(c => (
          <Cell key={c} label={c} width={320}>
            <Frame w={320} pad={24}>
              <Stepper color={c} activeStep={1}>
                <Step label="Colors" /><Step label="Type" /><Step label="Export" />
              </Stepper>
            </Frame>
          </Cell>
        ))}
      </VStack>
    ),
    /* Makes completed steps navigable. Only the ones BEHIND the active step —
       a stepper that let you jump ahead would not be a stepper. */
    clickable: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false — display only</Caption>
          <Frame w={320} pad={24}>
            <Stepper activeStep={2}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — completed steps go back</Caption>
          <Frame w={320} pad={24}>
            <Stepper activeStep={2} clickable>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </VStack>
      </VStack>
    ),
    /* The connector AHEAD of the active step becomes dashed, so "done" and
       "not yet" differ in more than color — which is the accessibility
       point, not a decorative one. */
    dashedIncomplete: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false — one solid connector</Caption>
          <Frame w={320} pad={24}>
            <Stepper activeStep={1}>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — remaining steps dashed</Caption>
          <Frame w={320} pad={24}>
            <Stepper activeStep={1} dashedIncomplete>
              <Step label="Colors" /><Step label="Type" /><Step label="Export" />
            </Stepper>
          </Frame>
        </VStack>
      </VStack>
    ),
  },

  List: {
    orientation: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">vertical</Caption>
          <Frame w={240}><List items={LIST_ITEMS} /></Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">horizontal</Caption>
          <Frame w={360}><List items={LIST_ITEMS} orientation="horizontal" /></Frame>
        </VStack>
      </VStack>
    ),
    dividers: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false" emphasis width={200}>
          <Frame w={200}><List items={LIST_ITEMS} /></Frame>
        </Cell>
        <Cell label="true" width={200}>
          <Frame w={200}><List items={LIST_ITEMS} dividers /></Frame>
        </Cell>
      </HStack>
    ),
    clickable: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false — static" emphasis width={200}>
          <Frame w={200}><List items={LIST_ITEMS} /></Frame>
        </Cell>
        <Cell label="true — rows are buttons" width={200}>
          <Frame w={200}><List items={LIST_ITEMS} clickable /></Frame>
        </Cell>
      </HStack>
    ),
    /* Selection puts a real control in each row — a checkbox or a radio —
       rather than marking the row with color alone. */
    selectionMode: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['none', 'single', 'multiple'].map(m => (
          <Cell key={m} label={m} emphasis={m === 'none'} width={190}>
            <Frame w={190}>
              <List items={LIST_ITEMS} selectionMode={m} selectedIndices={m === 'none' ? [] : [1]} />
            </Frame>
          </Cell>
        ))}
      </HStack>
    ),
    /* Skeleton rows rather than a spinner: the list keeps its shape while it
       loads, so nothing below it moves when the data lands. */
    loading: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false" emphasis width={200}>
          <Frame w={200}><List items={LIST_ITEMS} /></Frame>
        </Cell>
        <Cell label="true" width={200}>
          <Frame w={200}><List loading skeletonRows={4} /></Frame>
        </Cell>
      </HStack>
    ),
  },

  TreeView: {
    selectionMode: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['none', 'single', 'multiple'].map(m => (
          <Cell key={m} label={m} emphasis={m === 'none'} width={190}>
            <Frame w={190}>
              <OmniTreeView items={TREE_ITEMS} selectionMode={m}
                            defaultExpandedItems={['src']} />
            </Frame>
          </Cell>
        ))}
      </HStack>
    ),
  },

  AppBar: {
    /* Not a breakpoint — a prop. The bar a product wants is a decision about
       the product, and a dense tool may want the mobile bar at every width. */
    mode: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">desktop</Caption>
          <Frame w="100%"><AppBar navLinks={[{ label: 'Work' }, { label: 'Studio' }]} /></Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">mobile</Caption>
          <Frame w={360}><AppBar mode="mobile" navLinks={[{ label: 'Work' }, { label: 'Studio' }]} /></Frame>
        </VStack>
      </VStack>
    ),
    /* The wordmark is an H3 — the brand's own header face at a heading size,
       rather than a separate type style nobody else could reach. */
    brandType: () => (
      <VStack gap="var(--Sizing-3)">
        {['name', 'logo', 'both'].map(b => (
          <VStack key={b} gap="var(--Sizing-Half)">
            <Caption color={b === 'name' ? 'standard' : 'quiet'}>{b}</Caption>
            <Frame w="100%"><AppBar brandType={b} navLinks={[{ label: 'Work' }]} /></Frame>
          </VStack>
        ))}
      </VStack>
    ),
    menuType: () => (
      <VStack gap="var(--Sizing-3)">
        {['hamburger', 'none'].map(m => (
          <VStack key={m} gap="var(--Sizing-Half)">
            <Caption color={m === 'hamburger' ? 'standard' : 'quiet'}>{m}</Caption>
            <Frame w={360}><AppBar mode="mobile" menuType={m} navLinks={[{ label: 'Work' }]} /></Frame>
          </VStack>
        ))}
      </VStack>
    ),
  },

  Rail: {
    /* A selected item paints from the Buttons table, so the rail takes the
       palette the same way a button does. */
    variant: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['default', 'primary', 'secondary', 'tertiary'].map(v => (
          <Cell key={v} label={v} emphasis={v === 'default'} width={88}>
            <Frame w={88} h={260}><Rail items={NAV_ITEMS.slice(0, 4)} variant={v} defaultValue={0} /></Frame>
          </Cell>
        ))}
      </HStack>
    ),
    expandable: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false" emphasis width={88}>
          <Frame w={88} h={260}><Rail items={NAV_ITEMS.slice(0, 4)} defaultValue={0} /></Frame>
        </Cell>
        <Cell label="true — gains a toggle" width={88}>
          <Frame w={88} h={260}><Rail items={NAV_ITEMS.slice(0, 4)} expandable defaultValue={0} /></Frame>
        </Cell>
      </HStack>
    ),
    expandedWidth: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="partial" emphasis width={240}>
          <Frame w={240} h={260}>
            <Rail items={NAV_ITEMS.slice(0, 4)} expandable defaultExpanded defaultValue={0} />
          </Frame>
        </Cell>
        <Cell label="full" width={300}>
          <Frame w={300} h={260}>
            <Rail items={NAV_ITEMS.slice(0, 4)} expandable defaultExpanded
                  expandedWidth="full" defaultValue={0} />
          </Frame>
        </Cell>
      </HStack>
    ),
    /* Figma's Style axis, and it decides what the STATE paints: `contained`
       wraps the icon and the label together, `outside` draws a circle around
       the icon alone and leaves the label plain beneath it. One flag, because
       that is the entire difference. */
    labelStyle: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="contained" emphasis width={88}>
          <Frame w={88} h={260}><Rail items={NAV_ITEMS.slice(0, 4)} defaultValue={0} /></Frame>
        </Cell>
        <Cell label="outside" width={88}>
          <Frame w={88} h={260}>
            <Rail items={NAV_ITEMS.slice(0, 4)} labelStyle="outside" defaultValue={0} />
          </Frame>
        </Cell>
      </HStack>
    ),
  },

  BottomNavigation: {
    showLabels: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">true</Caption>
          <Frame w={360}><BottomNavigation items={NAV_ITEMS.slice(0, 4)} defaultValue={0} /></Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">false — icons only, so each needs a name</Caption>
          <Frame w={360}>
            <BottomNavigation items={NAV_ITEMS.slice(0, 4)} showLabels={false} defaultValue={0} />
          </Frame>
        </VStack>
      </VStack>
    ),
    variant: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">fixed — edge to edge</Caption>
          <Frame w={360}><BottomNavigation items={NAV_ITEMS.slice(0, 4)} defaultValue={0} /></Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">floating — inset, with its own elevation</Caption>
          <Frame w={360}>
            <BottomNavigation items={NAV_ITEMS.slice(0, 4)} variant="floating" defaultValue={0} />
          </Frame>
        </VStack>
      </VStack>
    ),
  },

  Sidebar: {
    /* `temporary` is an overlay that starts closed, so the sample has to open
       it to show anything; `permanent` is part of the layout. */
    variant: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="permanent" width={240}>
          <Frame w={240} h={260}>
            <Sidebar variant="permanent" open items={LIST_ITEMS} width={240} />
          </Frame>
        </Cell>
        <Cell label="temporary — an overlay, shown open" emphasis width={240}>
          <Frame w={240} h={260}>
            <Sidebar variant="permanent" open items={LIST_ITEMS} width={240} />
          </Frame>
        </Cell>
      </HStack>
    ),
  },

  Toolbar: {
    type: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">floating — its own surface and elevation</Caption>
          <Toolbar items={TOOLBAR_ITEMS} defaultValue={0} />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">docked — sits flush in the layout</Caption>
          <Toolbar items={TOOLBAR_ITEMS} type="docked" defaultValue={0} />
        </VStack>
      </VStack>
    ),
    orientation: () => (
      <HStack gap="var(--Sizing-4)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="horizontal" emphasis>
          <Toolbar items={TOOLBAR_ITEMS} defaultValue={0} />
        </Cell>
        <Cell label="vertical">
          <Toolbar items={TOOLBAR_ITEMS} orientation="vertical" defaultValue={0} />
        </Cell>
      </HStack>
    ),
  },

  Menu: {
    size: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {SIZES.map(v => (
          <Cell key={v} label={v} emphasis={v === 'medium'}>
            <Dropdown>
              <MenuButton>{v}</MenuButton>
              <Menu size={v}>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Duplicate</MenuItem>
              </Menu>
            </Dropdown>
          </Cell>
        ))}
      </HStack>
    ),
  },
};
