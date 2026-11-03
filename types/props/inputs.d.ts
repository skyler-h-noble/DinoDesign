// types/props/inputs.d.ts — text fields, form scaffolding, pickers and swatches.
// Format: see scripts/lib/api-model.mjs. Each interface is checked against the
// component's destructuring by scripts/fix-dts.mjs, so a prop added to a
// component without a line here fails the build.
import type * as React from 'react';
import type { Color, Size, Sx, Native, TextFieldProps, ButtonProps } from '../core-props';

/** Validation state of a field: the edge color, the icon and the message under it. */
export type Validation = 'error' | 'warning' | 'success' | 'info';

/** FormLabel's Type axis: plain, "* Required" marker, or "Optional". */
export type FormLabelType = 'default' | 'required' | 'optional';

/** The "more info" affordance beside a label. `label` names the FIELD for screen readers ("More about shipping"), not the glyph. */
export interface MoreInfo {
  label: string;
  /** Visible text; omitted = icon only. */
  text?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// ─── Text inputs ─────────────────────────────────────────────────────────────

/**
 * The full-featured text field: label (top / left / floating), helper text, validation, adornments, prefix/suffix, multiline.
 * @category Inputs
 * @exports TextInput
 * @source Input/Input#InputStatic
 * @example
 * <TextInput label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)}
 *   helperText="We never share it." validation="error" validationMessage="Enter a valid email." />
 */
export interface TextInputProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue' | 'prefix' | 'onFocus' | 'onBlur'> {
  /** @deprecated Removed — a field has one edge. Use `validation` for colored edges. */
  variant?: 'default';
  size?: Size;
  label?: React.ReactNode;
  /** standard = above the field; floating = inside, rises on focus; left = beside it. */
  labelPosition?: 'standard' | 'floating' | 'left';
  /** Required / optional marker on the label. */
  labelType?: 'default' | 'required' | 'optional';
  placeholder?: string;
  /** Quiet hint under the field. */
  helperText?: React.ReactNode;
  /** Colors the edge and shows `validationMessage` with an icon. */
  validation?: 'error' | 'warning' | 'success' | 'info';
  validationMessage?: React.ReactNode;
  disabled?: boolean;
  /** Generated when omitted, so the label always points at the field. */
  id?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  name?: string;
  /** HTML input type. */
  type?: React.HTMLInputTypeAttribute;
  /** Render a <textarea>. */
  multiline?: boolean;
  rows?: number;
  /** With a start/end adornment, the textarea grows up to this many rows (default 8). */
  maxRows?: number;
  /** Textarea resize grip. Defaults to vertical, or none (auto-grow) with adornments. */
  resize?: 'none' | 'vertical' | 'both' | 'horizontal' | 'block' | 'inline';
  /** Icon or button inside the field, before the text. */
  startAdornment?: React.ReactNode;
  /** Icon or button inside the field, after the text (e.g. an InputDecorator). */
  endAdornment?: React.ReactNode;
  /** Text set tight before the value: "$". */
  prefix?: React.ReactNode;
  /** Text set tight after the value: "%". */
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  /** Attributes for the inner <input> / <textarea>. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  sx?: Sx;
}

/**
 * A square ghost button for a field's end adornment (show password, clear, copy). Icon-only children need aria-label.
 * @category Inputs
 * @exports InputDecorator
 * @ref HTMLButtonElement
 * @example
 * <TextInput label="Password" type="password"
 *   endAdornment={<InputDecorator aria-label="Show password"><VisibilityIcon /></InputDecorator>} />
 */
export interface InputDecoratorProps extends ButtonProps {}

/**
 * TextField preset with a type, label and placeholder already set. Every TextField prop works.
 * @category Inputs
 * @exports EmailTextField PasswordTextField SearchTextField NumberTextField PhoneTextField URLTextField
 * @example
 * <><EmailTextField value={text} onChange={(e) => setText(e.target.value)} /><PasswordTextField /></>
 */
export interface TextFieldPresetProps extends TextFieldProps {}

/**
 * Multi-line text: TextInput with `multiline`. Takes every TextInput prop, plus TextField's error / errorMessage.
 * @category Inputs
 * @exports TextArea
 * @example
 * <TextArea label="Message" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
 */
export interface TextAreaProps extends TextInputProps {
  /** Same as validation="error". */
  error?: boolean;
  /** Message for `error`. */
  errorMessage?: string;
}

/** One field in a TextFieldGroup: TextField props plus a key. */
export interface TextFieldGroupField extends TextFieldProps {
  id: string | number;
}

/**
 * A column of TextFields rendered from data.
 * @category Inputs
 * @exports TextFieldGroup
 * @example
 * <TextFieldGroup fields={[{ id: 'first', label: 'First name' }, { id: 'last', label: 'Last name' }]} />
 */
export interface TextFieldGroupProps extends Native<HTMLDivElement> {
  /** TextField props, each with an `id`. */
  fields?: TextFieldGroupField[];
  /** Gap as a --Spacing-N step. */
  spacing?: number;
  sx?: Sx;
}

/**
 * A labelled textarea: FormLabel + TextArea, with the requirement announced on the field. Other props go to the TextArea.
 * @category Inputs
 * @exports TextAreaField
 * @example
 * <TextAreaField label="Notes" type="optional" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
 */
export interface TextAreaFieldProps extends Omit<TextAreaProps, 'labelPosition' | 'type'> {
  /** none = no visible label (a string label becomes aria-label). */
  labelPosition?: 'top' | 'left' | 'floating' | 'none';
  /** Label marker: required / optional. */
  type?: 'default' | 'required' | 'optional';
  /** `{ label, text?, href?, onClick? }` — label names the field for screen readers. */
  moreInfo?: MoreInfo;
}

/**
 * A search box with a clear button. onChange gets the string, not the event; Enter calls onSubmit.
 * @category Inputs
 * @exports SearchField
 * @example
 * <SearchField value={text} onChange={(v) => setText(v)} onSubmit={(v) => console.log(v)} ariaLabel="Search products" />
 */
export interface SearchFieldProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue' | 'onFocus' | 'onBlur' | 'onSubmit'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** After the clear button empties the field. */
  onClear?: () => void;
  /** On Enter. */
  onSubmit?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: Size;
  /** Edge palette while active. */
  color?: Color;
  showClearButton?: boolean;
  disabled?: boolean;
  /** Accessible name of the input. */
  ariaLabel?: string;
  sx?: Sx;
}

/**
 * Numeric stepper field with − / + buttons and arrow-key stepping, clamped to min/max. onChange gets the number.
 * @category Inputs
 * @exports NumberField
 * @example
 * <NumberField label="Quantity" min={1} max={10} value={value} onChange={(n) => setValue(n)} />
 */
export interface NumberFieldProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue' | 'color' | 'style'> {
  value?: number;
  defaultValue?: number;
  /** Called with the clamped number. */
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** outlined = buttons beside the field; spinner = stacked arrows. */
  variant?: 'outlined' | 'spinner';
  /** @deprecated Has no effect; kept so old call sites compile. */
  style?: string;
  /** @deprecated Has no effect; kept so old call sites compile. */
  color?: string;
  size?: Size;
  label?: React.ReactNode;
  labelPosition?: 'top' | 'left' | 'floating' | 'none';
  placeholder?: string;
  helperText?: React.ReactNode;
  /** Label marker: required / optional. */
  type?: 'default' | 'required' | 'optional';
  /** `{ label, text?, href?, onClick? }` — label names the field for screen readers. */
  moreInfo?: MoreInfo;
  validation?: 'error' | 'warning' | 'success' | 'info';
  validationMessage?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: Sx;
}

/**
 * The small square button beside a field (NumberField's steppers). Give icon children an aria-label.
 * @category Inputs
 * @exports FieldButton
 * @ref HTMLButtonElement
 * @example
 * <FieldButton aria-label="Increase"><AddIcon /></FieldButton>
 */
export interface FieldButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** ghost = surface fill; outline = the palette's button fill and edge. */
  variant?: 'ghost' | 'outline';
  color?: Color | 'black-white';
  size?: Size;
  sx?: Sx;
}

// ─── Form scaffolding ────────────────────────────────────────────────────────

/**
 * A field label (the Label type style) with required / optional marker and a more-info link. For a group of controls use as="legend" (or FieldGroup).
 * @category Inputs
 * @exports FormLabel
 * @example
 * <FormLabel htmlFor="email" type="required">Email</FormLabel>
 */
export interface FormLabelProps extends Native<HTMLDivElement> {
  /** id of the control it names. Required with as="label". */
  htmlFor?: string;
  /** id for the label itself, for controls named via aria-labelledby. */
  id?: string;
  type?: 'default' | 'required' | 'optional';
  /** label for one control; legend for a fieldset. */
  as?: 'label' | 'legend';
  /** `{ label, text?, href?, onClick? }` — label names the field for screen readers. */
  moreInfo?: MoreInfo;
  disabled?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A validation message chip (icon + text) on its state's theme.
 * @category Inputs
 * @exports InputMessage
 * @example
 * <InputMessage type="error">Enter a valid email.</InputMessage>
 */
export interface InputMessageProps extends Native<HTMLDivElement> {
  type?: 'error' | 'warning' | 'success' | 'info';
  withIcon?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The line under a field: helper text and/or a validation message. Pair with useFormHelperIds for aria-describedby.
 * @category Inputs
 * @exports FormHelper
 * @example
 * <FormHelper helperText="8+ characters." validation="error" validationMessage="Too short." />
 */
export interface FormHelperProps extends Native<HTMLDivElement> {
  helperText?: React.ReactNode;
  showHelper?: boolean;
  validation?: 'none' | 'error' | 'warning' | 'success' | 'info';
  validationMessage?: React.ReactNode;
  withIcon?: boolean;
  /** id for the helper text (aria-describedby target). */
  helperId?: string;
  /** id for the validation message. */
  messageId?: string;
  sx?: Sx;
}

/**
 * A fieldset of related controls (radios, checkboxes) with a legend, helper and validation for the set.
 * @category Inputs
 * @exports FieldGroup
 * @example
 * <FieldGroup label="Delivery" type="required">
 *   <Radio name="delivery" value="std" label="Standard" />
 *   <Radio name="delivery" value="exp" label="Express" />
 * </FieldGroup>
 */
export interface FieldGroupProps extends Native<HTMLFieldSetElement> {
  /** The legend. */
  label?: React.ReactNode;
  type?: 'default' | 'required' | 'optional';
  /** `{ label, text?, href?, onClick? }` — label names the field for screen readers. */
  moreInfo?: MoreInfo;
  helperText?: React.ReactNode;
  showHelper?: boolean;
  validation?: 'none' | 'error' | 'warning' | 'success' | 'info';
  validationMessage?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Pickers ─────────────────────────────────────────────────────────────────

/** A Select option: a string, or { value, label } with an optional icon, swatch color or disabled flag. */
export type SelectOption = string | {
  value: string | number;
  label: React.ReactNode;
  /** Small picture before the label (also shown in the closed field). */
  icon?: React.ReactNode;
  /** CSS color for mode="color" swatches. */
  color?: string;
  disabled?: boolean;
};
/** A labelled group of options. */
export interface SelectOptionGroup { label: React.ReactNode; options: SelectOption[]; }

/**
 * A dropdown picker with a portalled list (escapes clipping). onChange gets the value, not an event. mode="color" shows swatches.
 * @category Inputs
 * @exports Select
 * @example
 * <Select label="Size" value={value} onChange={setValue}
 *   options={[{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, 'Large']} />
 */
export interface SelectProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** Strings, `{ value, label, icon?, color?, disabled? }`, or groups `{ label, options }`. */
  options?: Array<SelectOption | SelectOptionGroup>;
  value?: string | number;
  defaultValue?: string | number;
  /** Called with the chosen option's value. */
  onChange?: (value: string | number) => void;
  label?: React.ReactNode;
  labelPosition?: 'top' | 'left' | 'floating' | 'none';
  size?: Size;
  /** @deprecated 'light' was removed and never did anything. */
  variant?: 'outline' | 'light';
  /** Palette of the selected / hovered row in the list. */
  color?: Color;
  /** Selected-row style. 'light' was removed. */
  selectionStyle?: 'default' | 'solid' | 'light';
  /** standard = text options; color = swatch options (option.color). */
  mode?: 'standard' | 'color';
  placeholder?: string;
  /** Divider between options. */
  showDividers?: boolean;
  /** mode="color": show the label beside each swatch. */
  showColorLabels?: boolean;
  /** Icon or avatar at the start of the field. */
  startDecoration?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Trigger min width in px. */
  minWidth?: number;
  sx?: Sx;
}

/** An Autocomplete option: a string or an object with a `label`. */
export type AutocompleteOption = string | { label: string; [key: string]: unknown };

/**
 * A text field that filters a list of options as you type. onChange gets the option (or null); freeSolo accepts any text.
 * @category Inputs
 * @exports Autocomplete
 * @example
 * <Autocomplete label="Country" options={['Canada', 'France', 'Japan']} value={value} onChange={setValue} />
 */
export interface AutocompleteProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** Strings or `{ label, ... }` objects. */
  options?: AutocompleteOption[];
  value?: AutocompleteOption | null;
  defaultValue?: AutocompleteOption | null;
  /** Called with the chosen option, or null when cleared. */
  onChange?: (option: AutocompleteOption | null) => void;
  /** The typed text (controlled). */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  label?: React.ReactNode;
  labelPosition?: 'top' | 'floating' | 'none';
  placeholder?: string;
  helperText?: React.ReactNode;
  size?: Size;
  /** @deprecated 'light' was removed and never did anything. */
  variant?: 'outline' | 'light';
  /** Palette of the highlighted option. */
  color?: Color;
  /** Show a spinner in the list. */
  loading?: boolean;
  loadingText?: React.ReactNode;
  noOptionsText?: React.ReactNode;
  /** Accept text that matches no option. */
  freeSolo?: boolean;
  /** Show a clear button. */
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: Sx;
}

/**
 * A file drop target that also opens the file picker on click or Enter. onFiles gets a File[].
 * @category Inputs
 * @exports DropZone
 * @example
 * <DropZone accept="image/*" multiple onFiles={(files) => console.log(files)} label="Drop images here" sublabel="or click to browse" />
 */
export interface DropZoneProps extends Native<HTMLDivElement> {
  onFiles?: (files: File[]) => void;
  /** File input accept string: "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  size?: Size;
  disabled?: boolean;
  /** Replaces the upload icon. */
  icon?: React.ReactNode;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  /** Replaces the default icon + labels. */
  children?: React.ReactNode;
  sx?: Sx;
}

// ─── Swatches ────────────────────────────────────────────────────────────────

/**
 * A color chip. With onClick it is a toggle button (aria-pressed); without, a display swatch.
 * @category Inputs
 * @exports Swatch
 * @example
 * <Swatch color="rebeccapurple" label="Purple" selected={checked} onClick={() => setChecked(!checked)} />
 */
export interface SwatchProps extends Native<HTMLElement, 'onClick'> {
  /** Any CSS color — user data, not a theme token. */
  color?: string;
  /** The color's name, shown under the chip and used as its accessible name. */
  label?: React.ReactNode;
  size?: Size;
  /** fixed = its own width; fill = stretch to the slot. */
  fit?: 'fixed' | 'fill';
  selected?: boolean;
  disabled?: boolean;
  /** Mark selection with a radio instead of a check (clickable swatches only). */
  radio?: boolean;
  /** Makes it clickable. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  sx?: Sx;
}

/**
 * A Swatch with a field label (top / bottom / left / right). Other props go to the Swatch.
 * @category Inputs
 * @exports SwatchField
 * @example
 * <SwatchField label="Accent" swatchLabel="Teal" color="teal" onClick={() => {}} />
 */
export interface SwatchFieldProps extends Omit<SwatchProps, 'label'> {
  /** The field label; omit for the swatch alone. */
  label?: React.ReactNode;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** The Swatch's own label (the color's name). */
  swatchLabel?: React.ReactNode;
}

/**
 * The tiny decorative color chip inside a menu or select row (aria-hidden).
 * @category Inputs
 * @exports MiniSwatch
 * @example
 * <MiniSwatch color="tomato" />
 */
export interface MiniSwatchProps extends Native<HTMLDivElement> {
  /** Any CSS color. */
  color?: string;
  sx?: Sx;
}
