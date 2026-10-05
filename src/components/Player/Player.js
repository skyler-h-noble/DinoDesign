// src/components/Player/Player.js
//
// An audio player bar: who is playing, the transport, and where you are in it.
//
// COMPOSED, NOT DRAWN. Every part of this is an existing component — Avatar,
// Button, Slider, Typography — arranged. There is no new primitive here and
// there should not be: a player that drew its own round button would be a
// second button, with its own focus ring to keep in step with the real one.
//
// Figma's Player page is a 400x32 sketch rather than a component set: a
// ToggleButtonGroup, a Slider and an icon Button in a row 554px wide inside a
// 400px box, with placeholder text. So this is built to the SHAPE that sketch
// points at rather than matched to it variant by variant, and the pieces it
// uses are the ones the file reached for.
//
// TIME IS NOT A SLIDER LABEL. MUI's valueLabelDisplay puts a bubble over the
// thumb, which is right for a value you are choosing and wrong for a clock you
// are reading: it moves, it covers the track, and it vanishes when you let go.
// Elapsed and total sit either side of the scrubber, where they stay still and
// can be read at a glance.
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Slider } from '../Slider';
import { Body, Caption } from '../Typography';
import { HStack, VStack } from '../Stack';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

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

export function Player({
  title,
  subtitle,
  avatarSrc,
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
  const pos = isControlledPos ? position : innerPos;
  const isPlaying = isControlledPlay ? playing : innerPlaying;

  const seek = (_e, v) => {
    const next = Array.isArray(v) ? v[0] : v;
    if (!isControlledPos) setInnerPos(next);
    onSeek?.(next);
  };

  const togglePlay = () => {
    if (!isControlledPlay) setInnerPlaying(!isPlaying);
    onPlayPause?.(!isPlaying);
  };

  const hasMeta = Boolean(title || subtitle || avatarSrc || avatarInitials);

  return (
    <HStack
      className={'player ' + className}
      gap="var(--Sizing-2)"
      role="group"
      aria-label={ariaLabel}
      style={{ alignItems: 'center', width: '100%' }}
      sx={sx}
      {...props}
    >
      {hasMeta && (
        <HStack gap="var(--Sizing-1)" style={{ alignItems: 'center', minWidth: 0 }}>
          {(avatarSrc || avatarInitials) && (
            <Avatar src={avatarSrc} initials={avatarInitials} size={size}
                    alt={title ? `Artwork for ${title}` : undefined} />
          )}
          {/* minWidth:0 on both, or a long title refuses to shrink and pushes
              the scrubber off the end — the default min-width of a flex item is
              its content, which for text is the whole string. */}
          <VStack gap="0" style={{ minWidth: 0 }}>
            {title && (
              <Body style={{ whiteSpace: 'nowrap', overflow: 'hidden',
                             textOverflow: 'ellipsis' }}>{title}</Body>
            )}
            {subtitle && (
              <Caption color="quiet" style={{ whiteSpace: 'nowrap', overflow: 'hidden',
                                              textOverflow: 'ellipsis' }}>{subtitle}</Caption>
            )}
          </VStack>
        </HStack>
      )}

      <HStack gap="var(--Sizing-Half)" style={{ alignItems: 'center', flexShrink: 0 }}>
        {onPrevious && (
          <Button variant={variant} size={size} iconOnly disabled={disabled}
                  onClick={onPrevious} aria-label="Previous track">
            <SkipPreviousIcon />
          </Button>
        )}
        {/* The one control that is always here, and the only one that says what
            it will DO rather than what is happening: the label is "Play" when
            paused. A button named for the current state tells you where you
            are and not what pressing it gets you. */}
        <Button variant={variant} size={size} iconOnly disabled={disabled}
                onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
        {onNext && (
          <Button variant={variant} size={size} iconOnly disabled={disabled}
                  onClick={onNext} aria-label="Next track">
            <SkipNextIcon />
          </Button>
        )}
      </HStack>

      <HStack gap="var(--Sizing-1)" style={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
        {showTime && (
          /* tabular-nums, so the track does not shuffle sideways every time a
             digit changes — the one thing that makes a running clock look
             broken. */
          <Caption color="quiet" style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {formatTime(pos)}
          </Caption>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Slider
            variant={variant}
            size={size}
            disabled={disabled || !onSeek}
            min={0}
            max={Math.max(duration, 1)}
            value={pos}
            onChange={seek}
            aria-label="Seek"
            /* The slider announces a position in a track, not a number out of
               186. Without this a screen reader reads "42" and leaves the
               listener to work out what that is. */
            getAriaValueText={(v) => formatTime(v) + ' of ' + formatTime(duration)}
          />
        </Box>
        {showTime && (
          <Caption color="quiet" style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {formatTime(duration)}
          </Caption>
        )}
      </HStack>
    </HStack>
  );
}

export default Player;
