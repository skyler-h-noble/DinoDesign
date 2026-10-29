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
import { BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack } from '../Stack/Stack';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/* maxWidth and the placeholder's aspect are per instance: custom properties
   declared on the element, read by the static rules. */
registerStaticStyles('omni-howto', [
  '.omni-howto-frame{width:100%;max-width:var(--_ht-mw);display:block;'
    + 'border-radius:var(--Card-Radius, var(--Style-Border-Radius));border:1px solid var(--Border-Variant)}',
  '.omni-howto-ph{width:100%;max-width:var(--_ht-mw);aspect-ratio:var(--_ht-ar);display:flex;-webkit-box-align:center;align-items:center;'
    + '-webkit-box-pack:center;justify-content:center;background-color:var(--Background);color:var(--Text);'
    + 'border-radius:var(--Card-Radius, var(--Style-Border-Radius));border:2px dashed var(--Border-Variant);'
    + 'padding:24px;text-align:center}',
].join('\n'));

/* MUI's rule for a number in a size key: (0, 1] is a fraction, else px. */
const size = (v) => (typeof v === 'number' ? (v > 0 && v <= 1 ? v * 100 + '%' : v + 'px') : v);

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
  useStaticStyles('omni-howto');
  const mw = { '--_ht-mw': size(maxWidth) };

  if (src && MOVING.test(src)) {
    return <video src={src} controls preload="metadata" playsInline className="MuiBox-root omni-howto-frame" style={mw} />;
  }
  if (src) {
    return <img src={src} alt={title || ''} loading="lazy" className="MuiBox-root omni-howto-frame" style={mw} />;
  }

  /* Dashed, so it cannot be mistaken for an image that failed to load. */
  return (
    <div
      data-surface="Container"
      className="MuiBox-root omni-howto-ph"
      style={{ ...mw, '--_ht-ar': aspect }}
    >
      <VStack gap="var(--Sizing-1)" style={{ alignItems: 'center', maxWidth: 440 }}>
        <EyebrowSmall>Screenshot to capture</EyebrowSmall>
        <BodySmall>{title}</BodySmall>
        {shows && <Caption color="quiet">{shows}</Caption>}
      </VStack>
    </div>
  );
}

export default HowToSlot;
