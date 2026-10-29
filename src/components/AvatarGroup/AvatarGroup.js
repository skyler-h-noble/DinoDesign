// src/components/AvatarGroup/AvatarGroup.js
import React, { useRef, useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Avatar, AVATAR_SIZE_MAP, resolveSizeName } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import { Subtitle, Body } from '../Typography';
import { shapeStyle, AVATAR_SHAPES } from '../Shape/shapes';

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

/* ── Static sheet ───────────────────────────────────────────────────────
   The group, its items, the details card and the "+N" list rows were MUI
   Boxes with an sx each; they are plain elements on this sheet now. The
   group's child rules are one class each so that a caller's sx key for the
   same selector can switch the rule off — the old sx object REPLACED the
   group's own rule for that key rather than adding to it. */
const kebab = (k) => (k.startsWith('Webkit') ? '-webkit-' + kebab(k.slice(6).replace(/^./, (c) => c.toLowerCase())) : k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
const cssOf = (sel, obj) => {
  const own = []; const nested = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('@')) nested.push(k + '{' + cssOf(sel, v) + '}');
    else own.push(kebab(k) + ':' + v);
  }
  return (own.length ? sel + '{' + own.join(';') + '}' : '') + nested.join('');
};
registerStaticStyles('omni-avatar-group', [
  '.omni-avg{display:inline-flex;align-items:center}',
  '.omni-avg-step>*:not(:first-of-type){margin-left:var(--_avg-step)}',
  '.omni-avg-ring>*{position:relative;border-radius:50%;box-shadow:0 0 0 2px var(--Background);display:inline-flex}',
  '.omni-avg-shaped>*{position:relative;display:inline-flex;isolation:isolate;box-shadow:none;border-radius:0}',
  '.omni-avg-halo>*::before{content:"";position:absolute;inset:-2px;z-index:-1;background-color:var(--Background)}',
  ...AVATAR_SHAPES.map((sh) => cssOf(`.omni-avg-halo.omni-avg-sh-${sh}>*::before`, shapeStyle(sh))),
  '.omni-avg-front>*:hover,.omni-avg-front>*:focus-within{z-index:1}',
  /* The avatar buttons are circles, as the avatars they hold. Two classes:
     Button's own corner rule weighs one, and its sheet can come later. */
  '.omni-btn.omni-avg-round{border-radius:50%}',
  '.omni-avg-static{display:inline-flex;border-radius:50%}',
  ...Object.entries(BUTTON_HEIGHT).map(([k, h]) => `.omni-avg-static-${k}{width:${h};height:${h}}`),
  '.omni-avg-static>.avatar{width:100%;height:100%}',
  '.omni-avg-static:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-avg-card{display:flex;align-items:center;gap:var(--Sizing-2, 16px);padding:var(--Sizing-1, 8px)}',
  '.omni-avg-card-text{display:flex;flex-direction:column;min-width:0}',
  '.omni-avg-row{display:block;width:100%;text-align:left;border:none;background:transparent;padding:0;margin:0;font:inherit;color:inherit;'
    + 'border-radius:var(--Menu-Item-Radius, 0px)}',
  '.omni-avg-row-click{cursor:pointer}',
  '.omni-avg-row-click:hover{background-color:var(--Hover)}',
  '.omni-avg-row-click:active{background-color:var(--Pressed)}',
  '.omni-avg-row-click:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:-3px}',
  '.omni-avg-row-link{text-decoration:none}',
].join('\n'));

const SxBox = lazySxBox('AvatarGroup');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/** The details card: a large avatar, the name, the detail line. */
function PersonCard({ person, shape }) {
  useStaticStyles('omni-avatar-group');
  return (
    <div className="MuiBox-root omni-avg-card">
      <Avatar size="large" src={person.src} initials={person.initials} alt="" shape={shape} />
      <div className="MuiBox-root omni-avg-card-text">
        {person.name && <Subtitle>{person.name}</Subtitle>}
        {person.detail && <Body>{person.detail}</Body>}
      </div>
    </div>
  );
}

let cardSeq = 0;

/** One avatar in the group, with its ring, its front-on-hover and its card. */
function GroupItem({ person, onPersonClick, buttonSize, buttonVariant, shape }) {
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

  const avatar = <Avatar src={person.src} initials={person.initials} alt="" shape={shape} />;
  const describe = hasCard && open ? idRef.current : undefined;

  return (
    <span className="avatar-group-item MuiBox-root" {...handlers}>
      {target ? (
        <Button ref={ref} contentType="avatar" variant={buttonVariant} size={buttonSize} href={person.href}
          aria-label={person.name || 'Person'} aria-describedby={describe} onClick={click} disabled={person.disabled}
          className="omni-avg-round">
          {avatar}
        </Button>
      ) : (
        <span ref={ref} role="img" tabIndex={hasCard ? 0 : undefined}
          aria-label={person.name || 'Person'} aria-describedby={describe}
          className={'avatar-group-static MuiBox-root omni-avg-static omni-avg-static-' + buttonSize}>
          {avatar}
        </span>
      )}
      {hasCard && (
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={ref.current} placement="bottom-start" arrow
          width="auto" role="tooltip" autoFocus={false} id={idRef.current} theme={null}
          onMouseEnter={show} onMouseLeave={hide}>
          <PersonCard person={person} shape={shape} />
        </Popover>
      )}
    </span>
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
  /* Every avatar's shape (AVATAR_SHAPES); the separating ring follows it. */
  shape,
  className = '',
  sx = {},
  ...props
}) {
  const overflowRef = useRef(null);
  const [listOpen, setListOpen] = useState(false);
  const peopleMode = Array.isArray(people);
  const shaped = Boolean(shape) && shape !== 'circle' && AVATAR_SHAPES.includes(shape);
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

  useStaticStyles('omni-avatar-group');
  /* A caller's sx key for one of the group's child selectors replaced that
     rule outright (it was spread into the same object), so the static rule
     for it is left off and the caller's sx stands alone, as before. */
  const own = (key) => !(sx && typeof sx === 'object' && !Array.isArray(sx) && key in sx);
  const groupClass = 'avatar-group' + (interactive ? ' avatar-group-interactive' : '') + (className ? ' ' + className : '')
    + ' MuiBox-root omni-avg'
    + (own('& > *:not(:first-of-type)') ? ' omni-avg-step' : '')
    + (own('& > *') ? (shaped ? ' omni-avg-shaped' : ' omni-avg-ring') : '')
    + (shaped && own('& > *::before') ? ' omni-avg-halo omni-avg-sh-' + shape : '')
    + (own('& > *:hover, & > *:focus-within') ? ' omni-avg-front' : '');
  const groupProps = {
    role: 'group',
    'aria-label': 'Avatar group, ' + all.length + (all.length === 1 ? ' person' : ' people'),
    className: groupClass,
    ...props,
    style: { '--_avg-step': step, ...props.style },
  };
  const Root = hasSx(sx) ? SxBox : 'div';

  return (
    <Root {...(hasSx(sx) ? { sx } : {})} {...groupProps}>
      {peopleMode
        ? visible.map((p, i) => (
            <GroupItem key={p.key || p.name || i} person={p} onPersonClick={onPersonClick}
              buttonSize={buttonSize} buttonVariant={buttonVariant} shape={shaped ? shape : undefined} />
          ))
        : visible.map((c) => (React.isValidElement(c)
            ? React.cloneElement(c, { ...(c.props.size === undefined && { size }), ...(shaped && c.props.shape === undefined && { shape }) })
            : c))}

      {overflow > 0 && (peopleMode ? (
        <span className="avatar-group-item avatar-group-overflow MuiBox-root">
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
                <a key={p.key || p.name || i} href={p.href} className="avatar-group-row MuiBox-root omni-avg-row omni-avg-row-click omni-avg-row-link"
                  onClick={() => { setListOpen(false); click?.(); }}>
                  <PersonCard person={p} shape={shaped ? shape : undefined} />
                </a>
              );
              return click ? (
                <button key={p.key || p.name || i} type="button" className="avatar-group-row MuiBox-root omni-avg-row omni-avg-row-click"
                  onClick={() => { setListOpen(false); click(); }}>
                  <PersonCard person={p} shape={shaped ? shape : undefined} />
                </button>
              ) : (
                <div key={p.key || p.name || i} className="avatar-group-row MuiBox-root omni-avg-row">
                  <PersonCard person={p} shape={shaped ? shape : undefined} />
                </div>
              );
            })}
          </Popover>
        </span>
      ) : (
        <Avatar initials={'+' + overflow} size={size} color="neutral" defaultPhoto={false} shape={shaped ? shape : undefined} />
      ))}
    </Root>
  );
}

export default AvatarGroup;
