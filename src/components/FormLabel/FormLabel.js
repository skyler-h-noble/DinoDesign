// src/components/FormLabel/FormLabel.js
//
// The design's Form-Label (8702:11037), and the first thing in this library to
// read the LABEL type style.
//
// ── Why it exists ────────────────────────────────────────────────────────────
// Not one form component here used the Label style. Input, Select and
// NumberField rendered labels through Body/BodySmall at a literal 13px;
// Checkbox and Switch through Body variants; RadioGroup through MUI FormLabel
// with a hand-set fontSize and weight. Figma binds Labels/Label-Font-Family and
// the Dynamic-Label ramp, so a brand re-picking its label scale moved every
// label in the design file and none in the library.
//
// ── label or legend, decided by the caller ───────────────────────────────────
// A single field wants <label for>. A GROUP of fields — a RadioGroup, a set of
// checkboxes — wants <legend> inside a <fieldset>, because "choose one" names
// the group rather than any one control. The design says the same thing by
// giving the group its own `group form label` style. One component, two
// elements, and the consumer knows which it is.
//
// ── Where the required marker is announced ───────────────────────────────────
// `required` and `optional` are treated DIFFERENTLY on purpose:
//
//   required  the marker is aria-hidden, and `aria-required` on the control
//             carries it. Otherwise the field announces as "Email star
//             Required" — the asterisk read aloud, as part of the name.
//   optional  the marker IS announced, because there is no aria-optional and
//             no other way for a screen reader user to learn it.
//
// ── More Info sits BESIDE the label, never inside it ─────────────────────────
// A <label> forwards clicks to its control, so a link inside one has two jobs
// on the same click. Worse, everything inside a label becomes part of the
// field's accessible name, so the field would announce as "Email More about
// this field". The row is the container; the label is only its first child.
import React from 'react';
import { Box } from '@mui/material';
// Straight from the file, not the folder index: the index also exports the
// Typography showcase, which imports Select, which imports this — a cycle.
import { Label } from '../Typography/Typography';
import { Link } from '../Link/Link';
import { Icon } from '../Icon/Icon';
import InfoOutlinedIcon from '@omni-design/icons/InfoOutlined';

/** The design's literal strings, including its leading space before the star. */
export const FORM_LABEL_MARKERS = {
  required: ' * Required',
  optional: 'Optional',
};

export function FormLabel({
  children,
  /* The control this names. Required for `as="label"` — a label with no
     htmlFor whose control is a SIBLING has no association at all, explicit or
     implicit, and announces as unlabelled while looking correct. That exact
     bug shipped in Input. */
  htmlFor,
  /* For a control <label for> cannot reach — a range slider's two inputs —
     give the label an id and point the control's aria-labelledby at it. The
     id goes on the <label> itself, so the name is the label's text alone. */
  id,
  /* Figma's Type axis. It was two booleans that could both be true at once. */
  type = 'default',
  /* 'label' for one control, 'legend' for a fieldset of them. */
  as = 'label',
  /* { label, href?, onClick? } — the hotlink-and-info affordance. `label` is
     required and should name the FIELD, not the glyph: six fields each with
     "More information" gives a screen reader user six identical controls. */
  moreInfo,
  disabled = false,
  className = '',
  sx = {},
  ...props
}) {
  const marker = FORM_LABEL_MARKERS[type];
  const isLegend = as === 'legend';

  if (process.env.NODE_ENV !== 'production' && !isLegend && !htmlFor && !id) {
    // eslint-disable-next-line no-console
    console.warn(
      '[FormLabel] no `htmlFor`. A <label> whose control is a sibling has no '
      + 'association — the field announces as unlabelled while looking right. '
      + 'Pass the control\'s id, or use as="legend" inside a <fieldset>.'
    );
  }
  if (process.env.NODE_ENV !== 'production' && moreInfo && !moreInfo.label) {
    // eslint-disable-next-line no-console
    console.warn(
      '[FormLabel] `moreInfo` needs a `label`. Name the FIELD it belongs to '
      + '("More about your email address"), not the icon.'
    );
  }

  /* A LEGEND MUST BE A DIRECT CHILD OF ITS FIELDSET.
   *
   * The name of a <fieldset> comes from its first <legend> CHILD. Wrap that
   * legend in anything — here, the row <div> that holds the More Info link
   * beside the label — and the group keeps role="group" but loses its name
   * entirely. It still looks perfect: the caption renders, sighted users read
   * it, and a screen reader announces an unnamed group of controls. The same
   * failure mode as Input's missing htmlFor, one level up.
   *
   * So the legend is returned BARE, with More Info as a sibling rather than a
   * child. Inside the legend it would join the group's accessible name
   * ("Delivery More about delivery") — the same reason it stays out of a
   * <label>.
   *
   * BESIDE, WITHOUT A WRAPPER. A row wrapper is the one thing that cannot
   * exist, so the legend FLOATS: a floated legend stays the fieldset's first
   * child (and keeps naming it) but lays out like any block, so the More Info
   * link that follows sits on its line, Sizing-Half after it — Figma's
   * Form-Label. A zero-height clear after the two puts the fields below. */
  const labelEl = (
    <Label
      component={isLegend ? 'legend' : 'label'}
      htmlFor={isLegend ? undefined : htmlFor}
      id={id}
      className="form-label"
      style={{
        /* --Text, from the SURFACE table. The design briefly bound Buttons'
           `Text` here — a different role, the label ON a button fill. A form
           label sits on the surface. */
        color: disabled ? 'var(--Quiet)' : 'var(--Text)',
      }}
    >
      {children}
      {marker && (
        <span
          className={'form-label-marker form-label-marker-' + type}
          /* Required is carried by aria-required on the control; optional has
             no ARIA equivalent, so that one must be read. */
          aria-hidden={type === 'required' ? 'true' : undefined}
          /* Figma: the marker is its own text, Sizing-Half after the label.
             inline-block, so the accessible name still gets a space between
             "Label" and "Optional" — an inline span with a margin would read
             as one word. */
          style={{ display: 'inline-block', marginLeft: 'var(--Sizing-Half, 4px)' }}
        >
          {/* Figma draws "Optional" as a bulleted item: "Label • Optional".
              The bullet is decoration — hidden, so the name is "Label Optional".
              Its box is the list's 1.5em indent, the bullet centred in it. */}
          {type === 'optional' && (
            <span aria-hidden="true" style={{ display: 'inline-block', width: '1.5em', textAlign: 'center' }}>•</span>
          )}
          {marker}
        </span>
      )}
    </Label>
  );

  const moreInfoEl = moreInfo ? (
    <Link
      className="form-label-more-info"
      href={moreInfo.href}
      onClick={moreInfo.onClick}
      aria-label={moreInfo.label}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--Sizing-Half)' }}
    >
      {/* Icon first, as Figma's Form-Label draws it: ⓘ More information.
          aria-hidden by default in this library unless given its own label,
          so the Link's name is the only one announced. */}
      <Icon size="small"><InfoOutlinedIcon /></Icon>
      {moreInfo.text}
    </Link>
  ) : null;

  if (isLegend) {
    if (!moreInfoEl) return labelEl;
    return (
      <>
        {React.cloneElement(labelEl, { style: { ...labelEl.props.style, float: 'left', padding: 0, marginRight: 'var(--Sizing-Half, 4px)' } })}
        {moreInfoEl}
        <span aria-hidden="true" className="form-label-clear" style={{ display: 'block', clear: 'both', height: 0 }} />
      </>
    );
  }

  return (
    <Box
      className={'form-label-row ' + className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        /* Figma binds itemSpacing -> Sizing-Half on Form-Label. */
        gap: 'var(--Sizing-Half)',
        ...sx,
      }}
      {...props}
    >
      {labelEl}
      {moreInfoEl}
    </Box>
  );
}

export default FormLabel;
