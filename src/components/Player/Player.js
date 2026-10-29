// src/components/Player/Player.js
//
// Media transport: where you are in it, and the controls to move.
//
// Figma's Player (10327:5421), a component now rather than the 400x32 sketch
// this was first built from:
//
//   Scrubber   a small Slider (the 4px track, its thumb overflowing) directly
//              over two times — elapsed at the left, time REMAINING at the
//              right ("-1:23") — in Mobile Nav Label, Quiet
//   Controls   previous · back 10s · play / pause · forward 10s · next,
//              spread across the row; play / pause is the one solid
//              (default) button, the rest are ghost
//   Layout     Sizing-1 padding, Sizing-3 between scrubber and controls
//
// COMPOSED, NOT DRAWN. Slider, Button and Typography arranged — no new
// primitive, so the focus rings, states and colors are the real ones.
//
// THE CONTROLS ARE ACTIONS, so they are a plain row of buttons. Figma lays
// them out in a ToggleButtonGroup, but a toggle group tells a screen reader
// its buttons are on / off with one selected, which these are not.
//
// TIME IS NOT A SLIDER LABEL. A bubble over the thumb is right for a value
// you are choosing and wrong for a clock you are reading: it moves, covers the
// track and vanishes when you let go. The times sit still under the scrubber.
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '../Button';
import { Slider } from '../Slider';
import { Body, Caption, MobileNavLabel } from '../Typography';

import PlayArrowIcon from '@omni-design/icons/PlayArrow';
import PauseIcon from '@omni-design/icons/Pause';
import SkipPreviousIcon from '@omni-design/icons/SkipPrevious';
import SkipNextIcon from '@omni-design/icons/SkipNext';
import Replay10Icon from '@omni-design/icons/Replay10';
import Forward10Icon from '@omni-design/icons/Forward10';

/**
 * Seconds as m:ss, or h:mm:ss once it runs past an hour.
 *
 * Written out rather than taken from Intl, because `Intl.NumberFormat` cannot
 * do it and `Date` would need a timezone to not matter — and a track is a
 * DURATION, not a time of day. The hour branch exists because a podcast is the
 * ordinary case for a player like this, and 73:04 is not a readable number.
 */
export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/* Artwork per size: the height of the title and subtitle it sits beside. */
const ARTWORK = { small: 40, medium: 48, large: 56 };
let warnedInitials = false;

export function Player({
  /* Optional "now playing" line above the scrubber. Figma's Player has none;
     kept so callers of the earlier audio bar still get their title. */
  title,
  subtitle,
  /* ARTWORK, not a person: a rounded square, as every music and podcast
     player draws the cover. `imageAlt` describes it; with none it is named
     from the title. `avatarSrc` is the old name and still works. */
  imageSrc,
  imageAlt,
  avatarSrc,
  /* RETIRED. Initials say "a person"; a track has no initials. Ignored, with
     a one-time warning in development. */
  avatarInitials,

  /* Controlled or not, the same as every other input here. `position` with no
     `onSeek` is a player you can watch and not scrub, which is a real thing —
     a preview, a disabled state — rather than a bug. */
  position,
  defaultPosition = 0,
  duration = 0,
  onSeek,

  playing,
  defaultPlaying = false,
  onPlayPause,

  /* Absent means the button is not there. A player with no previous track
     should not show a dead skip button, and judging that from the outside is
     something only the caller can do. */
  onPrevious,
  onNext,
  /* Back / forward by skipSeconds: onSkip(-10) and onSkip(10). Absent, the
     two buttons are not there. */
  onSkip,
  skipSeconds = 10,

  variant = 'default',
  size = 'medium',
  disabled = false,

  showTime = true,
  className = '',
  sx = {},
  'aria-label': ariaLabel = 'Audio player',
  ...props
}) {
  const [innerPos, setInnerPos] = useState(defaultPosition);
  const [innerPlaying, setInnerPlaying] = useState(defaultPlaying);

  const isControlledPos = position !== undefined;
  const isControlledPlay = playing !== undefined;
  const pos = Math.min(Math.max(0, isControlledPos ? position : innerPos), Math.max(duration, 0));
  const isPlaying = isControlledPlay ? playing : innerPlaying;

  const seek = (_e, v) => {
    const next = Array.isArray(v) ? v[0] : v;
    if (!isControlledPos) setInnerPos(next);
    onSeek?.(next);
  };

  const skip = (delta) => {
    const next = Math.min(Math.max(0, pos + delta), duration);
    if (!isControlledPos) setInnerPos(next);
    onSkip?.(delta);
  };

  const togglePlay = () => {
    if (!isControlledPlay) setInnerPlaying(!isPlaying);
    onPlayPause?.(!isPlaying);
  };

  const artwork = imageSrc || avatarSrc;
  if (avatarInitials && process.env.NODE_ENV !== 'production' && !warnedInitials) {
    warnedInitials = true;
    // eslint-disable-next-line no-console
    console.warn('[Player] avatarInitials is retired: the player shows artwork, not a person. Pass imageSrc.');
  }
  const hasMeta = Boolean(title || subtitle || artwork);

  const control = (key, name, icon, onClick, solid = false) => (
    <Button key={key} variant={solid ? variant : 'ghost'} size={size} iconOnly disabled={disabled}
            onClick={onClick} aria-label={name} className={'player-control player-' + key}>
      {icon}
    </Button>
  );

  return (
    <Box
      className={'player ' + className}
      role="group"
      aria-label={ariaLabel}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--Sizing-3, 24px)',
        padding: 'var(--Sizing-1, 8px)',
        boxSizing: 'border-box',
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {hasMeta && (
        <Box className="player-meta" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)', minWidth: 0 }}>
          {artwork && (
            <Box component="img" className="player-artwork" src={artwork}
                 alt={imageAlt ?? (title ? `Artwork for ${title}` : '')}
                 sx={{
                   /* As tall as the title and subtitle beside it, per size. */
                   width: ARTWORK[size] || ARTWORK.medium, height: ARTWORK[size] || ARTWORK.medium,
                   flexShrink: 0, objectFit: 'cover', display: 'block',
                   /* The brand's corner, capped: a pill brand's 34px would
                      round a 48px cover into a circle — an avatar again. */
                   borderRadius: 'min(var(--Style-Border-Radius, 4px), 8px)',
                 }} />
          )}
          {/* minWidth:0, or a long title refuses to shrink: a flex item's
              default min-width is its content, the whole string. */}
          {/* Start-aligned whatever the page's text-align: in a centred
              container the title and subtitle centred against each other. */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'start' }}>
            {title && <Body style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Body>}
            {subtitle && <Caption color="quiet" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</Caption>}
          </Box>
        </Box>
      )}

      <Box className="player-scrubber" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Slider
          variant={variant}
          size="small"
          disabled={disabled || !onSeek}
          min={0}
          max={Math.max(duration, 1)}
          value={pos}
          onChange={seek}
          valueLabelDisplay="off"
          aria-label="Seek"
          /* The slider announces a position in a track, not a number out of
             186. Without this a screen reader reads "42" and leaves the
             listener to work out what that is. */
          getAriaValueText={(v) => formatTime(v) + ' of ' + formatTime(duration)}
          /* Just the track (4px), as Figma's Player draws the slider: the
             thumb (still a 24px target) overflows it, and the times sit
             directly under the track. MUI pads the track 13px a side. */
          sx={{ width: '100%', padding: '0 !important' }}
        />
        {showTime && (
          /* tabular-nums, so the times do not shuffle every time a digit
             changes — the one thing that makes a running clock look broken. */
          <Box className="player-times" sx={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--Sizing-2, 16px)', fontVariantNumeric: 'tabular-nums' }}>
            {/* Figma's plain "Mobile Nav Label" style binds Body-Font-Weight;
                MobileNavLabel is the NAV label, whose weight token is 600. */}
            <MobileNavLabel component="span" color="quiet" className="player-elapsed"
                            sx={{ fontWeight: 'var(--Body-Font-Weight, 400)' }}>{formatTime(pos)}</MobileNavLabel>
            <MobileNavLabel component="span" color="quiet" className="player-remaining"
                            sx={{ fontWeight: 'var(--Body-Font-Weight, 400)' }}
                            aria-label={formatTime(duration - pos) + ' remaining'}>
              {'-' + formatTime(duration - pos)}
            </MobileNavLabel>
          </Box>
        )}
      </Box>

      {/* Spread across the row, each button its own 32 — Figma's group. */}
      {/* Spread when there are several; a lone play / pause sits centred
          (Figma's Controls = 1) — space-between would pin it to the left. */}
      <Box className="player-controls" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        '& > :only-child': { marginInline: 'auto' } }}>
        {onPrevious && control('previous', 'Previous track', <SkipPreviousIcon />, onPrevious)}
        {onSkip && control('back', `Back ${skipSeconds} seconds`, <Replay10Icon />, () => skip(-skipSeconds))}
        {/* The one control that is always here, and the only one that says what
            it will DO rather than what is happening: "Play" when paused. */}
        {control('play', isPlaying ? 'Pause' : 'Play', isPlaying ? <PauseIcon /> : <PlayArrowIcon />, togglePlay, true)}
        {onSkip && control('forward', `Forward ${skipSeconds} seconds`, <Forward10Icon />, () => skip(skipSeconds))}
        {onNext && control('next', 'Next track', <SkipNextIcon />, onNext)}
      </Box>
    </Box>
  );
}

export default Player;
