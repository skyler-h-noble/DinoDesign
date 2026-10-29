// src/components/ImagePlaceholder/ImagePlaceholder.js
import React from 'react';
import ImageIcon from '@omni-design/icons/Image';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('ImagePlaceholder');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

registerBoxStyles('omni-image-placeholder', [
  '.omni-image-placeholder{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;'
    + 'background-color:var(--Border-Variant);color:var(--Quiet);overflow:hidden;container-type:size}',
  // The shorter side less a pixel each edge, as the file draws it.
  '.omni-image-placeholder .image-placeholder-icon{width:calc(min(100cqw, 100cqh) - 2px);height:calc(min(100cqw, 100cqh) - 2px);color:inherit}',
].join('\n'));

/**
 * ImagePlaceholder — Figma's `Image Placeholder` (7251:1985): where an image
 * will go, before it has one.
 *
 *   fill   --Border-Variant (the file's Border-Variant at 20%; the CSS token
 *          carries that alpha), a light tint of the surface
 *   icon   the photo glyph in --Quiet, as large as the box allows — the
 *          shorter side less a pixel each edge, centred — so the slot reads as
 *          "an image goes here" at any size
 *
 * It fills its parent; give the parent the size (or use Ratio, which uses
 * this for an empty slot). Decorative: aria-hidden, since the empty slot says
 * nothing a screen reader needs. Pass role="img" + aria-label if the absence
 * itself is information ("No photo uploaded").
 */
export function ImagePlaceholder({ className = '', sx, ...props }) {
  useStaticStyles('omni-image-placeholder');
  const labelled = props['aria-label'] || props['aria-labelledby'];
  const root = {
    className: 'image-placeholder ' + className + ' MuiBox-root omni-image-placeholder',
    'aria-hidden': labelled ? undefined : 'true',
    ...props,
  };
  const icon = <ImageIcon className="image-placeholder-icon" />;
  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{icon}</SxBox>;
  return <div {...root}>{icon}</div>;
}

export default ImagePlaceholder;
