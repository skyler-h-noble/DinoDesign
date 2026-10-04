// @ts-nocheck
/**
 * ButtonGroup — every axis.
 *
 * The component had no doc at all until now, so none of this was shown
 * anywhere: joined vs separated, the three fits, the three shapes, the nine
 * palettes, the sizes, or either selection mode.
 *
 * `separated` and `fit` are the two that are easiest to confuse because both
 * are about width, so each is shown against its opposite in a bounded box —
 * "fill" means nothing without a container to be full of.
 */
import React, { useState } from 'react';
import { ButtonGroup } from '../components/ButtonGroup';
import { ToggleButtonGroup } from '../components/ToggleButtonGroup';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body } from '../components/Typography';
import { PALETTES, SIZES, Cell } from './samples';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

/* Uncontrolled would leave every sample stuck on its first value, so each
   group owns a little state. A sample you cannot click is a picture of a
   control rather than the control. */
function Group({ options = ['Day', 'Week', 'Month'], initial = 'Day', ...props }) {
  const [value, setValue] = useState(initial);
  return (
    <ButtonGroup value={value} onChange={setValue} aria-label="Range" {...props}>
      {options.map(o => <Button key={o} value={o}>{o}</Button>)}
    </ButtonGroup>
  );
}

function MultiGroup(props) {
  const [value, setValue] = useState(['Bold']);
  return (
    <ButtonGroup multiple value={value} onChange={setValue} aria-label="Style" {...props}>
      <Button value="Bold">Bold</Button>
      <Button value="Italic">Italic</Button>
      <Button value="Under">Underline</Button>
    </ButtonGroup>
  );
}

function IconGroup(props) {
  const [value, setValue] = useState('left');
  return (
    <ButtonGroup value={value} onChange={setValue} aria-label="Alignment" {...props}>
      <Button value="left" iconOnly aria-label="Align left">
        <Icon><FormatAlignLeftIcon /></Icon>
      </Button>
      <Button value="center" iconOnly aria-label="Align center">
        <Icon><FormatAlignCenterIcon /></Icon>
      </Button>
      <Button value="right" iconOnly aria-label="Align right">
        <Icon><FormatAlignRightIcon /></Icon>
      </Button>
    </ButtonGroup>
  );
}

/* The group still works; only one segment is out. A no-op onChange here
   would have made the whole group dead while demonstrating that ONE segment
   was disabled, which is the opposite of the point. */
function PartlyDisabledGroup() {
  const [value, setValue] = useState('Day');
  return (
    <ButtonGroup value={value} onChange={setValue} aria-label="Range">
      <Button value="Day">Day</Button>
      <Button value="Week" disabled>Week</Button>
      <Button value="Month">Month</Button>
    </ButtonGroup>
  );
}

const BOX = 360;

export const BUTTON_GROUP_SAMPLES = {
  /* Figma's Style axis. JOINED overlaps the segments by one border width so
     the shared edge is a single line — two adjacent 1px borders would read as
     a 2px rule between segments and a 1px one at the ends, which is what
     makes a joined row stop reading as one control. */
  separated: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — joined (Figma: Style=Default)</Caption>
        <Group />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — separated (Figma: Style=Separated)</Caption>
        <Group separated />
      </VStack>
    </VStack>
  ),

  /* Bounded, because "fill" means nothing without a container to be full of.
     `equal` is the one with no Figma counterpart: the group still HUGS, but
     every segment matches the widest, which a row of uneven labels needs. */
  fit: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: BOX }}>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">hug — each segment sizes to its label</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group options={['S', 'Medium', 'Extra large']} initial="S" />
        </div>
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">fill — the group fills, segments share it equally (Figma: Fit=Fill)</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group options={['S', 'Medium', 'Extra large']} initial="S" fit="fill" />
        </div>
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">equal — still hugs, every segment matches the widest (code only)</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group options={['S', 'Medium', 'Extra large']} initial="S" fit="equal" />
        </div>
      </VStack>
    </VStack>
  ),

  /* The shape of the UNSELECTED segments. The selected one is painted by the
     group either way, so what changes here is the other two. */
  variant: () => (
    <VStack gap="var(--Sizing-3)">
      {['outlined', 'light', 'ghost'].map(v => (
        <VStack key={v} gap="var(--Sizing-Half)">
          <Caption color={v === 'outlined' ? 'standard' : 'quiet'}>{v}</Caption>
          <Group variant={v} color="primary" />
        </VStack>
      ))}
      <Body color="quiet">
        `light` lightens the unselected segments by changing their SURFACE —
        data-surface="Surface-Brightest" — not their theme.
      </Body>
    </VStack>
  ),

  /* All nine. The palette paints the selected segment's fill AND every
     segment's label, so an unselected segment in a success group differs from
     one in an error group — which it did not until the labels moved onto the
     Buttons table. */
  color: () => (
    <VStack gap="var(--Sizing-2)">
      {['default', ...PALETTES].map(c => (
        <HStack key={c} gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
          <div style={{ width: 84 }}>
            <Caption color={c === 'default' ? 'standard' : 'quiet'}>{c}</Caption>
          </div>
          <Group color={c} />
        </HStack>
      ))}
    </VStack>
  ),

  /* Sizing comes from the BUTTON tokens, so a group matches the buttons
     around it: --Small-Button-Height / --Button-Height /
     --Large-Button-Height, with the matching text size.

     Pass it to the GROUP. It is forwarded to each segment, so a size set on a
     child is overwritten. */
  size: () => (
    <VStack gap="var(--Sizing-3)">
      {SIZES.map(v => (
        <VStack key={v} gap="var(--Sizing-Half)">
          <Caption color={v === 'medium' ? 'standard' : 'quiet'}>{v}</Caption>
          <Group size={v} />
        </VStack>
      ))}
    </VStack>
  ),

  orientation: () => (
    <HStack gap="var(--Sizing-4)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Cell label="horizontal" emphasis><Group /></Cell>
      <Cell label="vertical"><Group orientation="vertical" /></Cell>
    </HStack>
  ),

  /* A different QUESTION, not a different look: "which of these" rather than
     "which one". The value becomes an array and a selected segment can be
     clicked off, which a single-select group cannot do. */
  multiple: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — one answer, and it cannot be cleared</Caption>
        <Group />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — any number, and clicking a selected one deselects it</Caption>
        <MultiGroup />
      </VStack>
    </VStack>
  ),

  disabled: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">enabled</Caption>
        <Group />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">disabled — the whole group</Caption>
        <Group disabled />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">a single segment takes its own `disabled`</Caption>
        <PartlyDisabledGroup />
      </VStack>
    </VStack>
  ),

  'value / defaultValue': () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">each child needs a `value`; the group matches against it</Caption>
        <IconGroup />
      </VStack>
      <Body color="quiet">
        Icon-only segments each need a name saying the ACTION — "Align left",
        not "left".
      </Body>
    </VStack>
  ),
};


/* ─────────────────────────────────────────────────────────────────────────
   ToggleButtonGroup — the same geometry, one behaviour added.

   Only the axes that differ from ButtonGroup get their own sample here; the
   shared ones (size, colour, fit, orientation) are the same pictures and are
   not worth printing twice.
   ───────────────────────────────────────────────────────────────────────── */

function ToggleGroup({ options = ['Left', 'Center', 'Right'], initial = 'Left', ...props }) {
  const [value, setValue] = useState(initial);
  return (
    <ToggleButtonGroup value={value} onChange={setValue} aria-label="Align" {...props}>
      {options.map(o => <Button key={o} value={o}>{o}</Button>)}
    </ToggleButtonGroup>
  );
}

function ToggleMulti({ allowEmpty, ...props }) {
  const [value, setValue] = useState(['Left']);
  return (
    <ToggleButtonGroup multiple allowEmpty={allowEmpty} value={value} onChange={setValue}
                       aria-label="Align" {...props}>
      <Button value="Left">Left</Button>
      <Button value="Center">Center</Button>
      <Button value="Right">Right</Button>
    </ToggleButtonGroup>
  );
}

export const TOGGLE_BUTTON_GROUP_SAMPLES = {
  /* THE axis. Try turning every segment off in each: the first will not let
     you past one, the second will. */
  allowEmpty: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — a toggle group. The last one stays on.</Caption>
        <ToggleMulti allowEmpty={false} />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — clearable, with toggle styling</Caption>
        <ToggleMulti allowEmpty />
      </VStack>
      <Body color="quiet">
        The refused click fires no onChange — an unchanged array would make a
        controlled caller re-render for nothing and read as a bug in their own
        reducer.
      </Body>
    </VStack>
  ),

  multiple: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — one answer, and it cannot be cleared</Caption>
        <ToggleGroup />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — any number, never none</Caption>
        <ToggleMulti allowEmpty={false} />
      </VStack>
    </VStack>
  ),

  separated: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — joined (Figma: Style=Default)</Caption>
        <ToggleGroup />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — separated (Figma: Style=Separated)</Caption>
        <ToggleGroup separated />
      </VStack>
    </VStack>
  ),

  variant: () => (
    <VStack gap="var(--Sizing-3)">
      {['outlined', 'light', 'ghost'].map(v => (
        <VStack key={v} gap="var(--Sizing-Half)">
          <Caption color={v === 'outlined' ? 'standard' : 'quiet'}>{v}</Caption>
          <ToggleGroup variant={v} color="primary" />
        </VStack>
      ))}
    </VStack>
  ),

  color: () => (
    <VStack gap="var(--Sizing-2)">
      {['default', ...PALETTES].map(c => (
        <HStack key={c} gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
          <div style={{ width: 84 }}>
            <Caption color={c === 'default' ? 'standard' : 'quiet'}>{c}</Caption>
          </div>
          <ToggleGroup color={c} />
        </HStack>
      ))}
    </VStack>
  ),

  size: () => (
    <VStack gap="var(--Sizing-3)">
      {SIZES.map(v => (
        <VStack key={v} gap="var(--Sizing-Half)">
          <Caption color={v === 'medium' ? 'standard' : 'quiet'}>{v}</Caption>
          <ToggleGroup size={v} />
        </VStack>
      ))}
    </VStack>
  ),

  fit: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: BOX }}>
      {['hug', 'fill', 'equal'].map(f => (
        <VStack key={f} gap="var(--Sizing-Half)">
          <Caption color={f === 'hug' ? 'standard' : 'quiet'}>{f}</Caption>
          <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
            <ToggleGroup options={['S', 'Medium', 'Extra large']} initial="S" fit={f} />
          </div>
        </VStack>
      ))}
    </VStack>
  ),

  orientation: () => (
    <HStack gap="var(--Sizing-4)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Cell label="horizontal" emphasis><ToggleGroup /></Cell>
      <Cell label="vertical"><ToggleGroup orientation="vertical" /></Cell>
    </HStack>
  ),

  'value / defaultValue': () => (
    <VStack gap="var(--Sizing-Half)">
      <Caption color="quiet">each child needs a `value`; the group matches against it</Caption>
      <ToggleGroup />
    </VStack>
  ),

  onChange: () => (
    <VStack gap="var(--Sizing-2)">
      <ToggleGroup />
      <Body color="quiet">
        Called (value, event) — the system`s order. A caller signalling MUI`s older
        API, with `exclusive` or a colour in `variant`, still gets (event, value).
      </Body>
    </VStack>
  ),

  disabled: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">enabled</Caption>
        <ToggleGroup />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">disabled</Caption>
        <ToggleGroup disabled />
      </VStack>
    </VStack>
  ),
};
