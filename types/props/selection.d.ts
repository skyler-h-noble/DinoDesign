// types/props/selection.d.ts — selection controls (checkbox, radio, switch,
// slider, rating, date picker) and the button family beyond Button itself
// (groups, FAB, speed dial, toolbar). Format: scripts/lib/api-model.mjs.
import type * as React from 'react';
import type { Color, Theme, Size, Surface, Sx, Native, AvatarShape, ToggleButtonGroupProps } from '../core-props';

/** The ten Buttons modes: every Color plus black-white. */
type ButtonColor = Color | 'black-white';

/** Where a control's label sits relative to it. */
type LabelPlacement = 'end' | 'start' | 'top' | 'bottom';

/** Props the checkbox / radio / switch route to their hidden <input>, as MUI's SwitchBase did. */
interface ControlInputProps extends Native<HTMLSpanElement, 'onChange' | 'onFocus' | 'onBlur' | 'defaultChecked' | 'defaultValue'> {
  /** Text beside the control; also its accessible name. */
  label?: React.ReactNode;
  labelPlacement?: LabelPlacement;
  size?: Size;
  /** Controlled state. */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Called with the event and the new checked state. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  name?: string;
  value?: string | number;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  autoFocus?: boolean;
  required?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** Extra attributes for the <input>. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Name the control when there is no visible label. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  sx?: Sx;
}

// ─── Checkbox / Radio / Switch ───────────────────────────────────────────────

/**
 * An on/off choice among independent options. For one setting that applies immediately use Switch.
 * @category Selection
 * @exports Checkbox
 * @example
 * <Checkbox label="Email me updates" checked={checked} onChange={(e, next) => setChecked(next)} />
 */
export interface CheckboxProps extends ControlInputProps {
  /** Color only — a Checkbox has one look. The old -outline / -light / -solid shapes warn and render solid. */
  variant?: ButtonColor;
  /** Shows the mixed (–) state; aria-checked="mixed". */
  indeterminate?: boolean;
  /** Error border + aria-invalid. Pair with a FormHelper message. */
  error?: boolean;
  'aria-describedby'?: string;
  /** Input slot overrides, as MUI's slotProps.input. */
  slotProps?: { input?: React.InputHTMLAttributes<HTMLInputElement> };
  /** @deprecated MUI's palette prop; only names a class. Use `variant`. */
  color?: string;
}

/**
 * One choice from a set. Usually rendered by RadioGroup from `options`; a standalone Radio joins the nearest RadioGroup. RadioInput is its old name.
 * @category Selection
 * @exports Radio RadioInput
 * @source Radio/Radio#Radio
 * @example
 * <Radio label="Express" value="express" checked={value === 'express'} onChange={() => setValue('express')} />
 */
export interface RadioProps extends ControlInputProps {
  /** Sets data-theme on the control. */
  theme?: Theme;
  /** Sets data-surface on the control. */
  surface?: Surface;
  color?: ButtonColor;
  'aria-describedby'?: string;
  /** Input slot overrides, as MUI's slotProps.input. */
  slotProps?: { input?: React.InputHTMLAttributes<HTMLInputElement> };
}

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/**
 * A labelled set of radios (a fieldset with a legend) built from `options`. Controlled (`value`) or uncontrolled (`defaultValue`).
 * @category Selection
 * @exports RadioGroup
 * @example
 * <RadioGroup label="Shipping" value={value} onChange={(e, next) => setValue(next)}
 *   options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />
 */
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color'> {
  /** The legend. */
  label?: React.ReactNode;
  /** `[{ value, label, disabled? }]`. */
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  /** Called with the event and the chosen option's value. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  color?: ButtonColor;
  size?: Size;
  orientation?: 'vertical' | 'horizontal';
  /** Passed to every radio. */
  labelPlacement?: LabelPlacement;
  disabled?: boolean;
  /** Gap: a number is 8px units, a string is a CSS length. */
  spacing?: number | string;
  /** Group name; generated when omitted. */
  name?: string;
  sx?: Sx;
}

/**
 * A setting that takes effect immediately (role="switch"). Switch and SwitchInput are the same component.
 * @category Selection
 * @exports SwitchInput Switch
 * @source Switch/Switch#Switch
 * @example
 * <Switch label="Dark mode" checked={checked} onChange={(e, next) => setChecked(next)} />
 */
export interface SwitchProps extends ControlInputProps {
  /** Color of the on state; `{color}-outline` for the outline track. `-light` warns and renders solid. */
  variant?: Color | `${Color}-outline`;
  /** Glyph in the thumb both ways; false hides the default check / close glyphs. */
  icon?: React.ReactNode;
  /** Glyph in the thumb when on. */
  iconOn?: React.ReactNode;
  /** Glyph in the thumb when off. */
  iconOff?: React.ReactNode;
  /** @deprecated MUI's palette prop; only names a class. Use `variant`. */
  color?: string;
}

// ─── Slider / Rating ─────────────────────────────────────────────────────────

export interface SliderMark { value: number; label?: React.ReactNode; }

/**
 * Pick a number (or a range: pass an array `value`). SliderInput and RangeSlider are the same component — a range is just a two-number value. Figma's Type maps to `value` + `fill`: single = a number, double = `[low, high]`, `-inverted` = `fill="inverted"`; Orientation = `orientation`. A range's thumbs are named "… minimum" / "… maximum" unless `getAriaLabel` names them.
 * @category Selection
 * @exports SliderInput Slider RangeSlider
 * @source Slider/Slider#Slider
 * @example
 * <><Slider label="Volume" value={value} onChange={(e, next) => setValue(next)} />
 * <RangeSlider label="Price" defaultValue={[20, 80]} min={0} max={100} />
 * <Slider label="Treble" defaultValue={36} orientation="vertical" fill="inverted" style={{ height: 140 }} /></>
 */
export interface SliderProps extends Native<HTMLSpanElement, 'onChange' | 'defaultValue'> {
  /** Sets data-theme on the control. */
  theme?: Theme;
  /** Sets data-surface on the control. */
  surface?: Surface;
  /** Fill color. */
  variant?: Color;
  size?: Size;
  /** A number, or [low, high] for a range. */
  value?: number | number[];
  defaultValue?: number | number[];
  /** While dragging: event, new value, index of the moved thumb. */
  onChange?: (event: Event | React.SyntheticEvent, value: number | number[], activeThumb: number) => void;
  /** On release: the final value. */
  onChangeCommitted?: (event: Event | React.SyntheticEvent, value: number | number[]) => void;
  min?: number;
  max?: number;
  /** null = snap only to the `marks` values. */
  step?: number | null;
  /** true = a tick per step; or `[{ value, label? }]` for the values worth labelling. */
  marks?: boolean | SliderMark[];
  /** auto = while hovered / dragged / focused; on = always, as Figma draws it. */
  valueLabelDisplay?: 'auto' | 'on' | 'off';
  /** top / bottom (horizontal), left / right (vertical). */
  valueLabelPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Text of the value label, or a formatter. A formatter's text is also the aria-valuetext. */
  valueLabelFormat?: string | ((value: number, index: number) => React.ReactNode);
  /** Figma's Orientation. Vertical runs bottom (min) to top (max); give it a height. */
  orientation?: 'horizontal' | 'vertical';
  /** Fill from the start to the thumb, or between a range's thumbs (standard); the other side(s) (inverted). */
  fill?: 'standard' | 'inverted' | 'normal';
  /** MUI's name for `fill`. false is retired and renders standard. */
  track?: 'standard' | 'inverted' | 'normal' | false;
  disabled?: boolean;
  /** Visible label; also the accessible name. */
  label?: React.ReactNode;
  labelPosition?: 'top' | 'bottom';
  name?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-valuetext'?: string;
  /** Per-thumb accessible name (ranges). */
  getAriaLabel?: (index: number) => string;
  getAriaValueText?: (value: number, index: number) => string;
  /** Map the linear value before display (e.g. log scale). */
  scale?: (value: number) => number;
  /** Stop thumbs crossing each other. */
  disableSwap?: boolean;
  /** Step for Shift+Arrow and PageUp/Down. */
  shiftStep?: number;
  tabIndex?: number;
  slotProps?: { input?: React.InputHTMLAttributes<HTMLInputElement> };
  sx?: Sx;
}

/**
 * Five-star rating; click the current value again to clear it.
 * @category Selection
 * @exports RatingInput Rating
 * @source Rating/Rating#Rating
 * @example
 * <Rating label="Your rating" value={value} onChange={setValue} precision={0.5} />
 */
export interface RatingProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** Sets data-theme. */
  theme?: Theme;
  /** Sets data-surface. */
  surface?: Surface;
  /** Stars, 0–5; null = no rating. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the new value (not an event); null when cleared. */
  onChange?: (value: number | null) => void;
  /** @deprecated Always five stars; other values warn. */
  max?: number;
  /** 1 = whole stars, 0.5 = halves. */
  precision?: 1 | 0.5;
  color?: Color;
  size?: Size;
  /** Display only. */
  readOnly?: boolean;
  disabled?: boolean;
  /** Announced when there is no rating. */
  emptyLabel?: string;
  label?: React.ReactNode;
  labelPosition?: 'top' | 'bottom';
  sx?: Sx;
}

// ─── Dates ───────────────────────────────────────────────────────────────────

/**
 * Inline month calendar for one date or a range (`selectionMode="range"`, value `[start, end]`). Keyboard: arrows, Home/End, PageUp/Down.
 * @category Dates
 * @exports DatePicker
 * @example
 * <DatePicker value={value} onChange={setValue} minDate={new Date(2026, 0, 1)} />
 */
export interface DatePickerProps extends Native<HTMLDivElement, 'onChange'> {
  /** A Date (single) or [start, end] (range); null for none. */
  value?: Date | null | [Date | null, Date | null];
  /** Called with the Date, or [start, end] in range mode (end null after the first click). */
  onChange?: (value: Date | [Date, Date | null]) => void;
  selectionMode?: 'single' | 'range';
  /** First month shown (uncontrolled). */
  defaultMonth?: Date;
  /** Shown month (controlled). */
  month?: Date;
  /** Called with the first day of the newly shown month. */
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Return true to disable a day. */
  isDateDisabled?: (date: Date) => boolean;
  /** Override "today" (tests, time zones). */
  today?: Date;
  /** 0 = Sunday … 6 = Saturday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  color?: Color;
  /** BCP 47 locale for month and weekday names. */
  locale?: string;
  sx?: Sx;
}

/**
 * One day of a calendar — the building block DatePicker draws; use it to build a custom calendar.
 * @category Dates
 * @exports DayCell
 * @ref HTMLButtonElement
 * @example
 * <DayCell day={14} selection="selected" onClick={() => {}} aria-label="14 March 2026" />
 */
export interface DayCellProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** The number shown. */
  day?: React.ReactNode;
  /** Range ends get a half band, range-middle a full one; today is a ring. */
  selection?: 'default' | 'today' | 'selected' | 'range-start' | 'range-middle' | 'range-end';
  color?: Color;
  disabled?: boolean;
  /** false = tabIndex -1 (roving focus). */
  focusable?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Attributes for the 36px cell wrapper (e.g. role="gridcell"); the rest go to the button. */
  cellProps?: React.HTMLAttributes<HTMLDivElement>;
  sx?: Sx;
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

/**
 * A single pressed / not-pressed button (aria-pressed), e.g. Bold in an editor. A row of exclusive options is ToggleButtonGroup.
 * @category Buttons
 * @exports ToggleButton
 * @ref HTMLButtonElement
 * @example
 * <ToggleButton value="bold" selected={checked} onChange={() => setChecked(!checked)} aria-label="Bold"><FormatBoldIcon /></ToggleButton>
 */
export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick' | 'value' | 'color'> {
  selected?: boolean;
  /** Called with the event and this button's value. */
  onChange?: (event: React.MouseEvent<HTMLButtonElement>, value: string | number | undefined) => void;
  /** Called first; preventDefault() skips onChange. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, value: string | number | undefined) => void;
  value?: string | number;
  /** MUI's palette name; only sets a class. */
  color?: 'standard' | Color;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  /** MUI compatibility; no effect (there is no ripple). */
  disableFocusRipple?: boolean;
  /** MUI compatibility; no effect (there is no ripple). */
  disableRipple?: boolean;
  tabIndex?: number;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * ToggleButtonGroup with its `color` fixed, one export per Buttons mode.
 * @category Buttons
 * @exports DefaultToggleButtonGroup PrimaryToggleButtonGroup SecondaryToggleButtonGroup TertiaryToggleButtonGroup NeutralToggleButtonGroup BlackWhiteToggleButtonGroup InfoToggleButtonGroup SuccessToggleButtonGroup WarningToggleButtonGroup ErrorToggleButtonGroup
 * @source none
 * @example
 * <PrimaryToggleButtonGroup value={value} onChange={setValue}>
 *   <Button value="day">Day</Button>
 *   <Button value="week">Week</Button>
 * </PrimaryToggleButtonGroup>
 */
export interface ToggleButtonGroupPresetProps extends Omit<ToggleButtonGroupProps, 'color'> {}

/**
 * A row of related actions, each Button with its own onClick; separated by default. For a selected-one-of-many control use ToggleButtonGroup.
 * @category Buttons
 * @exports ButtonGroup
 * @example
 * <ButtonGroup aria-label="Text alignment">
 *   <Button onClick={() => {}}>Left</Button>
 *   <Button onClick={() => {}}>Center</Button>
 * </ButtonGroup>
 */
export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color'> {
  /** Segment shape; light lifts unselected segments to a brighter surface. */
  variant?: 'outlined' | 'light' | 'ghost';
  color?: ButtonColor;
  size?: Size;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** false (joined) is ToggleButtonGroup's look; here it warns and stays separated. */
  separated?: boolean;
  /** Explicit gap (overrides the platform spacer). */
  spacing?: number | string;
  /** hug = each button its own width; fill = share the container; equal = all as wide as the widest. */
  fit?: 'hug' | 'fill' | 'equal';
  /** Alias of fit="fill". */
  fullWidth?: boolean;
  /** Alias of fit="equal". */
  equalWidth?: boolean;
  /** @deprecated Selection moved to ToggleButtonGroup. */
  multiple?: boolean;
  /** @deprecated Selection moved to ToggleButtonGroup. */
  allowEmpty?: boolean;
  /** Internal: set by ToggleButtonGroup to silence the selection deprecation. */
  __selectionOwner?: boolean;
  /** @deprecated Selection moved to ToggleButtonGroup. */
  value?: unknown;
  /** @deprecated Selection moved to ToggleButtonGroup. */
  defaultValue?: unknown;
  /** @deprecated Selection moved to ToggleButtonGroup. Called with (next, event). */
  onChange?: (value: string | number | Array<string | number> | null, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Names the group (adds role="group"). */
  'aria-label'?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Floating action button: the one primary action on a screen. `default` resolves to the Tertiary palette. Needs a name (`label` or `ariaLabel`).
 * @category Buttons
 * @exports Fab
 * @ref HTMLButtonElement
 * @example
 * <Fab ariaLabel="Compose message"><EditIcon /></Fab>
 */
export interface FabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** The icon (default: a plus). Same as `children`. */
  icon?: React.ReactNode;
  /** Text shown when `extended`; also the accessible name. */
  label?: React.ReactNode;
  /** @deprecated Only `solid` exists; others warn. */
  variant?: 'solid';
  color?: Color;
  size?: Size;
  /** Pill with icon + `label`. */
  extended?: boolean;
  /** Gentle pulse (off under reduced motion). */
  animate?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name; falls back to `label`. */
  ariaLabel?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Expressive icon button in a shape that can morph to another when selected / hovered / pressed. Needs `label` or aria-label.
 * @category Buttons
 * @exports ShapeButton
 * @ref HTMLButtonElement
 * @example
 * <ShapeButton shape="cookie-6" morphTo="circle" selected={checked} onClick={() => setChecked(!checked)} aria-label="Add to favorites"><FavoriteIcon /></ShapeButton>
 */
export interface ShapeButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Resting shape (one of AVATAR_SHAPES). */
  shape?: AvatarShape;
  /** Shape to morph into (one of MORPH_TARGET_SHAPES). */
  morphTo?: 'circle' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'flower' | 'puffy'
    | 'sunny' | 'very-sunny' | 'clover-4' | 'clover-8' | 'soft-burst' | 'soft-boom' | 'heart';
  /** What triggers the morph. */
  morphOn?: 'selected' | 'hover' | 'press';
  selected?: boolean;
  /** Text below the shape; also the name. */
  label?: React.ReactNode;
  /** Image masked to the shape instead of a fill. */
  imageSrc?: string;
  imageAlt?: string;
  color?: Color;
  size?: Size;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  sx?: Sx;
  /** The icon. */
  children?: React.ReactNode;
}

export interface SpeedDialAction {
  /** Label: tooltip and accessible name. */
  name?: string;
  icon?: React.ReactNode;
  /** Called with the action's index. */
  onClick?: (index: number) => void;
  key?: React.Key;
  className?: string;
}

/**
 * A FAB that fans out a few related actions. Controlled with `open` + onOpen/onClose, or uncontrolled.
 * @category Buttons
 * @exports SpeedDial
 * @example
 * <SpeedDial ariaLabel="Create"
 *   actions={[{ name: 'Note', icon: <NoteAddIcon />, onClick: () => {} }, { name: 'Photo', icon: <PhotoCameraIcon />, onClick: () => {} }]} />
 */
export interface SpeedDialProps extends Native<HTMLDivElement> {
  /** `[{ name, icon, onClick(index), key? }]`. */
  actions?: SpeedDialAction[];
  /** @deprecated Only `solid` exists; others warn. */
  variant?: 'solid';
  color?: Color;
  /** Which way the actions fan out. */
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: Size;
  /** Stagger between actions, in ms. */
  speed?: number;
  /** Open on hover (pointer devices only). */
  openOnHover?: boolean;
  /** Tooltips with each action's name. */
  showTooltips?: boolean;
  /** Render labels in place instead of on document.body (scaled previews). */
  disablePortal?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  /** Main button icon (default: a plus that rotates). */
  icon?: React.ReactNode;
  /** Accessible name of the main button. */
  ariaLabel?: string;
  disabled?: boolean;
  sx?: Sx;
}

export interface ToolbarItem {
  icon: React.ReactNode;
  /** Accessible name of the item. */
  label: string;
  key?: React.Key;
}

/**
 * A bar of icon actions, one selectable at a time (selection is the item INDEX). Unset `color` wears the designer's Nav-Bar theme.
 * @category Buttons
 * @exports Toolbar
 * @example
 * <Toolbar value={value} onChange={setValue}
 *   items={[{ icon: <FormatBoldIcon />, label: 'Bold' }, { icon: <FormatItalicIcon />, label: 'Italic' }]} />
 */
export interface ToolbarProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** `[{ icon, label, key? }]` — label is the item's accessible name. */
  items?: ToolbarItem[];
  /** Selected item index; null for none. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the new index, or null when the selected item is clicked again. */
  onChange?: (index: number | null) => void;
  /** floating = shadowed pill; contextual = flat, inline. */
  type?: 'floating' | 'contextual';
  orientation?: 'horizontal' | 'vertical';
  /** Theme; leave unset for Nav-Bar. Legacy primary-light / white / black still resolve. */
  color?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'primary-light' | 'white' | 'black';
  /** Lightness level (page levels only). */
  surface?: 'Surface-Dimmest' | 'Surface-Dim' | 'Surface' | 'Surface-Bright' | 'Surface-Brightest';
  /** A Fab beside a floating toolbar. */
  fab?: { icon?: React.ReactNode; label?: string; onClick?: React.MouseEventHandler<HTMLButtonElement>; color?: Color; size?: Size };
  sx?: Sx;
}
