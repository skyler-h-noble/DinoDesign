// src/components/_webkitBox.js
//
// Emotion's prefixer wrote a legacy -webkit-box twin beside every flex
// alignment: align-items -> -webkit-box-align, justify-content ->
// -webkit-box-pack. Chrome still computes both properties, so a static sheet
// that omits them differs from the emotion output it replaces, even though
// they only act on display:-webkit-box. This adds the same twins, with
// emotion's value mapping (box-pack drops flex- and calls space-between
// justify), so a converted component computes exactly what it did.
import { registerStaticStyles } from './_staticStyles';

export function webkitBox(css) {
  return css
    .replace(/(^|[;{\s])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
    .replace(/(^|[;{\s])justify-content:([^;}]+)/g, (m, p, v) =>
      `${p}-webkit-box-pack:${v.trim().replace(/^flex-/, '').replace(/^space-between$/, 'justify')};justify-content:${v}`);
}

/** registerStaticStyles, with the -webkit-box twins added. */
export function registerBoxStyles(id, css) {
  registerStaticStyles(id, webkitBox(css));
}
