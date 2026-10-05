// @ts-nocheck
/**
 * Surfaces and overlays — every axis, every value.
 *
 * The overlays need a different shape from every other sample on the page.
 * An axis like Drawer's `anchor` cannot be shown as four things side by side,
 * because each one covers the screen; and forcing one open inline shows a
 * panel with no backdrop, no focus trap and no escape, which teaches a shape
 * that does not run.
 *
 * So each value gets a TRIGGER, and the reader opens them one at a time. It
 * is more clicking than a row of swatches and it is the only version that is
 * true — the alternative is a picture of something the component never does.
 */
import React, { useRef, useState } from 'react';
import { Card } from '../components/Card';
import { Accordion } from '../components/Accordion';
import { Paper } from '../components/Paper';
import { Ratio } from '../components/Ratio';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Dialog } from '../components/Dialog';
import { Drawer } from '../components/Drawer';
import { Snackbar } from '../components/Snackbar';
import { Tooltip } from '../components/Tooltip';
import { Popover } from '../components/Popover';
import { Button } from '../components/Button';
import { List } from '../components/List';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body, H3 } from '../components/Typography';
import { SIZES, Axis, AxisStack, Toggle, Cell } from './samples';
import { TABLE_COLUMNS, TABLE_ROWS, LIST_ITEMS } from './examples.lead';

const Frame = ({ w = 320, h, children }) => (
  <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
    {children}
  </div>
);

const cardBody = (
  <VStack gap="var(--Sizing-1)">
    <H3>Card title</H3>
    <Body>What a card looks like in this design system.</Body>
  </VStack>
);

/* One trigger per value of an overlay's axis.
   The open state lives here rather than in the sample function, because the
   entries in PROP_EXAMPLES are plain functions called during render and
   cannot hold a hook. */
function OverlayAxis({ values, defaultValue, render, label = (v) => String(v) }) {
  const [openValue, setOpenValue] = useState(null);
  const ordered = defaultValue !== undefined
    ? [defaultValue, ...values.filter(v => v !== defaultValue)]
    : values;
  return (
    <>
      <HStack gap="var(--Sizing-1)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        {ordered.map(v => (
          <Button key={String(v)}
                  size="small"
                  variant={v === defaultValue ? 'default' : 'outline'}
                  onClick={() => setOpenValue(v)}>
            {label(v)}
          </Button>
        ))}
      </HStack>
      {openValue !== null
        ? render(openValue, () => setOpenValue(null))
        : null}
    </>
  );
}

function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  return (
    <>
      <Button ref={anchorRef} variant="outline" onClick={() => setOpen(o => !o)}>
        {open ? 'Close' : 'Open'} popover
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} width={240}>
        <VStack gap="var(--Sizing-1)" style={{ padding: 'var(--Sizing-2)' }}>
          <Body>Anchored to the button, portalled to the body so no ancestor can clip it.</Body>
        </VStack>
      </Popover>
    </>
  );
}

import { Box } from '../components/Box';
import { SpeedDial } from '../components/SpeedDial';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

/* Three actions, named. The name is the accessible name whether or not
   tooltips are on, so a sample with unnamed actions would be demonstrating the
   mistake. */
const SPEED_ACTIONS = [
  { icon: <AddIcon />, name: 'New document', onClick: () => {} },
  { icon: <PersonIcon />, name: 'Invite someone', onClick: () => {} },
  { icon: <SettingsIcon />, name: 'Settings', onClick: () => {} },
];

export const SURFACE_SAMPLES = {
  Box: {
    /* Painted, not outlined. A radius ramp on a transparent box shows nothing
       — the corner is only visible where a surface ends. */
    radius: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap' }}>
        {['none', 'small', 'medium', 'large'].map((r) => (
          <Cell key={r} label={r} emphasis={r === 'none'}>
            <Box surface="Container" radius={r}
                 style={{ width: 96, height: 64 }} />
          </Cell>
        ))}
      </HStack>
    ),
  },

  SpeedDial: {
    variant: () => (
      <HStack gap="var(--Sizing-6)" style={{ flexWrap: 'wrap' }}>
        {['solid', 'outline'].map((v) => (
          <Cell key={v} label={v} emphasis={v === 'solid'}>
            <div style={{ height: 180, width: 120, position: 'relative' }}>
              <SpeedDial open variant={v} ariaLabel={'Create ' + v}
                         actions={SPEED_ACTIONS} />
            </div>
          </Cell>
        ))}
      </HStack>
    ),
    /* All four, open, because the direction IS the fan and a closed dial
       points nowhere. */
    direction: () => (
      <HStack gap="var(--Sizing-6)" style={{ flexWrap: 'wrap' }}>
        {['up', 'down', 'left', 'right'].map((d) => (
          <Cell key={d} label={d} emphasis={d === 'up'}>
            <div style={{ height: 200, width: 200, position: 'relative',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SpeedDial open direction={d} ariaLabel={'Create ' + d}
                         actions={SPEED_ACTIONS} />
            </div>
          </Cell>
        ))}
      </HStack>
    ),
    showTooltips: () => (
      <HStack gap="var(--Sizing-6)" style={{ flexWrap: 'wrap' }}>
        {[false, true].map((on) => (
          <Cell key={String(on)} label={String(on)} emphasis={!on}>
            <div style={{ height: 180, width: 180, position: 'relative' }}>
              <SpeedDial open showTooltips={on} ariaLabel={'Create ' + on}
                         actions={SPEED_ACTIONS} />
            </div>
          </Cell>
        ))}
      </HStack>
    ),
  },

  Card: {
    /* The same three shapes as Button — solid, outlined, ghost — because a
       card is a surface and these are what a surface can be. */
    variant: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['solid', 'outlined', 'ghost'].map(v => (
          <Cell key={v} label={v} emphasis={v === 'solid'} width={200}>
            <Card variant={v} padding="medium">{cardBody}</Card>
          </Cell>
        ))}
      </HStack>
    ),
    size: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {SIZES.map(v => (
          <Cell key={v} label={v} emphasis={v === 'medium'} width={200}>
            <Card size={v} padding="medium">{cardBody}</Card>
          </Cell>
        ))}
      </HStack>
    ),
    orientation: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">vertical</Caption>
          <Frame w={200}><Card padding="medium">{cardBody}</Card></Frame>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">horizontal</Caption>
          <Frame w={360}><Card orientation="horizontal" padding="medium">{cardBody}</Card></Frame>
        </VStack>
      </VStack>
    ),
    /* Makes the whole card one control, so it gains hover, pressed and a
       focus ring — and owes the reader exactly one action. */
    clickable: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false — static" emphasis width={200}>
          <Card padding="medium">{cardBody}</Card>
        </Cell>
        <Cell label="true — one control" width={200}>
          <Card padding="medium" clickable>{cardBody}</Card>
        </Cell>
      </HStack>
    ),
    /* Figma's Card has an explicit elevation of Standard or Elevated, and
       this is that axis: level 1 at rest, level 2 when elevated, each
       stepping up by one on hover. */
    elevated: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="standard — level 1" emphasis width={200}>
          <Card padding="medium">{cardBody}</Card>
        </Cell>
        <Cell label="elevated — level 2" width={200}>
          <Card padding="medium" elevated>{cardBody}</Card>
        </Cell>
      </HStack>
    ),
    selected: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false" emphasis width={200}>
          <Card padding="medium" clickable>{cardBody}</Card>
        </Cell>
        <Cell label="true" width={200}>
          <Card padding="medium" clickable selected>{cardBody}</Card>
        </Cell>
      </HStack>
    ),
  },

  Accordion: {
    variant: () => (
      <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 380 }}>
        {['solid', 'outlined', 'ghost'].map(v => (
          <VStack key={v} gap="var(--Sizing-Half)">
            <Caption color={v === 'solid' ? 'standard' : 'quiet'}>{v}</Caption>
            <Accordion variant={v} title="What is a design system?" defaultExpanded>
              <Body>A set of decisions, written down once.</Body>
            </Accordion>
          </VStack>
        ))}
      </VStack>
    ),
    size: () => (
      <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 380 }}>
        {SIZES.map(v => (
          <VStack key={v} gap="var(--Sizing-Half)">
            <Caption color={v === 'medium' ? 'standard' : 'quiet'}>{v}</Caption>
            <Accordion size={v} title={'Size ' + v} defaultExpanded>
              <Body>A set of decisions, written down once.</Body>
            </Accordion>
          </VStack>
        ))}
      </VStack>
    ),
    defaultExpanded: () => (
      <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 380 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false — starts closed</Caption>
          <Accordion title="What is a design system?">
            <Body>A set of decisions, written down once.</Body>
          </Accordion>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — starts open</Caption>
          <Accordion title="What is a design system?" defaultExpanded>
            <Body>A set of decisions, written down once.</Body>
          </Accordion>
        </VStack>
      </VStack>
    ),
    disabled: () => (
      <VStack gap="var(--Sizing-2)" style={{ width: '100%', maxWidth: 380 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">enabled</Caption>
          <Accordion title="What is a design system?">
            <Body>A set of decisions, written down once.</Body>
          </Accordion>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">disabled</Caption>
          <Accordion title="What is a design system?" disabled>
            <Body>A set of decisions, written down once.</Body>
          </Accordion>
        </VStack>
      </VStack>
    ),
  },

  Paper: {
    /* `outlined` is a shorthand that sets `variant` — pass either, not both.
       An outlined Paper takes elevation 0, because a border and a shadow are
       two answers to the same question. */
    outlined: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false — elevation" emphasis width={180}>
          <Paper surface="Container">
            <div style={{ padding: 'var(--Sizing-3)' }}><Body>Elevated</Body></div>
          </Paper>
        </Cell>
        <Cell label="true — a border, no shadow" width={180}>
          <Paper surface="Container" outlined>
            <div style={{ padding: 'var(--Sizing-3)' }}><Body>Outlined</Body></div>
          </Paper>
        </Cell>
      </HStack>
    ),
    variant: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['elevation', 'outlined'].map(v => (
          <Cell key={v} label={v} emphasis={v === 'elevation'} width={180}>
            <Paper surface="Container" variant={v}>
              <div style={{ padding: 'var(--Sizing-3)' }}><Body>{v}</Body></div>
            </Paper>
          </Cell>
        ))}
      </HStack>
    ),
  },

  Ratio: {
    /* Which dimension the ratio is computed FROM. `width` is the usual one —
       the box fills its column and derives its height. `height` is for a row
       of items that must share a height and may differ in width. */
    fit: () => (
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">width — height follows the column</Caption>
          <div style={{ width: 240 }}><Ratio ratio="16:9" /></div>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">height — width follows the row</Caption>
          <div style={{ height: 120 }}><Ratio ratio="16:9" fit="height" /></div>
        </VStack>
      </VStack>
    ),
  },

  Table: {
    /* Skeleton rows, not a spinner: the table keeps its column widths while
       it loads, so the header does not jump when the data arrives. */
    loading: () => (
      <VStack gap="var(--Sizing-3)" style={{ width: '100%' }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false</Caption>
          <Table columns={TABLE_COLUMNS} rows={TABLE_ROWS} />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — the shape is kept</Caption>
          <Table columns={TABLE_COLUMNS} rows={[]} loading skeletonRows={3} />
        </VStack>
      </VStack>
    ),
  },

  Modal: {
    open: () => (
      <OverlayAxis
        values={[true]}
        label={() => 'Open modal'}
        render={(v, close) => (
          <Modal open onClose={close} title="Rename project">
            <VStack gap="var(--Sizing-2)">
              <Body>A modal takes the whole screen`s attention, so it owes the reader a way out.</Body>
              <Button onClick={close}>Done</Button>
            </VStack>
          </Modal>
        )}
      />
    ),
    size: () => (
      <OverlayAxis
        values={SIZES} defaultValue="medium"
        render={(v, close) => (
          <Modal open onClose={close} size={v} title={'Size ' + v}>
            <Body>The modal`s width. Its height always follows its content.</Body>
          </Modal>
        )}
      />
    ),
    /* `top` anchors it near the top of the viewport, which is what a modal
       whose content can grow wants — a centred one that grows moves its own
       header off the screen. */
    layout: () => (
      <OverlayAxis
        values={['center', 'top']} defaultValue="center"
        render={(v, close) => (
          <Modal open onClose={close} layout={v} title={'Layout ' + v}>
            <Body>Where the modal sits in the viewport.</Body>
          </Modal>
        )}
      />
    ),
    /* Off for anything with unsaved work: a stray click outside should not
       discard what someone typed. */
    closeOnBackdrop: () => (
      <OverlayAxis
        values={[true, false]} defaultValue={true}
        label={(v) => v ? 'true — click outside closes' : 'false — click outside does nothing'}
        render={(v, close) => (
          <Modal open onClose={close} closeOnBackdrop={v} title="Rename project">
            <VStack gap="var(--Sizing-2)">
              <Body>{v ? 'Click the backdrop to close.' : 'The backdrop will not close this.'}</Body>
              <Button onClick={close}>Close</Button>
            </VStack>
          </Modal>
        )}
      />
    ),
    /* Turning it off removes the only visible way out, so something inside
       has to provide one. */
    showCloseButton: () => (
      <OverlayAxis
        values={[true, false]} defaultValue={true}
        label={(v) => v ? 'true' : 'false — needs its own way out'}
        render={(v, close) => (
          <Modal open onClose={close} showCloseButton={v} title="Rename project">
            <VStack gap="var(--Sizing-2)">
              <Body>A modal with no close button must give one in its content.</Body>
              <Button onClick={close}>Done</Button>
            </VStack>
          </Modal>
        )}
      />
    ),
  },

  Dialog: {
    open: () => (
      <OverlayAxis
        values={[true]} label={() => 'Open dialog'}
        render={(v, close) => (
          <Dialog open onClose={close} title="Discard changes?"
                  actions={<>
                    <Button variant="outline" onClick={close}>Keep editing</Button>
                    <Button variant="error" onClick={close}>Discard</Button>
                  </>}>
            <Body>This cannot be undone.</Body>
          </Dialog>
        )}
      />
    ),
    maxWidth: () => (
      <OverlayAxis
        values={['xs', 'sm', 'md', 'lg']} defaultValue="sm"
        render={(v, close) => (
          <Dialog open onClose={close} maxWidth={v} title={'maxWidth ' + v}
                  actions={<Button onClick={close}>Close</Button>}>
            <Body>A ceiling, not a width — a short dialog stays narrow.</Body>
          </Dialog>
        )}
      />
    ),
    fullScreen: () => (
      <OverlayAxis
        values={[false, true]} defaultValue={false}
        label={(v) => v ? 'true' : 'false'}
        render={(v, close) => (
          <Dialog open onClose={close} fullScreen={v} title="Edit tokens"
                  actions={<Button onClick={close}>Close</Button>}>
            <Body>Full screen is for a dialog carrying a whole task on a small screen.</Body>
          </Dialog>
        )}
      />
    ),
    /* `alert` changes the ROLE to alertdialog, which makes a screen reader
       announce the body immediately rather than only the title. For a
       destructive confirmation that is the difference between hearing the
       consequence and hearing "Discard changes?" alone. */
    alert: () => (
      <OverlayAxis
        values={[false, true]} defaultValue={false}
        label={(v) => v ? 'true — role=alertdialog' : 'false — role=dialog'}
        render={(v, close) => (
          <Dialog open onClose={close} alert={v} title="Delete project?"
                  actions={<>
                    <Button variant="outline" onClick={close}>Cancel</Button>
                    <Button variant="error" onClick={close}>Delete</Button>
                  </>}>
            <Body>Every file in it goes too. This cannot be undone.</Body>
          </Dialog>
        )}
      />
    ),
    /* Non-modal leaves the rest of the page usable — no backdrop, no focus
       trap. For anything the reader may need to consult the page to answer. */
    nonModal: () => (
      <OverlayAxis
        values={[false, true]} defaultValue={false}
        label={(v) => v ? 'true — the page stays usable' : 'false — modal'}
        render={(v, close) => (
          <Dialog open onClose={close} nonModal={v} title="Find in page"
                  actions={<Button onClick={close}>Close</Button>}>
            <Body>{v ? 'The page behind this is still interactive.' : 'The page behind this is blocked.'}</Body>
          </Dialog>
        )}
      />
    ),
  },

  Drawer: {
    open: () => (
      <OverlayAxis
        values={[true]} label={() => 'Open drawer'}
        render={(v, close) => (
          <Drawer open onClose={close}>
            <VStack gap="var(--Sizing-2)" style={{ padding: 'var(--Sizing-3)', minWidth: 240 }}>
              <H3>Filters</H3>
              <List items={LIST_ITEMS} clickable />
              <Button onClick={close}>Close</Button>
            </VStack>
          </Drawer>
        )}
      />
    ),
    /* Four edges. Left and right are navigation and filters; bottom is the
       phone idiom for an action sheet; top is for something that interrupts. */
    anchor: () => (
      <OverlayAxis
        values={['left', 'right', 'top', 'bottom']} defaultValue="left"
        render={(v, close) => (
          <Drawer open onClose={close} anchor={v}>
            <VStack gap="var(--Sizing-2)" style={{ padding: 'var(--Sizing-3)', minWidth: 240 }}>
              <H3>anchor={v}</H3>
              <Button onClick={close}>Close</Button>
            </VStack>
          </Drawer>
        )}
      />
    ),
    size: () => (
      <OverlayAxis
        values={SIZES} defaultValue="medium"
        render={(v, close) => (
          <Drawer open onClose={close} size={v}>
            <VStack gap="var(--Sizing-2)" style={{ padding: 'var(--Sizing-3)' }}>
              <H3>size={v}</H3>
              <Button onClick={close}>Close</Button>
            </VStack>
          </Drawer>
        )}
      />
    ),
    /* Without a backdrop there is nothing to click to dismiss and nothing
       dimming the page, so the drawer reads as part of the layout. */
    hideBackdrop: () => (
      <OverlayAxis
        values={[false, true]} defaultValue={false}
        label={(v) => v ? 'true — no scrim' : 'false — scrim'}
        render={(v, close) => (
          <Drawer open onClose={close} hideBackdrop={v}>
            <VStack gap="var(--Sizing-2)" style={{ padding: 'var(--Sizing-3)', minWidth: 240 }}>
              <H3>Filters</H3>
              <Button onClick={close}>Close</Button>
            </VStack>
          </Drawer>
        )}
      />
    ),
  },

  Snackbar: {
    open: () => (
      <OverlayAxis
        values={[true]} label={() => 'Show snackbar'}
        render={(v, close) => (
          <Snackbar open onClose={close} color="success" autoHideDuration={4000}>
            Project saved.
          </Snackbar>
        )}
      />
    ),
    /* Four, not nine — a snackbar reports status, so the accent palettes have
       no meaning here. */
    color: () => (
      <OverlayAxis
        values={['info', 'success', 'warning', 'error']} defaultValue="info"
        render={(v, close) => (
          <Snackbar open onClose={close} color={v} autoHideDuration={4000}>
            {v} — something happened.
          </Snackbar>
        )}
      />
    ),
    anchor: () => (
      <OverlayAxis
        values={['bottom', 'top']} defaultValue="bottom"
        render={(v, close) => (
          <Snackbar open onClose={close} anchor={v} color="info" autoHideDuration={4000}>
            anchor={v}
          </Snackbar>
        )}
      />
    ),
  },

  Tooltip: {
    /* Hover or focus any of the four. A tooltip flips to the opposite side
       when there is no room, so the prop is a preference rather than a
       guarantee. */
    placement: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        {['bottom', 'top', 'left', 'right'].map(p => (
          <Cell key={p} label={p} emphasis={p === 'bottom'}>
            <Tooltip title={'placement=' + p} placement={p}>
              <Button variant="outline" size="small">{p}</Button>
            </Tooltip>
          </Cell>
        ))}
      </HStack>
    ),
    arrow: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <Cell label="true" emphasis>
          <Tooltip title="With an arrow"><Button variant="outline" size="small">arrow</Button></Tooltip>
        </Cell>
        <Cell label="false">
          <Tooltip title="No arrow" arrow={false}>
            <Button variant="outline" size="small">no arrow</Button>
          </Tooltip>
        </Cell>
      </HStack>
    ),
    /* Changes which ARIA relationship the tooltip uses. By default it NAMES
       the control, replacing its label; `describeChild` makes it a
       DESCRIPTION instead, so the control keeps its own name and the tooltip
       is read after it. Use it whenever the trigger already has a label the
       tooltip is only adding to — otherwise the real name is lost. */
    describeChild: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <Cell label="false — the tooltip is the name" emphasis>
          <Tooltip title="Delete item">
            <Button variant="outline" size="small" iconOnly aria-label="Delete item">x</Button>
          </Tooltip>
        </Cell>
        <Cell label="true — the tooltip describes it">
          <Tooltip title="Removes it permanently" describeChild>
            <Button variant="outline" size="small">Delete</Button>
          </Tooltip>
        </Cell>
      </HStack>
    ),
  },

  Popover: {
    open: () => <PopoverDemo />,
  },
};
