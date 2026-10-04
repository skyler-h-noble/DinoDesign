/**
 * A control in a sample has to actually work.
 *
 * ButtonGroup's lead example was `value="a" onChange={() => {}}` — controlled
 * with a no-op. That is worse than leaving it uncontrolled: the segment takes
 * the click, reports nothing, and the group never moves. A sample that looks
 * interactive and is not teaches that the COMPONENT is broken, which is the
 * opposite of what a sample is for.
 *
 * Two checks, because they catch different things. The source check finds the
 * shape — a no-op handler — anywhere in the doc samples. The behaviour check
 * clicks a real selectable control and asserts the selection moved, which
 * catches a sample that is wired but wired wrongly.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import { EXAMPLES, PROP_EXAMPLES } from './examples';

const FILES = ['examples.js', 'examples.lead.js', 'samples.core.js', 'samples.forms.js',
               'samples.nav.js', 'samples.surfaces.js', 'samples.slider.js',
               'samples.buttongroup.js'];

describe('no dead controls', () => {
  /* `onDelete`/`onClose`/`onClick` handlers that do nothing are sometimes
     legitimate — dismissing a lead example's Alert has nowhere to go. The
     ones that are never legitimate are SELECTION handlers: onChange with a
     controlled `value` is the shape that silently freezes a control. */
  /* Comments are stripped first. The comment above the fixed ButtonGroup
     example QUOTES the broken shape to explain it, and a scan that counted
     that would make describing a bug impossible without failing the test. */
  const stripComments = (src) => src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  it.each(FILES)('%s has no no-op onChange', (file) => {
    const p = path.join(__dirname, file);
    if (!fs.existsSync(p)) return;
    const src = stripComments(fs.readFileSync(p, 'utf8'));
    const hits = [...src.matchAll(/onChange=\{\(\)\s*=>\s*\{\s*\}\}/g)];
    expect(hits.map(() => 'no-op onChange')).toEqual([]);
  });

  /* Guards the guard: if stripComments ate the whole file, every case above
     would pass on nothing. */
  it('still sees code after stripping comments', () => {
    const src = stripComments(
      fs.readFileSync(path.join(__dirname, 'examples.js'), 'utf8'));
    expect(src).toContain('export const EXAMPLES');
    expect(src).toContain('ButtonGroupExample');
  });
});

describe('the ButtonGroup samples respond', () => {
  it('the lead example moves its selection', () => {
    render(<div>{EXAMPLES.ButtonGroup({ theme: null, surface: 'Surface' })}</div>);
    const week = screen.getByRole('button', { name: 'Week' });
    const day = screen.getByRole('button', { name: 'Day' });
    expect(day).toHaveAttribute('aria-pressed', 'true');
    expect(week).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(week);

    expect(screen.getByRole('button', { name: 'Week' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Day' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('the disabled sample still works on its enabled segments', () => {
    const { container } = render(
      <div>{PROP_EXAMPLES.ButtonGroup.disabled({ theme: null, surface: 'Surface' })}</div>);
    /* The last group in that sample is the one with a single disabled
       segment; the group around it must still move. */
    const groups = container.querySelectorAll('[role="group"], [role="radiogroup"]');
    const last = groups[groups.length - 1];
    const buttons = Array.from(last.querySelectorAll('button'));
    const month = buttons.find(b => b.textContent.includes('Month'));
    expect(month).toBeTruthy();
    fireEvent.click(month);
    expect(month).toHaveAttribute('aria-pressed', 'true');
  });

  it('the dismissible chip actually dismisses', () => {
    render(<div>{EXAMPLES.Chip({ theme: null, surface: 'Surface' })}</div>);
    expect(screen.getByText('Dismissible')).toBeInTheDocument();
    const del = screen.getByRole('button', { name: /delete|dismiss|remove/i });
    fireEvent.click(del);
    expect(screen.queryByText('Dismissible')).toBeNull();
  });
});
