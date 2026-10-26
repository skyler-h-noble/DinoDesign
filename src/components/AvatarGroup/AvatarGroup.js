// src/components/AvatarGroup/AvatarGroup.js
import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Avatar, AVATAR_SIZE_MAP, resolveSizeName } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import { Subtitle, Body } from '../Typography';

/**
 * AvatarGroup — Figma's Avatar Group.
 *
 * TWO WAYS TO FILL IT
 *   people   [{ src, initials, name, detail, href, onClick }] — the group draws
 *            everything: the avatars, a details card on hover / focus, and a
 *            "+N" Button that opens a list of everyone not shown.
 *   children Avatars you build yourself — display only, no card or list.
 *
 * WITH `people`
 *   - A person with `href` is a LINK (it goes somewhere: their profile), one
 *     with onClick (or the group's onPersonClick) a BUTTON (it does something
 *     on the page). Either way it is Button contentType="avatar", so hover,
 *     pressed, focus and disabled are Button's own — `href` just makes the
 *     element an <a>, so open-in-new-tab and copy-link work. With neither it
 *     is a focusable avatar, so the details card is still reachable.
 *   - One target per person: the avatar in the group, the whole row in the
 *     "+N" list. Never an avatar button AND a name link to the same place —
 *     that is two tab stops and two announcements for one choice.
 *   - Hover or focus shows the person's details — avatar, name (Subtitle),
 *     detail (Body) — in a Popover hover card, and brings the avatar to the
 *     front so it shows whole.
 *   - "+N" is a plain Neutral number Button (contentType="letterNumber") —
 *     its own states and contrast, no overrides; it opens a Popover listing the
 *     rest as plain rows — the details card's layout, no borders — buttons
 *     with the surface's Hover / Pressed fill when the person is clickable.
 *   - `size` is the BUTTON size (small | medium | large) — an avatar button
 *     is as tall as a button.
 *
 * OVERLAP is a quarter of the avatar (Figma's Avatar-Group-Gap, −size / 4).
 * When any avatar is its own click target, each must show at least 24px —
 * WCAG 2.5.8 — so the overlap is capped at size − 24: a 24px group sits edge
 * to edge, 16 / 20px groups get a gap. A display-only group keeps the quarter.
 *
 * RING. Each avatar sits in a wrapper with a 2px ring of the page's
 * Background (a box-shadow outside the circle, so the target keeps its size).
 * The wrapper — not the Button — carries it, because Button's own box-shadow
 * is its bevel and elevation.
 */

const BUTTON_HEIGHT = {
  small: 'var(--Small-Button-Height, 24px)',
  medium: 'var(--Button-Height, 32px)',
  large: 'var(--Large-Button-Height, 40px)',
};

/** The details card: a large avatar, the name, the detail line. */
function PersonCard({ person }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-2, 16px)', padding: 'var(--Sizing-1, 8px)' }}>
      <Avatar size="large" src={person.src} initials={person.initials} alt="" />
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {person.name && <Subtitle>{person.name}</Subtitle>}
        {person.detail && <Body>{person.detail}</Body>}
      </Box>
    </Box>
  );
}

/* The avatar buttons are circles, as the avatars they hold. The "+N" is a
   plain number Button — its own shape, states and contrast, untouched. */
const ROUND = { borderRadius: '50%' };

let cardSeq = 0;

/** One avatar in the group, with its ring, its front-on-hover and its card. */
function GroupItem({ person, onPersonClick, buttonSize, buttonVariant }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef(null);
  const idRef = useRef(null);
  if (idRef.current === null) idRef.current = 'avatar-card-' + (++cardSeq);
  const click = person.onClick || (onPersonClick && (() => onPersonClick(person)));
  const target = click || person.href;
  const hasCard = !!(person.name || person.detail);

  const show = () => { clearTimeout(leaveTimer.current); setOpen(true); };
  const hide = () => { clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setOpen(false), 120); };
  const handlers = hasCard
    ? { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, onKeyDown: (e) => { if (e.key === 'Escape') setOpen(false); } }
    : {};

  const avatar = <Avatar src={person.src} initials={person.initials} alt="" />;
  const describe = hasCard && open ? idRef.current : undefined;

  return (
    <Box component="span" className="avatar-group-item" {...handlers}>
      {target ? (
        <Button ref={ref} contentType="avatar" variant={buttonVariant} size={buttonSize} href={person.href}
          aria-label={person.name || 'Person'} aria-describedby={describe} onClick={click} disabled={person.disabled}
          sx={ROUND}>
          {avatar}
        </Button>
      ) : (
        <Box ref={ref} component="span" role="img" tabIndex={hasCard ? 0 : undefined}
          aria-label={person.name || 'Person'} aria-describedby={describe}
          className="avatar-group-static"
          sx={{ display: 'inline-flex', borderRadius: '50%', width: BUTTON_HEIGHT[buttonSize], height: BUTTON_HEIGHT[buttonSize],
            '& > .avatar': { width: '100%', height: '100%' },
            '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' } }}>
          {avatar}
        </Box>
      )}
      {hasCard && (
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={ref.current} placement="bottom-start" arrow
          width="auto" role="tooltip" autoFocus={false} id={idRef.current} theme={null}
          onMouseEnter={show} onMouseLeave={hide}>
          <PersonCard person={person} />
        </Popover>
      )}
    </Box>
  );
}

export function AvatarGroup({
  children,
  people,
  max = 5,
  size = 'medium',
  spacing,
  onPersonClick,
  /** Called with the hidden people when "+N" is pressed, after the list opens. */
  onOverflowClick,
  buttonVariant = 'ghost',
  className = '',
  sx = {},
  ...props
}) {
  const overflowRef = useRef(null);
  const [listOpen, setListOpen] = useState(false);
  const peopleMode = Array.isArray(people);
  const all = peopleMode ? people : React.Children.toArray(children);
  const visible = all.slice(0, max);
  const hidden = all.slice(max);
  const overflow = hidden.length;

  /* Step from one avatar's left edge to the next. People mode sizes by the
     button height (a CSS variable), so the cap is CSS too; children mode
     knows the avatar's pixel size. */
  let step;
  let interactive;
  const buttonSize = BUTTON_HEIGHT[size] ? size : 'medium';
  if (peopleMode) {
    interactive = !!onPersonClick || people.some((p) => p.onClick || p.href) || overflow > 0;
    const H = BUTTON_HEIGHT[buttonSize];
    const quarter = 'calc(' + H + ' / -4)';
    step = spacing !== undefined ? spacing + 'px' : quarter;
    if (interactive) step = 'max(' + step + ', calc(24px - ' + H + '))';
  } else {
    const px = (AVATAR_SIZE_MAP[resolveSizeName(size)] || AVATAR_SIZE_MAP.medium).size;
    interactive = all.some((c) => c && c.props && (c.props.onClick || c.props.clickable));
    let n = spacing !== undefined ? spacing : -(px / 4);
    if (interactive) n = Math.max(n, 24 - px);
    step = n + 'px';
  }

  const rowSx = {
    display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'transparent',
    padding: 0, margin: 0, font: 'inherit', color: 'inherit',
    borderRadius: 'var(--Menu-Item-Radius, 0px)',
  };
  const clickableRowSx = {
    ...rowSx,
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
  };

  return (
    <Box
      role="group"
      aria-label={'Avatar group, ' + all.length + (all.length === 1 ? ' person' : ' people')}
      className={'avatar-group' + (interactive ? ' avatar-group-interactive' : '') + (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex', alignItems: 'center',
        '& > *:not(:first-of-type)': { marginLeft: step },
        '& > *': { position: 'relative', borderRadius: '50%', boxShadow: '0 0 0 2px var(--Background)', display: 'inline-flex' },
        // Hover or focus brings an avatar to the front, so it shows whole.
        '& > *:hover, & > *:focus-within': { zIndex: 1 },
        ...sx,
      }}
      {...props}
    >
      {peopleMode
        ? visible.map((p, i) => (
            <GroupItem key={p.key || p.name || i} person={p} onPersonClick={onPersonClick}
              buttonSize={buttonSize} buttonVariant={buttonVariant} />
          ))
        : visible.map((c) => (React.isValidElement(c) && c.props.size === undefined ? React.cloneElement(c, { size }) : c))}

      {overflow > 0 && (peopleMode ? (
        <Box component="span" className="avatar-group-item avatar-group-overflow">
          <Button ref={overflowRef} contentType="letterNumber" variant="neutral" size={buttonSize}
            aria-label={overflow + ' more: ' + hidden.map((p) => p.name).filter(Boolean).join(', ')}
            aria-haspopup="dialog" aria-expanded={listOpen}
            onClick={() => { setListOpen((o) => !o); onOverflowClick?.(hidden); }}>
            {'+' + overflow}
          </Button>
          <Popover open={listOpen} onClose={() => setListOpen(false)} anchorEl={overflowRef.current}
            placement="bottom" arrow width="auto" theme={null} aria-label={overflow + ' more people'}>
            {hidden.map((p, i) => {
              const click = p.onClick || (onPersonClick && (() => onPersonClick(p)));
              if (p.href) return (
                <Box key={p.key || p.name || i} component="a" href={p.href} className="avatar-group-row"
                  onClick={() => { setListOpen(false); click?.(); }} sx={{ ...clickableRowSx, textDecoration: 'none' }}>
                  <PersonCard person={p} />
                </Box>
              );
              return click ? (
                <Box key={p.key || p.name || i} component="button" type="button" className="avatar-group-row"
                  onClick={() => { setListOpen(false); click(); }} sx={clickableRowSx}>
                  <PersonCard person={p} />
                </Box>
              ) : (
                <Box key={p.key || p.name || i} className="avatar-group-row" sx={rowSx}>
                  <PersonCard person={p} />
                </Box>
              );
            })}
          </Popover>
        </Box>
      ) : (
        <Avatar initials={'+' + overflow} size={size} color="neutral" defaultPhoto={false} />
      ))}
    </Box>
  );
}

export default AvatarGroup;
