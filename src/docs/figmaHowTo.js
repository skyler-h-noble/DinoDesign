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
// light/dark and the FAB's color have all been reported that way.
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
//
// `after` names the prop this explains, and the panel renders the entry
// directly beneath that prop's sample. It reads in the order the question
// arrives: here are the colors, here is how you get them. Up by the summary
// it was an instruction for something the reader had not seen yet.
export const FIGMA_HOWTO = {
  Fab: {
    title: 'Changing a FAB’s color',
    after: 'color',
    node: 'Theme-Container',
    collection: 'Theme',
    /* Verified against FAB 6778:14825 rather than taken from the docs, which
       had it as a Buttons mode on the outer frame. The fill is bound to
       Buttons/Default/Button and PINNED there — the Buttons mode is not the
       axis, and setting it on the frame changes nothing. */
    body: 'The FAB’s fill is pinned to Buttons/Default/Button, so the Buttons mode is not the axis — setting it on the frame does nothing. Color comes from the Theme mode on an inner frame called Theme-Container, which changes what Buttons/Default/* resolves to. Select Theme-Container, not the instance.',
    shot: 'The right-hand panel with Theme-Container selected, cropped to the Theme dropdown open on its nine modes.',
    /* Theme has nine modes, Buttons has ten. The tenth is reachable from the
       `color` prop and from nowhere in the design file. */
    caveat: 'Theme has nine modes and the `color` prop has ten: black-white exists in code only, so a FAB built in Figma cannot be that color.',
  },

  Button: {
    title: 'Changing a Button’s color',
    after: 'variantColor',
    node: 'Theme-Button-Fill',
    collection: 'Buttons',
    /* Verified on the Button set (5769:46293). Unlike the FAB, the Button is
       bound to the Buttons collection directly — fill to Buttons::Button,
       stroke to Buttons::Border — so all ten modes are reachable and the code
       and the design agree on the whole list, black-white included. */
    body: 'Fill and border are bound to Buttons::Button and Buttons::Border, so the color is the Buttons mode — all ten of them, and the names match the `variant` values exactly. Set it on Button-Container, not on Theme-Button-Fill.',
    shot: 'The right-hand panel with Button-Container selected, cropped to the Buttons dropdown open on its ten modes.',
    /* The instruction above says Button-Container and not the node whose name
       invites it, which needs saying out loud rather than being quietly right. */
    caveat: 'Theme-Button-Fill is a SIBLING of Button-Contents, not its parent, so a mode set there reaches the fill and border and never reaches the label — Buttons::Text resolves from the ancestor instead, and the button changes color while its text does not. Setting the mode on Button-Container, which is above both, is the working route until the layer is reparented.',
  },
};

export const howToFor = (component) => FIGMA_HOWTO[component] || null;
