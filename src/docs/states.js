// src/docs/states.js
//
// The States section of a component's Summary: every state at once, drawn by
// the real component (see StatesGrid). A component appears here when its
// states have been matched to Figma on the parity page — the rows mirror that
// set's State axis, so the gallery shows what the design shows.
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { Input as TextInput } from '../components/Input/Input';
import { InputDecorator } from '../components/Input/InputDecorator';
import { Select } from '../components/Select/Select';
import { Link } from '../components/Link/Link';
import { Slider } from '../components/Slider/Slider';
import { Chip } from '../components/Chip/Chip';
import { RailItem } from '../components/Rail/Rail';
import { ListItem } from '../components/List/List';
import { NumberField } from '../components/NumberField/NumberField';
import { Stepper, Step } from '../components/Stepper/Stepper';
import { Button } from '../components/Button/Button';
import { FORCED_OWN_STATE } from './StatesGrid';

/** The five pointer/keyboard states, for a component rendered by `make(disabled)`. */
const fiveStates = (make) => [
  { label: 'Default', render: () => make(false) },
  { label: 'Hover', state: 'hover', render: () => make(false) },
  { label: 'Pressed', state: 'active', render: () => make(false) },
  { label: 'Focus-Visible', state: 'focus-visible', render: () => make(false) },
  { label: 'Disabled', render: () => make(true) },
];

const own = (node) => <span className={FORCED_OWN_STATE} style={{ display: 'contents' }}>{node}</span>;

export const STATES = {
  Button: () => fiveStates((d) => <Button disabled={d}>Button</Button>),

  Input: () => fiveStates((d) => (
    <TextInput aria-label="Email address" placeholder="Email address" disabled={d} fullWidth
      startAdornment={<HomeIcon />}
      endAdornment={own(<InputDecorator aria-label="Clear"><BackspaceIcon /></InputDecorator>)} />
  )),

  Select: () => fiveStates((d) => (
    <Select aria-label="Choose" placeholder="Choose…" options={['One', 'Two']} disabled={d} fullWidth labelPosition="none" />
  )),

  Link: () => fiveStates((d) => <Link href="#states" disabled={d}>Hotlink</Link>),

  Slider: () => fiveStates((d) => <Slider aria-label="Amount" defaultValue={40} disabled={d} valueLabelDisplay="off" />),

  Chip: () => [
    ...fiveStates((d) => <Chip clickable label="Chip" disabled={d} />),
    { label: 'Selected', render: () => <Chip clickable selected label="Chip" /> },
  ],

  /* In a 64px column — the slot of an 80px rail — because an item fills its rail. */
  Rail: () => [
    ...fiveStates((d) => <div style={{ width: 64 }}><RailItem item={{ icon: <HomeIcon />, label: 'Label', disabled: d }} /></div>),
    { label: 'Selected', render: () => <div style={{ width: 64 }}><RailItem item={{ icon: <HomeIcon />, label: 'Label' }} selected /></div> },
  ],

  List: () => fiveStates((d) => (
    <ListItem clickable disabled={d} eyebrow="Eyebrow" secondary="Supporting text">Subtitle</ListItem>
  )),

  NumberField: () => [
    { label: 'Default', render: () => <NumberField aria-label="Quantity" defaultValue={1} labelPosition="none" fullWidth /> },
    { label: 'Hover', state: 'hover', render: () => <NumberField aria-label="Quantity" defaultValue={1} labelPosition="none" fullWidth /> },
    { label: 'Focus-Visible', state: 'focus-visible', render: () => <NumberField aria-label="Quantity" defaultValue={1} labelPosition="none" fullWidth /> },
    { label: 'Disabled', render: () => <NumberField aria-label="Quantity" defaultValue={1} labelPosition="none" disabled fullWidth /> },
  ],

  /* Stepper's states are its STATUSES: complete (filled), current (2px ring),
     incomplete (thin Quiet ring). */
  Stepper: () => [
    { label: 'Complete · Current · Incomplete', render: () => (
      <Stepper activeStep={1}><Step label="Done" /><Step label="Now" /><Step label="Next" /></Stepper>
    ) },
    { label: 'No-count', render: () => (
      <Stepper variant="noCount" activeStep={1}><Step label="Done" /><Step label="Now" /><Step label="Next" /></Stepper>
    ) },
  ],
};

export const hasStates = (name) => Object.prototype.hasOwnProperty.call(STATES, name);
