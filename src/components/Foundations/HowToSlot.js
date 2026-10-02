// src/components/Foundations/HowToSlot.js
//
// A how-to image (or video), or a marked gap where one should be.
//
// Every confusion worth illustrating in this system has the same shape: a
// variable MODE set on a FRAME that looks, from the component, like a missing
// feature. Component size, Alt Display, light/dark and Menu-Levels all failed
// that way, and in each case the person looked for a control on the instance,
// found none, and concluded the thing had one state.
//
// Prose keeps losing to that because the misunderstanding is structural rather
// than factual — a correct sentence does not dislodge a wrong mental model.
// One picture of the mode selector does.
//
// STILLS, NOT FILM, and the reason is not effort. These pages are read by
// people using their OWN brand, and the only part of a Figma recording that is
// the same for all of them is Figma's right-hand panel. The moment the frame is
// in shot it is this file's type and this file's components — someone else's
// design, demonstrating a mechanism that is supposed to be theirs. Crop to the
// panel and the shot is brand-neutral, which is also why a still is enough:
// what has to be seen is WHERE the control is, and that does not move.
//
// The placeholder is deliberate and visible rather than a TODO in a comment:
// a gap nobody can see is a gap nobody fills, and this page is read by the
// people who could capture it.
import React from 'react';
import { Box } from '@mui/material';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack } from '../Stack/Stack';

const MOVING = /\.(mp4|mov|webm)$/i;

/**
 * @param src     path under public/, e.g. "/images/figma-surface-mode.png".
 *                Omit it to render the placeholder. A .mp4/.mov/.webm plays.
 * @param title   what the shot should show, in a few words.
 * @param shows   one line on what the viewer should come away knowing.
 * @param aspect  placeholder shape. Panel crops are tall; default suits them.
 * @param maxWidth cap in px. Panel crops are narrow, so the default is too.
 */
export function HowToSlot({ src, title, shows, aspect = '4 / 3', maxWidth = 560 }) {
  const frame = {
    width: '100%', maxWidth, display: 'block',
    borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
    border: '1px solid var(--Border-Variant)',
  };

  if (src && MOVING.test(src)) {
    return <Box component="video" src={src} controls preload="metadata" playsInline sx={frame} />;
  }
  if (src) {
    return <Box component="img" src={src} alt={title || ''} loading="lazy" sx={frame} />;
  }

  return (
    <Box
      data-surface="Container"
      sx={{
        width: '100%', maxWidth, aspectRatio: aspect,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
        /* Dashed, so it cannot be mistaken for an image that failed to load. */
        border: '2px dashed var(--Border-Variant)',
        p: 3, textAlign: 'center',
      }}
    >
      <VStack gap="var(--Sizing-1)" style={{ alignItems: 'center', maxWidth: 440 }}>
        <EyebrowSmall>Screenshot to capture</EyebrowSmall>
        <BodySmall>{title}</BodySmall>
        {shows && <Caption color="quiet">{shows}</Caption>}
      </VStack>
    </Box>
  );
}

export default HowToSlot;
