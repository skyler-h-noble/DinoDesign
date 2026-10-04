/**
 * A block comment in JSX is CONTENT unless it is wrapped in braces.
 *
 * `/` + `*` ... written between two JSX tags without the surrounding braces
 * is a string child, not a comment. React renders it. Table had one: the
 * whole footer rationale — twelve lines explaining why the footer is kept
 * during loading — was being emitted into every table as a text node. It was
 * only noticed because a text node is invalid directly inside a table element
 * and React warned about THAT; in a div it would have shipped silently and
 * been visible on the page.
 *
 * Rendering everything and looking for the tell-tale characters catches the
 * whole class rather than the one instance. Comment markers are not something
 * a real label contains, so a hit is a leak.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { EXAMPLES, PROP_EXAMPLES } from './examples';

/** Every text node under a tree, with its owning element. */
function textNodes(root) {
  const out = [];
  const walk = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        const v = String(child.nodeValue || '');
        if (v.trim()) out.push({ text: v, parent: node.nodeName });
      } else {
        walk(child);
      }
    }
  };
  walk(root);
  return out;
}

const MARKERS = ['/*', '*/'];

describe('no JSX comment reaches the DOM', () => {
  const cases = [
    ...Object.entries(EXAMPLES).map(([name, fn]) => [`example ${name}`, fn]),
    ...Object.entries(PROP_EXAMPLES).flatMap(([c, s]) =>
      Object.entries(s).map(([p, fn]) => [`${c}.${p}`, fn])),
  ];

  it.each(cases)('%s', (_name, fn) => {
    const { container } = render(<div>{fn({ theme: null, surface: 'Surface' })}</div>);
    const leaks = textNodes(container)
      .filter(n => MARKERS.some(m => n.text.includes(m)))
      .map(n => `<${n.parent}> got: ${n.text.trim().slice(0, 80)}`);
    expect(leaks).toEqual([]);
  });

  /* Guards the guard: without this, a `textNodes` that returned nothing would
     make every case above pass. */
  it('finds a comment when there is one', () => {
    const { container } = render(
      <div><span>{'/* not a comment, a string */'}</span></div>);
    const found = textNodes(container).filter(n => MARKERS.some(m => n.text.includes(m)));
    expect(found.length).toBe(1);
  });
});
