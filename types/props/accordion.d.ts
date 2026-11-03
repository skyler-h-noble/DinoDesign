// types/props/accordion.d.ts — Accordion and its parts. Format: see the top
// of scripts/lib/api-model.mjs.
import type * as React from 'react';
import type { Color, Size, Surface, Sx, Native } from '../core-props';

/**
 * Wraps one or more Accordions and sets their look: connected (spacing 0) or separate segments.
 * @category Overlays
 * @exports AccordionGroup
 * @example
 * <AccordionGroup>
 *   <Accordion>
 *     <AccordionSummary>Shipping</AccordionSummary>
 *     <AccordionDetails><Body>Ships in 2 days.</Body></AccordionDetails>
 *   </Accordion>
 * </AccordionGroup>
 */
export interface AccordionGroupProps extends Native<HTMLDivElement, 'color'> {
  /** solid = Container level; light / dark = brightest / dimmest surface of `color`. */
  variant?: 'solid' | 'light' | 'dark';
  /** Explicit surface; wins over the variant mapping. */
  surface?: Surface;
  /** Theme of the group. */
  color?: Color;
  /** Title and body type scale. */
  size?: Size;
  /** Gap between segments in 8px units; 0 joins them into one block. */
  spacing?: 0 | 0.5 | 1 | 1.5 | 2 | number;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One expandable section. Works alone or inside AccordionGroup.
 * @category Overlays
 * @exports Accordion
 * @parent Children: `AccordionSummary` then `AccordionDetails`.
 * @example
 * <Accordion expanded={open} onChange={setOpen}>
 *   <AccordionSummary>Returns</AccordionSummary>
 *   <AccordionDetails><Body>30 days.</Body></AccordionDetails>
 * </Accordion>
 */
export interface AccordionProps extends Native<HTMLDivElement, 'onChange'> {
  /** Controlled open state. */
  expanded?: boolean;
  /** Uncontrolled initial state. */
  defaultExpanded?: boolean;
  /** Called with the new open state (not an event). */
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The clickable header row of an Accordion (a button that toggles it).
 * @category Overlays
 * @exports AccordionSummary
 * @parent Inside `<Accordion>`.
 * @example
 * <Accordion>
 *   <AccordionSummary eyebrow="Step 1" secondary="Pick a plan" startDecorator={<PaymentIcon />}>Billing</AccordionSummary>
 *   <AccordionDetails><Body>Details.</Body></AccordionDetails>
 * </Accordion>
 */
export interface AccordionSummaryProps extends Native<HTMLButtonElement> {
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** Small line above the title. */
  eyebrow?: React.ReactNode;
  /** @deprecated Use `eyebrow`. */
  overline?: React.ReactNode;
  /** Second line under the title. */
  secondary?: React.ReactNode;
  /** Replaces the chevron. */
  expandIcon?: React.ReactNode;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The collapsible body of an Accordion.
 * @category Overlays
 * @exports AccordionDetails
 * @parent Inside `<Accordion>`, after `AccordionSummary`.
 * @example
 * <Accordion>
 *   <AccordionSummary>FAQ</AccordionSummary>
 *   <AccordionDetails><Body>Answer.</Body></AccordionDetails>
 * </Accordion>
 */
export interface AccordionDetailsProps extends Native<HTMLDivElement> {
  sx?: Sx;
  children?: React.ReactNode;
}
