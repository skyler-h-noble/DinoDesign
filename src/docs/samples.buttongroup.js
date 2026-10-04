// @ts-nocheck
/**
 * ButtonGroup — a row of actions, and every axis it has.
 *
 * NO SELECTION. These samples used `value` and `onChange`, which post-split
 * both warn and demonstrate the deprecated path — a sample teaching the thing
 * the component is telling you not to do. A button group is Save / Cancel /
 * Delete: three things you can do, none of them "on". Each child is an
 * ordinary Button carrying its own variant, which is why they all look the
 * same here rather than one filled and the rest outlined.
 *
 * ToggleButtonGroup's samples are at the bottom of this file; they are the
 * ones with a value.
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

const BOX = 360;

/* All the same kind. A group of actions is a set of peers — one solid button
   beside two outlines reads as "this one is selected", which is the exact
   misreading the split was meant to end. The variant lives on the CHILDREN,
   because the group does not restyle what is inside it. */
function Group({ labels = ['Save', 'Cancel', 'Delete'], variant = 'default', ...props }) {
  return (
    <ButtonGroup aria-label="Actions" {...props}>
      {labels.map(l => (
        <Button key={l} variant={variant} onClick={() => {}}>{l}</Button>
      ))}
    </ButtonGroup>
  );
}

function IconGroup(props) {
  return (
    <ButtonGroup aria-label="Alignment" {...props}>
      <Button iconOnly aria-label="Align left" onClick={() => {}}>
        <Icon><FormatAlignLeftIcon /></Icon>
      </Button>
      <Button iconOnly aria-label="Align center" onClick={() => {}}>
        <Icon><FormatAlignCenterIcon /></Icon>
      </Button>
      <Button iconOnly aria-label="Align right" onClick={() => {}}>
        <Icon><FormatAlignRightIcon /></Icon>
      </Button>
    </ButtonGroup>
  );
}

export const BUTTON_GROUP_SAMPLES = {
  /* Figma's ButtonGroup is gap 4 on every variant and has no Style axis, so
     separated is the default and the only shape on that page. Joined is
     ToggleButtonGroup's, because a toggle group is one control. */
  separated: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">true — the default, and what Figma draws</Caption>
        <Group />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">false — joins them, and warns</Caption>
        <Group separated={false} />
      </VStack>
      <Body color="quiet">
        A joined row of actions looks like a control with nothing selected. If
        the segments are a choice rather than three things to do, that is
        ToggleButtonGroup.
      </Body>
    </VStack>
  ),

  fit: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: BOX }}>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">hug — each button sizes to its label</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group labels={['S', 'Medium', 'Extra large']} />
        </div>
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">fill — the group fills, buttons share it equally</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group labels={['S', 'Medium', 'Extra large']} fit="fill" />
        </div>
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">equal — hugs, but every button matches the widest (code only)</Caption>
        <div style={{ width: BOX, border: '1px dashed var(--Border-Variant)', padding: 4 }}>
          <Group labels={['S', 'Medium', 'Extra large']} fit="equal" />
        </div>
      </VStack>
    </VStack>
  ),

  orientation: () => (
    <HStack gap="var(--Sizing-4)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Cell label="horizontal" emphasis><Group /></Cell>
      <Cell label="vertical"><Group orientation="vertical" /></Cell>
    </HStack>
  ),

  /* Forwarded to each child, so it is set on the GROUP. A size on a child is
     overwritten. */
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

  /* The buttons carry their own variant, all the same within a group — the
     group is not a control, so nothing in it is picked out. */
  variant: () => (
    <VStack gap="var(--Sizing-3)">
      {['default', 'primary', 'secondary'].map(v => (
        <VStack key={v} gap="var(--Sizing-Half)">
          <Caption color={v === 'default' ? 'standard' : 'quiet'}>
            {`<Button variant="${v}">`}
          </Caption>
          <Group variant={v} />
        </VStack>
      ))}
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">outline, for a row of secondary actions</Caption>
        <Group variant="default-outline" />
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
        <Caption color="quiet">a single button takes its own `disabled`</Caption>
        <ButtonGroup aria-label="Actions">
          <Button onClick={() => {}}>Save</Button>
          <Button disabled onClick={() => {}}>Cancel</Button>
          <Button onClick={() => {}}>Delete</Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  ),

  'aria-label': () => (
    <VStack gap="var(--Sizing-2)">
      <IconGroup />
      <Body color="quiet">
        The group needs a name, and so does each icon-only button — naming the
        ACTION, not the glyph: "Align left", not "left".
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

/* One segment disabled, the selection live on the others. Stateful, because a
   sample of a control that does not move teaches that the control is broken. */
function DisabledChoice() {
  const [v, setV] = React.useState('left');
  return (
    <ToggleButtonGroup value={v} onChange={setV} aria-label="Alignment">
      <Button value="left">Left</Button>
      <Button value="center">Center</Button>
      <Button value="right" disabled>Right</Button>
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
        <Caption color="quiet">disabled — the whole group</Caption>
        <ToggleGroup disabled />
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        {/* The case the group-level flag cannot express: one choice is off the
            table and the rest still move. A disabled segment must never be the
            selected one — that strands the group on an answer it cannot leave. */}
        <Caption color="quiet">one choice unavailable</Caption>
        <DisabledChoice />
      </VStack>
    </VStack>
  ),
};
