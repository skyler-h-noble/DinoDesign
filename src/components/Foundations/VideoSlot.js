// src/components/Foundations/VideoSlot.js
//
// A video, or a marked gap where one should be.
//
// Every confusion worth filming in this system has the same shape: a variable
// MODE set on a FRAME that looks, from the component, like a missing feature.
// Component size, Alt Display, light/dark and Menu-Levels all failed that way,
// and in each case the person looked for a control on the instance, found
// none, and concluded the thing had one state.
//
// Prose keeps losing to that because the misunderstanding is structural rather
// than factual — a correct sentence does not dislodge a wrong mental model.
// Ten seconds of pointing at the mode selector does.
//
// The placeholder is deliberate and visible rather than a TODO in a comment:
// a gap nobody can see is a gap nobody fills, and this page is read by the
// people who could record it.
import React from 'react';
import { Box } from '@mui/material';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack } from '../Stack/Stack';

/**
 * @param src    path under public/, e.g. "/videos/component-size.mp4".
 *               Omit it to render the placeholder.
 * @param title  what the video shows, in a few words.
 * @param shows  one line on what the viewer should come away knowing.
 */
export function VideoSlot({ src, title, shows }) {
  if (src) {
    return (
      <Box
        component="video"
        src={src}
        controls
        preload="metadata"
        playsInline
        sx={{
          width: '100%', maxWidth: 820, display: 'block',
          borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
          border: '1px solid var(--Border-Variant)',
        }}
      />
    );
  }

  return (
    <Box
      data-surface="Container"
      sx={{
        width: '100%', maxWidth: 820,
        aspectRatio: '16 / 9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
        /* Dashed, so it cannot be mistaken for a player that failed to load. */
        border: '2px dashed var(--Border-Variant)',
        p: 3, textAlign: 'center',
      }}
    >
      <VStack gap="var(--Sizing-1)" style={{ alignItems: 'center', maxWidth: 440 }}>
        <EyebrowSmall>Video to record</EyebrowSmall>
        <BodySmall>{title}</BodySmall>
        {shows && <Caption color="quiet">{shows}</Caption>}
      </VStack>
    </Box>
  );
}

export default VideoSlot;
