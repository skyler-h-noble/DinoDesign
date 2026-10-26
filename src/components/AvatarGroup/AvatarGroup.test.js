import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AvatarGroup } from './AvatarGroup';

const PEOPLE = [
  { name: 'Ada Lovelace', detail: 'Mathematician', initials: 'AL', onClick: jest.fn() },
  { name: 'Grace Hopper', detail: 'Rear admiral', initials: 'GH', onClick: jest.fn() },
  { name: 'Katherine Johnson', detail: 'NASA', initials: 'KJ' },
  { name: 'Mary Jackson', detail: 'Engineer', initials: 'MJ', onClick: jest.fn() },
  { name: 'Dorothy Vaughan', detail: 'Programmer', initials: 'DV', onClick: jest.fn() },
];

describe('AvatarGroup with people', () => {
  test('a person with onClick is an avatar Button named for them', () => {
    render(<AvatarGroup people={PEOPLE} max={3} />);
    const ada = screen.getByRole('button', { name: 'Ada Lovelace' });
    fireEvent.click(ada);
    expect(PEOPLE[0].onClick).toHaveBeenCalled();
  });

  test('a person without onClick is a focusable, named avatar — not a button', () => {
    render(<AvatarGroup people={PEOPLE} max={3} />);
    const kj = screen.getByRole('img', { name: 'Katherine Johnson' });
    expect(kj).toHaveAttribute('tabindex', '0');
  });

  test('hover shows the details card and describes the avatar with it', () => {
    jest.useFakeTimers();
    render(<AvatarGroup people={PEOPLE} max={3} />);
    const ada = screen.getByRole('button', { name: 'Ada Lovelace' });
    fireEvent.mouseEnter(ada.parentElement);
    const card = screen.getByRole('tooltip');
    expect(card).toHaveTextContent('Ada Lovelace');
    expect(card).toHaveTextContent('Mathematician');
    expect(screen.getByRole('button', { name: 'Ada Lovelace' })).toHaveAttribute('aria-describedby', card.id);
    fireEvent.mouseLeave(ada.parentElement);
    act(() => { jest.runAllTimers(); });
    expect(screen.queryByRole('tooltip')).toBeNull();
    jest.useRealTimers();
  });

  test('"+N" is a Button that opens a list of everyone not shown', () => {
    render(<AvatarGroup people={PEOPLE} max={3} />);
    const more = screen.getByRole('button', { name: /^2 more/ });
    expect(more).toHaveTextContent('+2');
    expect(more).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(more);
    const panel = screen.getByRole('dialog', { name: '2 more people' });
    expect(panel).toHaveTextContent('Mary Jackson');
    expect(panel).toHaveTextContent('Dorothy Vaughan');
    expect(panel).not.toHaveTextContent('Ada Lovelace');
  });

  test('clickable avatars keep 24px showing: the step is capped in CSS', () => {
    const { container } = render(<AvatarGroup people={PEOPLE} max={3} />);
    const g = container.querySelector('.avatar-group');
    const cls = [...g.classList].find((c) => c.startsWith('css-'));
    const css = [...document.styleSheets]
      .flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } })
      .map((r) => r.cssText).filter((t) => t.includes(cls)).join(' ');
    expect(css).toMatch(/margin-left:\s*max\(/);
    expect(css).toContain('24px');
  });
});

describe('AvatarGroup href', () => {
  const LINKS = [
    { name: 'Ada Lovelace', detail: 'Mathematician', href: '/people/ada' },
    { name: 'Grace Hopper', detail: 'Rear admiral', href: '/people/grace' },
    { name: 'Mary Jackson', detail: 'Engineer', href: '/people/mary' },
  ];
  test('a person with href is a link, avatar and row alike', () => {
    render(<AvatarGroup people={LINKS} max={2} />);
    expect(screen.getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute('href', '/people/ada');
    fireEvent.click(screen.getByRole('button', { name: /^1 more/ }));
    const row = screen.getByRole('link', { name: /Mary Jackson/ });
    expect(row).toHaveAttribute('href', '/people/mary');
  });
});
