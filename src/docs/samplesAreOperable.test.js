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
  /* The lead example is now the two components SIDE BY SIDE, because the
     difference between them is what a reader comes to that page for. So the
     assertion is the difference itself: the ButtonGroup half has no selection
     to move, and the ToggleButtonGroup half does. This used to click a segment
     of the ButtonGroup and expect aria-pressed to follow, which is exactly the
     reading the split was meant to end. */
  it('the lead example shows a group with no selection beside one with', () => {
    const { container } = render(
      <div>{EXAMPLES.ButtonGroup({ theme: null, surface: 'Surface' })}</div>);

    const pressable = Array.from(container.querySelectorAll('button[aria-pressed]'));
    expect(pressable.length).toBeGreaterThan(0);
    /* ONE PER GROUP, not one on the page: the toggle half shows a joined group
       and a separated one, which is the set's real axis and both halves of
       what the component is. */
    const groups = Array.from(container.querySelectorAll('[role="group"], [role="radiogroup"]'))
      .filter(g => g.querySelector('button[aria-pressed]'));
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) {
      const on = Array.from(g.querySelectorAll('button[aria-pressed="true"]'));
      expect(on).toHaveLength(1);
    }

    // The action half's buttons are peers: clickable, never pressed.
    const actions = ['Save', 'Duplicate', 'Delete']
      .map(n => screen.getByRole('button', { name: n }));
    for (const b of actions) expect(b).not.toHaveAttribute('aria-pressed');

    fireEvent.click(actions[1]);
    for (const b of actions) expect(b).not.toHaveAttribute('aria-pressed');
  });

  it('the toggle half of the lead example moves its selection', () => {
    render(<div>{EXAMPLES.ToggleButtonGroup({ theme: null, surface: 'Surface' })}</div>);
    const [left, center] = ['Left', 'Center']
      .map(n => screen.getByRole('button', { name: n }));
    expect(left).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(center);

    expect(screen.getByRole('button', { name: 'Center' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Left' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  /* The disabled sample lives on both components now. ButtonGroup's version
     is about a segment you cannot press at all; the selection case moved to
     ToggleButtonGroup, which is the component that has one. */
  it('the disabled ButtonGroup sample leaves its enabled segments clickable', () => {
    const { container } = render(
      <div>{PROP_EXAMPLES.ButtonGroup.disabled({ theme: null, surface: 'Surface' })}</div>);
    const buttons = Array.from(container.querySelectorAll('button'));
    const enabled = buttons.filter(b => !b.disabled);
    expect(enabled.length).toBeGreaterThan(0);
    for (const b of enabled) fireEvent.click(b);   // must not throw
  });

  it('the disabled ToggleButtonGroup sample still moves on its enabled segments', () => {
    const { container } = render(
      <div>{PROP_EXAMPLES.ToggleButtonGroup.disabled({ theme: null, surface: 'Surface' })}</div>);
    /* The last group in that sample is the one with a single disabled
       segment; the group around it must still move. */
    const groups = container.querySelectorAll('[role="group"], [role="radiogroup"]');
    const last = groups[groups.length - 1];
    const buttons = Array.from(last.querySelectorAll('button'));
    const movable = buttons.find(b => !b.disabled && b.getAttribute('aria-pressed') === 'false');
    // the sample must actually contain a disabled segment, or this proves nothing
    expect(buttons.some(b => b.disabled)).toBe(true);
    expect(movable).toBeTruthy();
    fireEvent.click(movable);
    expect(movable).toHaveAttribute('aria-pressed', 'true');
  });

  it('the dismissible chip actually dismisses', () => {
    render(<div>{EXAMPLES.Chip({ theme: null, surface: 'Surface' })}</div>);
    expect(screen.getByText('Dismissible')).toBeInTheDocument();
    const del = screen.getByRole('button', { name: /delete|dismiss|remove/i });
    fireEvent.click(del);
    expect(screen.queryByText('Dismissible')).toBeNull();
  });
});
