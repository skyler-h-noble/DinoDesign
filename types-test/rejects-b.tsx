// Each line must be a TYPE ERROR — selection controls and the button family.
import { Checkbox, Switch, Slider, Rating, DatePicker, Fab, SpeedDial, Toolbar, PrimaryToggleButtonGroup } from '@omni-design/components';

export const rejectsB = (
  <>
    {/* @ts-expect-error — a Checkbox has one look; -outline is not a color */}
    <Checkbox variant="primary-outline" />
    {/* @ts-expect-error — the -light switch shape was removed */}
    <Switch variant="primary-light" />
    {/* @ts-expect-error — valueLabelDisplay is auto | on | off */}
    <Slider valueLabelDisplay="always" />
    {/* @ts-expect-error — Rating onChange gets the value, not an event */}
    <Rating onChange={(e: React.ChangeEvent<HTMLInputElement>) => e} />
    {/* @ts-expect-error — selectionMode is single | range */}
    <DatePicker selectionMode="multiple" />
    {/* @ts-expect-error — misspelled prop */}
    <Fab arialabel="Add" />
    {/* @ts-expect-error — SpeedDial fans up | down | left | right */}
    <SpeedDial direction="diagonal" />
    {/* @ts-expect-error — Toolbar type is floating | contextual */}
    <Toolbar type="docked" />
    {/* @ts-expect-error — a preset fixes its color */}
    <PrimaryToggleButtonGroup color="secondary" />
  </>
);
