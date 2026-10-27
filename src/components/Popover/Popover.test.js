import React, { useRef, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Popover } from './Popover';

function Harness({ initialOpen = false, ...props }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <button ref={ref} onClick={() => setOpen((o) => !o)}>Anchor</button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} aria-label="Panel" {...props}>
        <button>Inside</button>
      </Popover>
    </>
  );
}

describe('Popover', () => {
  test('renders nothing when closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('opens as a named dialog in a portal', () => {
    const { container } = render(<Harness initialOpen />);
    const dlg = screen.getByRole('dialog', { name: 'Panel' });
    expect(container.contains(dlg)).toBe(false);
  });

  test('moves focus into the panel, Escape closes and returns it to the anchor', () => {
    jest.useFakeTimers();
    render(<Harness />);
    const anchor = screen.getByText('Anchor');
    fireEvent.click(anchor);
    act(() => { jest.runAllTimers(); });
    expect(document.activeElement).toBe(screen.getByText('Inside'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(anchor);
    jest.useRealTimers();
  });

  test('outside click closes it', () => {
    render(<Harness initialOpen />);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('draws an arrow when asked', () => {
    render(<Harness initialOpen arrow />);
    expect(document.querySelector('.popover-arrow')).not.toBeNull();
  });
});

describe('Popover disablePortal', () => {
  test('renders in place, not on document.body', () => {
    const { container } = render(
      <div data-testid="host"><Popover open disablePortal arrow placement="bottom-start" aria-label="p"><span>hi</span></Popover></div>
    );
    const panel = container.querySelector('.popover');
    expect(panel).toBeTruthy();
    expect(panel.parentElement.getAttribute('data-testid')).toBe('host');
    expect(panel.querySelector('.popover-arrow')).toBeTruthy();
  });
});
