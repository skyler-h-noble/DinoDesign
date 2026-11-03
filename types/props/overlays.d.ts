// types/props/overlays.d.ts — props for the floating components (Popover,
// Dialog, Modal, Drawer, Sheet, Tooltip) and feedback (Alert, Snackbar,
// progress, loaders, Ghost, StateMessage).
//
// Hand-written, one source of truth with docs/API.md: fix-dts swaps these in
// for the inferred signatures and fails if a component destructures a prop
// that is not declared here. Format: see scripts/lib/api-model.mjs.
import type * as React from 'react';
import type { Theme, Surface, Color, Size, Sx, Native } from '../core-props';

/** The four states an alert can mean. A brand-colored notice is a callout (a Card in a themed Section), not an Alert. */
export type AlertColor = 'info' | 'success' | 'warning' | 'error';

/** Why an overlay asked to close. */
export type CloseReason = 'backdropClick' | 'escapeKeyDown';

// ─── Overlays ────────────────────────────────────────────────────────────────

/**
 * Floating panel anchored to an element, portalled so no scroll area or clipped card cuts it off. Use for account menus, hover cards, anything that floats.
 * @category Overlays
 * @exports Popover
 * @example
 * <>
 *   <Button ref={anchorRef} variant="default-outline" onClick={() => setOpen(!open)}>Account</Button>
 *   <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} aria-label="Account" arrow>
 *     <Body>Signed in as Jane.</Body>
 *   </Popover>
 * </>
 */
export interface PopoverProps {
  open?: boolean;
  /** Outside click, Escape, or Tab out of the panel. */
  onClose?: () => void;
  /** Element to position against. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** The anchor element itself, when there is no ref. */
  anchorEl?: HTMLElement | null;
  /** Flips to the other side at the viewport edge. */
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start' | 'top';
  /** A small arrow pointing at the anchor. */
  arrow?: boolean;
  theme?: Theme;
  surface?: Surface;
  /** px or CSS length; 'auto' hugs the content. */
  width?: number | string;
  /** Scrolls past this height. */
  maxHeight?: number | string;
  /** The panel's accessible name. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** 'tooltip' for a hover card (with autoFocus={false}). */
  role?: 'dialog' | 'tooltip';
  /** Move focus in on open and back on close. false for hover cards. */
  autoFocus?: boolean;
  /** For aria-describedby on the trigger. */
  id?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  /** Render in place with no anchor positioning (docs and samples only). */
  disablePortal?: boolean;
  className?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Modal dialog with a title, body and action row; traps focus, closes on Escape / backdrop (unless `alert`).
 * @category Overlays
 * @exports Dialog
 * @source Dialog/Dialog#StaticDialog
 * @example
 * <Dialog open={open} onClose={() => setOpen(false)} title="Delete project?"
 *   actions={<><Button variant="default-outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="error">Delete</Button></>}>
 *   <Body>This cannot be undone.</Body>
 * </Dialog>
 */
export interface DialogProps extends Native<HTMLDivElement, 'title'> {
  open?: boolean;
  /** Called with the event and why it closed. */
  onClose?: (event: React.SyntheticEvent | {}, reason?: CloseReason) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** The button row. */
  actions?: React.ReactNode;
  /** 'dialog' = the design's 560px; xs–xl are MUI's wider widths. */
  maxWidth?: 'dialog' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullScreen?: boolean;
  /** 'paper' scrolls inside the dialog. */
  scroll?: 'body' | 'paper';
  /** role="alertdialog": no close icon, no Escape, no backdrop close. */
  alert?: boolean;
  /** No backdrop and no focus trap. */
  nonModal?: boolean;
  /** Enter animation (fade when unset). */
  transition?: 'fade' | 'grow' | 'zoom' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  /** ms. */
  transitionDuration?: number;
  /** id of the title, for aria-labelledby. */
  titleId?: string;
  /** id of the body, for aria-describedby. */
  contentId?: string;
  /** Props for the dialog panel (className, style). */
  PaperProps?: Record<string, unknown>;
  disableAutoFocus?: boolean;
  disableRestoreFocus?: boolean;
  disableScrollLock?: boolean;
  /** MUI escape hatches — passing one renders MUI's Dialog. */
  keepMounted?: boolean;
  disablePortal?: boolean;
  hideBackdrop?: boolean;
  disableEscapeKeyDown?: boolean;
  fullWidth?: boolean;
  sx?: Sx;
}

/**
 * Confirm / cancel dialog (role="alertdialog"). Both buttons close it unless their handler is given.
 * @category Overlays
 * @exports AlertDialog
 * @example
 * <AlertDialog open={open} onClose={() => setOpen(false)} title="Discard changes?" confirmText="Discard" onConfirm={() => setOpen(false)}>
 *   <Body>Your edits will be lost.</Body>
 * </AlertDialog>
 */
export interface AlertDialogProps extends Omit<DialogProps, 'actions' | 'alert'> {
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  /** Confirm button click; defaults to onClose. */
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  /** Cancel button click; defaults to onClose. */
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Dialog with Cancel / Submit buttons for a short form. `onSubmit` is the Submit button's click, not a form submit event.
 * @category Overlays
 * @exports FormDialog
 * @example
 * <FormDialog open={open} onClose={() => setOpen(false)} title="Rename" onSubmit={() => setOpen(false)}>
 *   <TextField label="Name" value={text} onChange={(e) => setText(e.target.value)} />
 * </FormDialog>
 */
export interface FormDialogProps extends Omit<DialogProps, 'actions'> {
  submitText?: React.ReactNode;
  cancelText?: React.ReactNode;
  /** Submit button click. */
  onSubmit?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Modal panel with eyebrow, title, body and actions; themeable (`variant` + `color`). For a standard confirm, Dialog.
 * @category Overlays
 * @exports Modal
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="Welcome" actions={<Button onClick={() => setOpen(false)}>Got it</Button>}>
 *   <Body>Here is what is new.</Body>
 * </Modal>
 */
export interface ModalProps extends Native<HTMLDivElement, 'title'> {
  open?: boolean;
  /** Close button, Escape, or backdrop click. */
  onClose?: (event?: React.SyntheticEvent) => void;
  children?: React.ReactNode;
  title?: React.ReactNode;
  /** Small line above the title. */
  eyebrow?: React.ReactNode;
  /** The button row. */
  actions?: React.ReactNode;
  /** default = page theme on Container-High; solid = `color` theme on Container-High; soft = `color` theme on Surface-Brightest. */
  variant?: 'default' | 'solid' | 'soft';
  /** Palette for solid / soft. */
  color?: Exclude<Color, 'default'>;
  /** Max width: 400 / 560 / 720px. */
  size?: Size;
  layout?: 'center' | 'fullscreen';
  transition?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'zoom';
  /** ms (150–600). */
  transitionSpeed?: number;
  /** Clicking the backdrop closes it. */
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  sx?: Sx;
}

/**
 * Panel that slides in from a screen edge (navigation, filters). Compose with DrawerHeader / DrawerContent / DrawerClose.
 * @category Overlays
 * @exports Drawer
 * @example
 * <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
 *   <DrawerHeader><Subtitle>Menu</Subtitle><DrawerClose onClick={() => setOpen(false)} /></DrawerHeader>
 *   <DrawerContent><Link href="/">Home</Link></DrawerContent>
 * </Drawer>
 */
export interface DrawerProps extends Native<HTMLDivElement> {
  open?: boolean;
  /** Escape or backdrop click. */
  onClose?: () => void;
  /** Width (or height for top / bottom): 240 / 320 / 420px. */
  size?: Size;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  hideBackdrop?: boolean;
  /** The panel's surface level. */
  surface?: Surface;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The Drawer's close button (an icon-only ghost Button named "Close drawer").
 * @category Overlays
 * @exports DrawerClose
 * @parent Inside `<Drawer>`, usually in `<DrawerHeader>`.
 * @example
 * <DrawerClose onClick={() => setOpen(false)} />
 */
export interface DrawerCloseProps extends Native<HTMLDivElement, 'onClick'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  sx?: Sx;
}

/**
 * Drawer regions: DrawerHeader (title row) and DrawerContent (scrolling body).
 * @category Overlays
 * @exports DrawerHeader DrawerContent
 * @parent Inside `<Drawer>`.
 * @example
 * <DrawerContent><Body>Filters</Body></DrawerContent>
 */
export interface DrawerSectionProps extends Native<HTMLDivElement> {
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Bottom sheet: a Drawer from the bottom, 640px max, rounded top. For phone-style secondary content.
 * @category Overlays
 * @exports Sheet
 * @example
 * <Sheet open={open} onClose={() => setOpen(false)}><Subtitle>Share</Subtitle></Sheet>
 */
export interface SheetProps extends Native<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  /** The sheet's surface level. */
  surface?: Surface;
  hideBackdrop?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Short label on hover / focus of its child. One solid style; for a light hover panel use Popover role="tooltip".
 * @category Overlays
 * @exports Tooltip
 * @source Tooltip/Tooltip#StaticTooltip
 * @example
 * <Tooltip title="Delete item"><Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button></Tooltip>
 */
export interface TooltipProps {
  /** The trigger. A non-element is wrapped in a span; a disabled button needs a span wrapper. */
  children?: React.ReactNode;
  /** The tooltip content. Empty = no tooltip. */
  title?: React.ReactNode;
  /** Leading icon. */
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Trailing node, e.g. a close button. */
  action?: React.ReactNode;
  /** @deprecated Only 'solid' exists; others render solid and warn. */
  variant?: 'solid';
  /** Buttons palette of the bubble. */
  color?: Color | 'black-white';
  size?: Size;
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  arrow?: boolean;
  /** Controlled visibility; unset = hover / focus. */
  open?: boolean;
  /** ms before showing. */
  enterDelay?: number;
  /** ms before hiding. */
  leaveDelay?: number;
  enterNextDelay?: number;
  enterTouchDelay?: number;
  leaveTouchDelay?: number;
  /** The title describes the child (aria-describedby) instead of naming it. */
  describeChild?: boolean;
  /** Draw beside the child without a portal (scaled previews). Shown when `open`. */
  inline?: boolean;
  disableFocusListener?: boolean;
  disableHoverListener?: boolean;
  disableInteractive?: boolean;
  disableTouchListener?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  id?: string;
  /** disablePortal / container / className / style for the popper. */
  PopperProps?: { disablePortal?: boolean; container?: Element | null; className?: string; style?: React.CSSProperties };
  className?: string;
  sx?: Sx;
}

// ─── Feedback ────────────────────────────────────────────────────────────────

/**
 * Inline status message (role="alert") in one of four states, with the state's icon. Themes itself.
 * @category Feedback
 * @exports Alert
 * @example
 * <Alert color="success" title="Saved">Your changes are live.</Alert>
 */
export interface AlertProps extends Native<HTMLDivElement, 'title'> {
  /** The body. */
  children?: React.ReactNode;
  /** Header text; makes it two rows. */
  title?: React.ReactNode;
  /** light = Surface-Brightest; solid = the state's Surface. */
  variant?: 'light' | 'solid';
  /** Override the surface level. */
  surface?: Surface;
  /** Other values render as info and warn. */
  color?: AlertColor;
  size?: Size;
  /** Replaces the state icon; false for none. */
  startDecorator?: React.ReactNode;
  /** Icon, link or button at the end. */
  endDecorator?: React.ReactNode;
  sx?: Sx;
}

/**
 * Toast: a floating message at a screen edge, optionally auto-hiding. Shows a close button when `onClose` is set.
 * @category Feedback
 * @exports Snackbar
 * @example
 * <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} color="success">Message sent</Snackbar>
 */
export interface SnackbarProps extends Native<HTMLDivElement> {
  children?: React.ReactNode;
  open?: boolean;
  /** Timeout, Escape, or the close button. */
  onClose?: (event: React.SyntheticEvent | {}, reason: 'timeout' | 'escapeKeyDown' | 'closeClick') => void;
  /** 'solid' is retired: renders light and warns. */
  variant?: 'light' | 'solid';
  surface?: Surface;
  color?: Color;
  /** Text size. */
  size?: Size;
  /** 'top' / 'bottom' are the middle positions. */
  anchor?: 'top-right' | 'top-middle' | 'bottom-right' | 'bottom-middle' | 'top' | 'bottom';
  /** ms; calls onClose(_, 'timeout'). */
  autoHideDuration?: number;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** A button, e.g. Undo. */
  action?: React.ReactNode;
  sx?: Sx;
}

/**
 * Progress ring (role="progressbar"): with `value` (0–100) a static arc, without it spinning.
 * @category Feedback
 * @exports CircularProgress
 * @example
 * <CircularProgress value={60} showValue aria-label="Upload" />
 */
export interface CircularProgressProps extends Native<HTMLDivElement> {
  /** 0–100; omit for indeterminate. */
  value?: number;
  color?: Color;
  /** 24 / 40 / 80px, or a diameter in px. */
  size?: Size | number;
  /** Ring width in px (default scales with size). */
  thickness?: number;
  /** Percentage in the center. */
  showValue?: boolean;
  /** Center content instead of the percentage. */
  children?: React.ReactNode;
  sx?: Sx;
}

/**
 * Progress bar (role="progressbar"): with `value` (0–100) determinate, without it sliding.
 * @category Feedback
 * @exports LinearProgress
 * @example
 * <LinearProgress value={40} aria-label="Upload" />
 */
export interface LinearProgressProps extends Native<HTMLDivElement> {
  /** 0–100; omit for indeterminate. */
  value?: number;
  color?: Color;
  /** Bar height: 4 / 6 / 8px. */
  size?: Size;
  /** Percentage under the bar. */
  showValue?: boolean;
  sx?: Sx;
}

/**
 * Loading indicator with an optional message, in six styles. For measurable progress use CircularProgress / LinearProgress.
 * @category Feedback
 * @exports Loader
 * @example
 * <Loader type="dual-ring" message="Loading orders" />
 */
export interface LoaderProps extends Native<HTMLDivElement> {
  /** Theme the message text reads from. */
  theme?: Theme;
  surface?: Surface;
  type?: 'spinner' | 'orbit' | 'bounce' | 'ripple' | 'dual-ring' | 'bars';
  /** Primary / Secondary / Tertiary pieces (not for spinner). */
  multicolor?: boolean;
  /** 24 / 32 / 56px, or px. */
  size?: Size | number;
  color?: Color;
  /** Text under the loader; empty for none. */
  message?: React.ReactNode;
  sx?: Sx;
}

/**
 * Thin progress bar with a label and percentage.
 * @category Feedback
 * @exports LinearLoader
 * @example
 * <LinearLoader value={70} label="Importing" />
 */
export interface LinearLoaderProps extends Native<HTMLDivElement> {
  /** 0–100; omit for indeterminate. */
  value?: number;
  label?: React.ReactNode;
  sx?: Sx;
}

/**
 * Stack of placeholder blocks. For placeholders shaped like real content prefer Ghost.
 * @category Feedback
 * @exports SkeletonLoader
 * @example
 * <SkeletonLoader rows={3} height={48} />
 */
export interface SkeletonLoaderProps extends Native<HTMLDivElement> {
  rows?: number;
  /** Each block's height (px or CSS length). */
  height?: number | string;
  /** Gap in 8px units, or a CSS length. */
  spacing?: number | string;
  sx?: Sx;
}

/**
 * Three bouncing dots with a message.
 * @category Feedback
 * @exports DotsLoader
 * @example
 * <DotsLoader message="Thinking" />
 */
export interface DotsLoaderProps extends Native<HTMLDivElement> {
  message?: React.ReactNode;
  sx?: Sx;
}

/**
 * Full-page centered Loader.
 * @category Feedback
 * @exports PageLoader
 * @example
 * <PageLoader message="Loading dashboard" />
 */
export interface PageLoaderProps extends Native<HTMLDivElement> {
  message?: React.ReactNode;
  /** Loader size in px or a Size. */
  size?: Size | number;
  sx?: Sx;
}

/**
 * Placeholder card: an image block and text lines.
 * @category Feedback
 * @exports SkeletonCard
 * @example
 * <SkeletonCard lines={2} />
 */
export interface SkeletonCardProps extends Native<HTMLDivElement> {
  /** Text lines. */
  lines?: number;
  /** Show the 200px image block. */
  showImage?: boolean;
  sx?: Sx;
}

/**
 * Wraps content and veils it with a Loader while `isLoading`.
 * @category Feedback
 * @exports OverlayLoader
 * @example
 * <OverlayLoader isLoading={checked} message="Saving"><Card>Form</Card></OverlayLoader>
 */
export interface OverlayLoaderProps extends Native<HTMLDivElement> {
  isLoading?: boolean;
  message?: React.ReactNode;
  children?: React.ReactNode;
  sx?: Sx;
}

/**
 * Marks a region as loading: the real components inside render as placeholders of their own shape (aria-busy, content hidden from screen readers).
 * @category Feedback
 * @exports Ghost
 * @example
 * <Ghost active={checked} label="Loading profile"><H3>Jane Doe</H3><Body>Designer</Body></Ghost>
 */
export interface GhostProps extends Native<HTMLDivElement> {
  /** Ghost while true; render normally when false. */
  active?: boolean;
  /** Shimmer sweep; false for static blocks. */
  animate?: boolean;
  /** Announced while loading. */
  label?: string;
  children?: React.ReactNode;
}

/**
 * What a region shows instead of data: empty, no results, or an error (error is role="alert"). Also Table / List's `empty` / `error` slot.
 * @category Feedback
 * @exports StateMessage
 * @example
 * <StateMessage type="no-results" title="No matches" body="Try a different filter." action={<Button variant="default-outline">Clear filters</Button>} />
 */
export interface StateMessageProps extends Native<HTMLDivElement, 'title'> {
  /** Picks the default icon and role. */
  type?: 'empty' | 'no-results' | 'error';
  /** Replaces the type's icon. */
  icon?: React.ReactNode;
  /** **Needed** — the headline (warns without one). */
  title?: React.ReactNode;
  /** One or two sentences. */
  body?: React.ReactNode;
  /** A Button — the way forward. */
  action?: React.ReactNode;
  size?: Size;
  sx?: Sx;
}
