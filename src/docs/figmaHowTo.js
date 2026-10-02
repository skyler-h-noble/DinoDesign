// src/docs/figmaHowTo.js
//
// "Where is the control in Figma?" — per component, for the cases where the
// answer is not on the instance.
//
// There is one failure behind every entry that will ever go in here. The thing
// that varies is a variable MODE, modes are set on FRAMES, and the frame is
// often INSIDE the component. So someone selects the instance, reads its
// property panel, finds no dropdown for the thing they want, and concludes the
// component does not do it. Component size, the Alt Display treatment,
// light/dark and the FAB's colour have all been reported that way.
//
// A still, not a recording. These pages are read by people using their own
// brand, and the only part of a Figma capture that is the same for all of them
// is the right-hand panel. Put the frame in shot and it is this file's type and
// this file's components — someone else's design, demonstrating a mechanism
// that is meant to be theirs. Cropped to the panel it is brand-neutral, and a
// still is enough: what has to be seen is WHERE the control is, and that does
// not move.
//
// `node` names the layer to select, because selecting the wrong one is the
// whole problem — it is not scene-setting for the screenshot.
export const FIGMA_HOWTO = {
  Fab: {
    title: 'Changing a FAB’s colour',
    node: 'Theme-Container',
    collection: 'Theme',
    /* Verified against FAB 6778:14825 rather than taken from the docs, which
       had it as a Buttons mode on the outer frame. The fill is bound to
       Buttons/Default/Button and PINNED there — the Buttons mode is not the
       axis, and setting it on the frame changes nothing. */
    body: 'The FAB’s fill is pinned to Buttons/Default/Button, so the Buttons mode is not the axis — setting it on the frame does nothing. Colour comes from the Theme mode on an inner frame called Theme-Container, which changes what Buttons/Default/* resolves to. Select Theme-Container, not the instance.',
    shot: 'The right-hand panel with Theme-Container selected, cropped to the Theme dropdown open on its nine modes.',
    /* Theme has nine modes, Buttons has ten. The tenth is reachable from the
       `color` prop and from nowhere in the design file. */
    caveat: 'Theme has nine modes and the `color` prop has ten: black-white exists in code only, so a FAB built in Figma cannot be that colour.',
  },
};

export const howToFor = (component) => FIGMA_HOWTO[component] || null;
