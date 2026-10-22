// src/components/Charts/colorVision.js
//
// Chart colors for color-vision deficiencies — the code side of the Figma
// library's Color-Blindness collection, and the ONE copy of these values (the
// studio generator imports them from here).
//
// `data-color-vision="<key>"` on any ancestor repaints every chart inside it:
// --Chart-1..10 and --Chart-{Error,Warning,Success,Info}. Without the
// attribute, charts keep the brand palette from the design system's CSS.
//
// The values are the SAME in every brand — chosen for how they read to that
// vision, not for the brand — which is why they live in the library rather
// than in each design system's generated CSS: OmniDesignProvider injects them,
// so an app gets them on a library update, without regenerating its system.
//
// light = Chart-Light-BG (light mode's Surface-Brightest),
// dark  = Chart-DarkBG (Surface-Dimmest, both modes).
// Every color clears 3:1 against #ffffff / #fffcf7 (light) and #121212 /
// #322e25 (dark); see colorVision.test.js.

export const CHART_COLOR_VISION = {
  'red-weak': {
    figma: 'Red-Weak', label: 'Red-weak (protanomaly)',
    series: [['#3a62c7', '#4871e3'], ['#1e455d', '#5c7b8b'], ['#4793bd', '#4ea1cf'], ['#66658e', '#7173af'], ['#a34250', '#c35463'], ['#d07565', '#d07565'], ['#5c7c64', '#5d7f66'], ['#ba77a0', '#ba77a0'], ['#789399', '#789399'], ['#af884e', '#af884e']],
    states: { Error: ['#b91332', '#ef5765'], Warning: ['#da7910', '#c09b1d'], Success: ['#0b673c', '#1cf7e2'], Info: ['#177cc2', '#4c8ff1'] },
  },
  'red-blind': {
    figma: 'Red-Blind', label: 'Red-blind (protanopia)',
    series: [['#060b24', '#ffdbc6'], ['#274f94', '#a1afdd'], ['#3a62c7', '#3679cf'], ['#558be8', '#5790f1'], ['#665b27', '#8d7342'], ['#807532', '#aa8b5b'], ['#9d9151', '#eabe6d'], ['#6170a5', '#86757a'], ['#8988a4', '#9b8c92'], ['#908d8c', '#dcc7cd']],
    states: { Error: ['#b50134', '#f7594c'], Warning: ['#b56e00', '#f9cb31'], Success: ['#01a492', '#70f2e1'], Info: ['#1b8cd9', '#568fe9'] },
  },
  'green-weak': {
    figma: 'Green-Weak', label: 'Green-weak (deuteranomaly)',
    series: [['#060b24', '#4c7fa0'], ['#1c4174', '#4871e3'], ['#558be8', '#ffa4ad'], ['#3a62c7', '#9d6c61'], ['#7f574e', '#b98446'], ['#b98446', '#999947'], ['#767637', '#eabe6d'], ['#9180cd', '#9180cd'], ['#9c839d', '#9c839d'], ['#52406f', '#cbb1f4']],
    states: { Error: ['#993941', '#fe445e'], Warning: ['#c68501', '#fbcb07'], Success: ['#057b57', '#329d70'], Info: ['#3c6cb4', '#40b5f8'] },
  },
  'green-blind': {
    figma: 'Green-Blind', label: 'Green-blind (deuteranopia)',
    series: [['#031021', '#f2b501'], ['#283e78', '#a88022'], ['#6886e5', '#ab9283'], ['#2b67d6', '#5277b8'], ['#5e6383', '#6e8eb4'], ['#8988a4', '#669af7'], ['#8f8d8c', '#7a7588'], ['#807531', '#ffcf81'], ['#9e9050', '#ffefd4'], ['#a08a76', '#97bbff']],
    states: { Error: ['#9c3737', '#cd716c'], Warning: ['#e96f04', '#fbcb07'], Success: ['#16a48e', '#56f5d8'], Info: ['#2e73ca', '#3c92eb'] },
  },
  'blue-weak': {
    figma: 'Blue-Weak', label: 'Blue-weak (tritanomaly)',
    series: [['#3a62c7', '#4871e3'], ['#1e455d', '#3e7fa9'], ['#4793bd', '#4ea1cf'], ['#62649d', '#7173af'], ['#a34250', '#c35463'], ['#d07565', '#dc7b6a'], ['#5c7c64', '#5d7f66'], ['#ba77a0', '#ba77a0'], ['#789399', '#789399'], ['#767637', '#7b7b38']],
    states: { Error: ['#a7283b', '#fe445e'], Warning: ['#b18e07', '#fbcb07'], Success: ['#026835', '#1efabd'], Info: ['#7090dd', '#238cfa'] },
  },
  'blue-blind': {
    figma: 'Blue-Blind', label: 'Blue-blind (tritanopia)',
    series: [['#041214', '#388188'], ['#1c484d', '#648184'], ['#357f88', '#67989b'], ['#67989b', '#bee1e3'], ['#85959f', '#81757f'], ['#59373a', '#998e96'], ['#94686c', '#c35453'], ['#a24443', '#a5686d'], ['#d17377', '#d17377'], ['#d33635', '#debbc7']],
    states: { Error: ['#a42e2e', '#f94e3a'], Warning: ['#aa8f4a', '#e5c475'], Success: ['#3d6325', '#28ff44'], Info: ['#4094f4', '#6e8acf'] },
  },
  'blue-cone': {
    figma: 'Blue-Cone', label: 'Blue-cone monochromacy',
    series: [['#d33635', '#9a5ede'], ['#06737e', '#3383b2'], ['#67989b', '#48befe'], ['#6e6194', '#dbc55a'], ['#775161', '#cc5465'], ['#a082a8', '#d07565'], ['#1a4f1f', '#61846a'], ['#d17377', '#fa8dd2'], ['#8750c7', '#789399'], ['#9e9050', '#8c843c']],
    states: { Error: ['#a8282b', '#cb7366'], Warning: ['#ad8f3a', '#eab670'], Success: ['#287c29', '#a7f175'], Info: ['#2883ca', '#1facf7'] },
  },
};

export const COLOR_VISIONS = Object.keys(CHART_COLOR_VISION);

const STATES = ['Error', 'Warning', 'Success', 'Info'];
const GROUNDS = ['Surface-Brightest', 'Surface-Dimmest'];

/**
 * The CSS for every set on the two chart grounds. Surface-Brightest takes the
 * light half, Surface-Dimmest the dark. Two selectors per block — the ground
 * inside an element carrying the attribute, and the ground element carrying
 * it itself — both more specific than a design system's bare
 * [data-surface] chart block, so load order does not matter.
 */
export function chartColorVisionCSS(levels = GROUNDS) {
  const out = ['/* Chart colors per color-vision preference — data-color-vision on any ancestor. */'];
  for (const [attr, set] of Object.entries(CHART_COLOR_VISION)) {
    for (const level of levels) {
      const i = level === 'Surface-Brightest' ? 0 : 1;
      out.push(`[data-color-vision="${attr}"] [data-surface="${level}"], [data-color-vision="${attr}"][data-surface="${level}"] {`);
      set.series.forEach((pair, n) => out.push(`  --Chart-${n + 1}: ${pair[i]};`));
      for (const st of STATES) out.push(`  --Chart-${st}: ${set.states[st][i]};`);
      out.push('}');
    }
  }
  return out.join('\n') + '\n';
}
