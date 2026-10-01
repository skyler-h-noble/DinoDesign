// src/docs/componentDoc.d.ts
//
// Hand-written because src/docs is JavaScript, like the rest of the library.
//
// The docs started life as TypeScript in the studio. Moving them here meant
// choosing between adding `typescript` to this package — which react-scripts
// pins at ^3 || ^4 as a peer, so it re-resolves the whole tree (see the note in
// tsconfig.dts.json) — or keeping the lib plain JS and declaring the shapes
// once, here. This is the second.
//
// Editors still check the data: each doc carries
//   /** @type {import('./componentDoc').ComponentDoc} */
// so a missing field or a misspelt key is flagged while writing, without a
// build step.

export interface PropDoc {
  name: string;
  type: string;
  values?: string[];
  default: string;
  note?: string;
}

export interface TokenDoc {
  name: string;
  sets: string;
  variesWith: string;
  figma: string;
}

export interface StateDoc {
  state: string;
  /** Who turns it on. */
  setBy: 'prop' | 'interaction' | 'context';
  note?: string;
}

/**
 * One entry per change that BREAKS or silently changes meaning — not a full
 * changelog. `silent` marks the ones where the OLD code still renders, which is
 * the category that costs the most: nothing fails, so nobody finds them from a
 * diff.
 */
export interface ChangeDoc {
  version: string;
  change: string;
  /** What to write instead. Omitted when nothing needs rewriting. */
  migrate?: string;
  /** True when the old code still renders — no build error, no runtime error. */
  silent?: boolean;
}

/** Which mode collection a theming row is about. */
export type ColourCollection = string;

export interface ComponentDoc {
  name: string;
  /** One sentence. What it is for, not what it looks like. */
  summary: string;
  /** The wrong-component errors, which are the commonest kind an agent makes. */
  insteadUse: Array<{ when: string; use: string }>;
  props: PropDoc[];
  states: StateDoc[];
  /**
   * Where the theme goes, in BOTH tools. Two columns because the answers
   * genuinely differ — `data-theme` on an element against a variable mode on
   * one specific node — and an agent asked to theme a component in Figma
   * cannot derive the node from the CSS.
   */
  theming: Array<{ collection: ColourCollection; inCode: string; inFigma: string }>;
  themingNotes?: string[];
  tokens: TokenDoc[];
  composition: string[];
  accessibility: string[];
  gotchas: string[];
  /** Breaking or silent changes, newest first. */
  changes?: ChangeDoc[];
}

export interface FoundationSection {
  title: string;
  /** One line on why this matters, before any detail. */
  lede: string;
  body: string[];
  table?: { head: string[]; rows: string[][] };
  /** The mistake this section prevents. */
  trap?: string;
}

export declare const COLOUR_COLLECTIONS: ReadonlyArray<{ name: string; [k: string]: unknown }>;
export declare const COMPONENT_DOCS: ComponentDoc[];
export declare const FOUNDATIONS: FoundationSection[];
export declare function renderComponentDoc(doc: ComponentDoc, figmaSection?: string): string;
export declare function renderFoundations(): string;
export declare function renderColourSystem(): string;
export declare function docsSlug(component: string): string;
