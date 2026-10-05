// @ts-nocheck
/**
 * Form components — every axis, every value.
 *
 * The palette lists here are VERIFIED against each component's own COLORS
 * constant rather than assumed, because they genuinely differ: Checkbox and
 * Radio take ten values (the nine plus black-white), SwitchInput nine (no
 * black-white — its ON state reads from the Icons collection, which has no
 * black-white row), and Input eight, each with an `-outline` suffix because
 * an input has only ever had the one shape.
 */
import React from 'react';
import { Checkbox } from '../components/Checkbox';
import { Radio, RadioGroup } from '../components/Radio';
import { SwitchInput } from '../components/Switch';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Input as TextInput } from '../components/Input';
import { TextField } from '../components/TextField';
import { SearchField } from '../components/SearchField';
import { Select } from '../components/Select';
import { Autocomplete } from '../components/Autocomplete';
import { DropZone } from '../components/DropZone';
import { Avatar } from '../components/Avatar';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body } from '../components/Typography';
import { PALETTES, SIZES, Axis, AxisStack, Toggle, Cell } from './samples';
import { SELECT_OPTIONS } from './examples.lead';

const W = 220;
const box = (children, width = W) => <div style={{ width }}>{children}</div>;

/* Checkbox and Radio reach black-white; SwitchInput does not. */
const TEN = ['default', ...PALETTES, 'black-white'];
const NINE = ['default', ...PALETTES];

export const FORM_SAMPLES = {
  Checkbox: {
    variant: () => (
      <Axis values={TEN} defaultValue="primary"
            render={(v) => <Checkbox variant={v} defaultChecked label={v} />} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Checkbox size={v} defaultChecked label={v} />} />
    ),
    'checked / defaultChecked': () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="unchecked" emphasis><Checkbox label="Unchecked" /></Cell>
        <Cell label="checked"><Checkbox defaultChecked label="Checked" /></Cell>
      </HStack>
    ),
    /* A THIRD state, not a half-checked one: "some of the children are on".
       It is set by the parent, never reached by clicking, and clicking it
       resolves to checked. */
    indeterminate: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="false" emphasis><Checkbox defaultChecked label="All" /></Cell>
        <Cell label="indeterminate"><Checkbox indeterminate label="Some" /></Cell>
      </HStack>
    ),
    disabled: () => (
      <Toggle render={(on) => <Checkbox defaultChecked disabled={on} label="Email me" />}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Radio: {
    color: () => (
      <Axis values={TEN} defaultValue="primary"
            render={(v) => <Radio color={v} checked label={v} name={'c-' + v} />} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Radio size={v} checked label={v} name={'s-' + v} />} />
    ),
    /* FOUR placements. `start` and `end` are the common pair; `top` and
       `bottom` stack the label, which is what a row of radios under icons
       needs. */
    labelPlacement: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {['end', 'start', 'top', 'bottom'].map(pl => (
          <Cell key={pl} label={pl} emphasis={pl === 'end'}>
            <Radio checked labelPlacement={pl} label="Option" name={'p-' + pl} />
          </Cell>
        ))}
      </HStack>
    ),
    /* A radio is only meaningful in a GROUP — one of several, exactly one on.
       A lone radio cannot be turned off, which is the difference from a
       checkbox. */
    checked: () => (
      <RadioGroup defaultValue="b" name="demo">
        <Radio value="a" label="Light" />
        <Radio value="b" label="Dark" />
        <Radio value="c" label="System" />
      </RadioGroup>
    ),
    disabled: () => (
      <Toggle render={(on) => <Radio checked disabled={on} label="Dark" name={'d-' + on} />}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  SwitchInput: {
    /* NINE, not ten. The ON state takes its color from the Icons collection
       — --Icons-{Color} for the track, --Icons-On-{Color} for the knob — and
       that collection has no black-white row, so there is nothing for a
       black-white switch to resolve to. */
    /* No `label` on the axis samples: Axis already captions each cell with the
       value, so passing it again printed the word twice side by side. The
       label belongs on the samples that are ABOUT labelling. */
    variant: () => (
      <Axis values={NINE} defaultValue="default"
            render={(v) => <SwitchInput variant={v} defaultChecked />} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <SwitchInput size={v} defaultChecked />} />
    ),
    'checked / defaultChecked': () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="off" emphasis><SwitchInput label="Notifications" /></Cell>
        <Cell label="on"><SwitchInput defaultChecked label="Notifications" /></Cell>
      </HStack>
    ),
    /* The glyph takes its color from the SAME place the track does — the
       Icons collection — so an icon on a `secondary` switch is secondary
       without anything being passed for it. Shown across the palette rather
       than once in the default, because "does it follow the variant" is the
       question an icon on a themed control raises.
       On and off are separate slots because the design draws a different glyph
       either side of the toggle; `icon` alone is the shorthand for both. */
    icon: () => (
      <VStack gap="var(--Sizing-2)">
        <Axis values={['default', 'primary', 'secondary', 'tertiary']}
              defaultValue="default"
              render={(v) => (
                <SwitchInput variant={v} defaultChecked
                             iconOn={<CheckIcon fontSize="inherit" />}
                             iconOff={<CloseIcon fontSize="inherit" />} />
              )} />
        <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
          <Cell label="off"><SwitchInput label="Sync"
            iconOn={<CheckIcon fontSize="inherit" />}
            iconOff={<CloseIcon fontSize="inherit" />} /></Cell>
          <Cell label="on" emphasis><SwitchInput defaultChecked label="Sync"
            iconOn={<CheckIcon fontSize="inherit" />}
            iconOff={<CloseIcon fontSize="inherit" />} /></Cell>
          <Cell label="same glyph both ways"><SwitchInput defaultChecked label="Sync"
            icon={<CheckIcon fontSize="inherit" />} /></Cell>
        </HStack>
      </VStack>
    ),

    /* Two, not four: a switch's label never sits above or below it, because
       the control reads as the end of the sentence it labels. */
    labelPlacement: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="end" emphasis><SwitchInput defaultChecked label="Dark mode" /></Cell>
        <Cell label="start"><SwitchInput defaultChecked labelPlacement="start" label="Dark mode" /></Cell>
      </HStack>
    ),
    disabled: () => (
      <Toggle render={(on) => <SwitchInput defaultChecked disabled={on} label="Dark mode" />}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Input: {
    /* Eight palettes, each with an `-outline` suffix, plus a bare `outline`
       that resolves to primary.

       There is no solid or ghost input. The `light` variant was removed
       because it was byte-identical to its `-outline` twin apart from the
       background — for a lighter field, set data-surface="Surface-Brightest"
       on an ancestor and keep the outline variant. */
    variant: () => (
      <AxisStack
        values={PALETTES.map(c => c + '-outline')}
        defaultValue="primary-outline"
        render={(v) => box(<TextInput variant={v} label={v} placeholder="Value" />)}
      />
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => box(<TextInput size={v} label={v} placeholder="Value" />)} />
    ),
    /* `floating` starts the label inside the field and lifts it on focus or
       value. `standard` keeps it above, which is the one that survives a
       narrow column and a long label. */
    labelPosition: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="standard" emphasis width={W}>
          {box(<TextInput label="Project name" placeholder="Untitled" />)}
        </Cell>
        <Cell label="floating" width={W}>
          {box(<TextInput labelPosition="floating" label="Project name" />)}
        </Cell>
      </HStack>
    ),
    validation: () => (
      <AxisStack values={['none', 'error']} defaultValue="none"
                 render={(v) => box(<TextInput validation={v} label="Email"
                   defaultValue={v === 'error' ? 'not-an-email' : 'jane@example.com'}
                   validationMessage={v === 'error' ? 'Enter a valid email address.' : undefined} />)} />
    ),
    disabled: () => (
      <Toggle width={W} offLabel="enabled" onLabel="disabled"
              render={(on) => box(<TextInput disabled={on} label="Project name" defaultValue="Untitled" />)} />
    ),
  },

  TextField: {
    /* `error` is the boolean; `errorMessage` is what it says. The two go
       together — a field that turns red without saying why has reported a
       problem and withheld the only useful part. */
    error: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="false" emphasis width={W}>
          {box(<TextField label="Email" value="jane@example.com" />)}
        </Cell>
        <Cell label="true" width={W}>
          {box(<TextField label="Email" value="not-an-email" error
                          errorMessage="Enter a valid email address." />)}
        </Cell>
      </HStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => box(<TextField size={v} label={v} placeholder="Value" />)} />
    ),
  },

  SearchField: {
    color: () => (
      <AxisStack values={NINE} defaultValue="default"
                 render={(v) => box(<SearchField color={v} defaultValue="dinosaur" />)} />
    ),
    /* The clear button only appears once there is something to clear, so the
       sample needs a value for the difference to show at all. */
    showClearButton: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="true" emphasis width={W}>
          {box(<SearchField defaultValue="dinosaur" />)}
        </Cell>
        <Cell label="false" width={W}>
          {box(<SearchField defaultValue="dinosaur" showClearButton={false} />)}
        </Cell>
      </HStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => box(<SearchField size={v} placeholder={'Search — ' + v} />)} />
    ),
  },

  Select: {
    labelPosition: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="top" emphasis width={W}>
          {box(<Select label="Appearance" options={SELECT_OPTIONS} defaultValue="system" />)}
        </Cell>
        <Cell label="floating" width={W}>
          {box(<Select labelPosition="floating" label="Appearance"
                       options={SELECT_OPTIONS} defaultValue="system" />)}
        </Cell>
      </HStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => box(<Select size={v} label={v} options={SELECT_OPTIONS}
                                            defaultValue="system" />)} />
    ),
    /* Three modes, and they change what the control IS rather than how it
       looks: one value, several values, or a filter over the list. */
    mode: () => (
      <AxisStack values={['standard', 'multiselect', 'searchable']} defaultValue="standard"
                 render={(v) => box(<Select mode={v} label={v} options={SELECT_OPTIONS}
                   defaultValue={v === 'multiselect' ? ['system'] : 'system'} />)} />
    ),
  },

  Autocomplete: {
    labelPosition: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Cell label="top" emphasis width={W}>
          {box(<Autocomplete label="Theme" options={['Light', 'Dark', 'System']} />)}
        </Cell>
        <Cell label="floating" width={W}>
          {box(<Autocomplete labelPosition="floating" label="Theme"
                             options={['Light', 'Dark', 'System']} />)}
        </Cell>
      </HStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => box(<Autocomplete size={v} label={v}
                                                  options={['Light', 'Dark', 'System']} />)} />
    ),
  },

  DropZone: {
    /* The label changes with it, because "drop a file" and "drop files" are
       different promises and the component should not make the wrong one. */
    multiple: () => (
      <VStack gap="var(--Sizing-2)" style={{ width: '100%', maxWidth: 360 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">false — one file</Caption>
          <DropZone label="Drop a file here" sublabel="PNG or SVG" />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">true — several</Caption>
          <DropZone multiple label="Drop files here" sublabel="PNG or SVG" />
        </VStack>
      </VStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => <DropZone size={v} label={'Drop a file — ' + v} />} />
    ),
    disabled: () => (
      <VStack gap="var(--Sizing-2)" style={{ width: '100%', maxWidth: 360 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">enabled</Caption>
          <DropZone label="Drop a file here" />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">disabled</Caption>
          <DropZone disabled label="Drop a file here" />
        </VStack>
      </VStack>
    ),
  },

  /* Verified against Avatar's own COLOR_MAP: FIVE values, not nine. An
     avatar's color is a neutral-to-brand ramp for an initials fallback, so
     the status palettes (info / success / warning / error) have no meaning
     and are not there. */
  Avatar: {
    color: () => (
      <Axis values={['default', 'primary', 'secondary', 'tertiary', 'neutral']}
            defaultValue="default"
            render={(v) => <Avatar color={v} initials="JD" />} />
    ),
  },
};
