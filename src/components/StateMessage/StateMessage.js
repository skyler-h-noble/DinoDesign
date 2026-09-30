// src/components/StateMessage/StateMessage.js
import React, { useId } from 'react';
import { Box } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Icon } from '../Icon/Icon';
import { Subtitle, Body, BodySmall } from '../Typography';

/**
 * StateMessage — what a region shows instead of data.
 *
 * WHY THIS IS NOT A STATE OF Table OR List
 * Because it needs WORDS. Hover, pressed and ghost need none; "empty" is
 * meaningless until it says WHICH empty — "no invoices yet" and "no results for
 * that filter" are the same design, different copy, and different follow-up
 * actions. Anything that requires copy is content, not a state.
 *
 * It is also why this is a SLOT on Table rather than a variant: Table is
 * already 288 variant combinations (4 styles x 8 colours x 3 sizes x 3
 * stripes). A five-value state property would make it 1,440, and an empty
 * table does not look different in Primary and in Error.
 *
 * WHY IT IS NOT IN FIGMA
 * A Figma component earns its permanent maintenance when instances share more
 * than they override. Instances of this share a gap and a max-width, and
 * override the icon, the headline, the body and the action — everything that
 * distinguishes one from another. It introduces no brand variable either, so
 * there is nothing for the add-on to rebind. One illustrative frame in the docs
 * carries the convention without becoming a second definition.
 *
 * THE COPY NEVER ENTERS THE DESIGN SYSTEM. "No invoices yet" and "No patients
 * found" are one design and two strings; the strings belong to the product.
 * Same rule as never baking a brand's hex into a token.
 */

/* Defaults per type. `no-results` is split from `empty` on purpose: they are
   the two messages that get conflated, and conflating them is how a user who
   filtered everything out gets told to create their first record. */
const TYPES = {
  empty: {
    icon: <InboxOutlinedIcon />,
    iconColor: 'quiet',
    titleColor: 'header',
    role: undefined,
  },
  'no-results': {
    icon: <SearchOffOutlinedIcon />,
    iconColor: 'quiet',
    titleColor: 'header',
    role: undefined,
  },
  error: {
    icon: <ErrorOutlineOutlinedIcon />,
    iconColor: 'error',
    titleColor: 'error',
    /* A failed load is a change the user did not ask for and must hear about,
       so it interrupts. `empty` does not: it is the ordinary result of an
       ordinary query, and announcing it assertively would talk over whatever
       the user was reading. */
    role: 'alert',
  },
};

const SIZE_MAP = {
  small:  { icon: 'medium', pad: '24px 16px', gap: '8px',  maxWidth: '36ch' },
  medium: { icon: 'large',  pad: '48px 24px', gap: '12px', maxWidth: '40ch' },
  large:  { icon: 'large',  pad: '80px 24px', gap: '16px', maxWidth: '44ch' },
};

/**
 * @param {'empty'|'no-results'|'error'} type
 * @param {ReactNode} icon    overrides the type's default
 * @param {string}    title   the headline. Required — a state with no words is
 *                            an empty box, which is what this replaces.
 * @param {ReactNode} body    one line of explanation. Optional.
 * @param {ReactNode} action  a Button. Optional, but an error without a way
 *                            forward is just bad news.
 */
export function StateMessage({
  type = 'empty',
  icon,
  title,
  body,
  action,
  size = 'medium',
  className = '',
  sx = {},
  ...props
}) {
  const t = TYPES[type] || TYPES.empty;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const BodyComp = size === 'small' ? BodySmall : Body;

  /* The region is NAMED by its own headline. Without this it is an unlabelled
     group: a screen-reader user tabbing past a table hears "group" and has to
     enter it to find out the query returned nothing. The ids are generated
     rather than taken as props because a caller who forgets one produces
     exactly that silent failure. */
  const uid = useId();
  const titleId = title ? uid + '-title' : undefined;
  const bodyId = body ? uid + '-body' : undefined;

  if (process.env.NODE_ENV !== 'production' && !title) {
    // eslint-disable-next-line no-console
    console.warn(
      '[StateMessage] needs a `title`. A state message with no words is an '
      + 'empty box, which is the thing it exists to replace.',
    );
  }

  return (
    <Box
      className={'state-message state-message-' + type + ' state-message-' + size + ' ' + className}
      /* An error is a change the user did not ask for, so it interrupts.
         `empty` and `no-results` are the ordinary outcome of an ordinary
         query — announcing those assertively talks over whatever the user was
         reading, so they are a plain labelled group instead. */
      role={t.role || 'group'}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: s.gap,
        padding: s.pad,
        /* The region must not collapse. An empty table that shrinks to its
           header makes the page jump on every filter change. */
        width: '100%',
        boxSizing: 'border-box',
        ...sx,
      }}
      {...props}
    >
      {/* Decorative. The headline already says what this is, so naming the
          glyph too would announce the region twice — the same rule as an
          icon inside a labelled Button. <Icon> is aria-hidden unless given an
          aria-label, so this is correct by default; it is stated explicitly
          because the default is invisible and easy to "fix" away. */}
      <Icon size={s.icon} color={t.iconColor} aria-hidden="true">
        {icon || t.icon}
      </Icon>

      {title && <Subtitle id={titleId} color={t.titleColor}>{title}</Subtitle>}

      {body && (
        /* Capped so the sentence does not sprawl across a wide table. Set on
           the text, not the container, so the icon and action stay centred on
           the region rather than on the paragraph. */
        <BodyComp id={bodyId} color="quiet" sx={{ maxWidth: s.maxWidth }}>
          {body}
        </BodyComp>
      )}

      {action && <Box sx={{ marginTop: '4px' }}>{action}</Box>}
    </Box>
  );
}

export default StateMessage;
