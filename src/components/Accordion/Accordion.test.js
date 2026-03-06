// src/components/Accordion/Accordion.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AccordionGroup, Accordion, AccordionSummary, AccordionDetails,
  DefaultAccordionGroup, SolidAccordionGroup, LightAccordionGroup,
} from './Accordion';

/* ─── Helpers ─── */
const renderAccordion = (groupProps = {}, accordionProps = {}) =>
  render(
    <AccordionGroup {...groupProps}>
      <Accordion {...accordionProps}>
        <AccordionSummary>Title</AccordionSummary>
        <AccordionDetails>Content</AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );

/* ─── Basic Rendering ─── */
describe('AccordionGroup', () => {
  test('renders children', () => {
    renderAccordion();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  test('default variant has no data-theme', () => {
    const { container } = renderAccordion({ variant: 'default' });
    const group = container.querySelector('.accordion-group');
    expect(group).not.toHaveAttribute('data-theme');
    expect(group).not.toHaveAttribute('data-surface');
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'],
    ['info', 'Info-Medium'],
    ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'],
    ['error', 'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderAccordion({ variant: 'solid', color });
      const group = container.querySelector('.accordion-group');
      expect(group).toHaveAttribute('data-theme', theme);
      expect(group).toHaveAttribute('data-surface', 'Surface');
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary-Light'],
    ['secondary', 'Secondary-Light'],
    ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'],
    ['info', 'Info-Light'],
    ['success', 'Success-Light'],
    ['warning', 'Warning-Light'],
    ['error', 'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderAccordion({ variant: 'light', color });
      const group = container.querySelector('.accordion-group');
      expect(group).toHaveAttribute('data-theme', theme);
      expect(group).not.toHaveAttribute('data-surface');
    });
  });
});

/* ─── Variant classes ─── */
describe('Variant classes', () => {
  test('default variant class', () => {
    const { container } = renderAccordion({ variant: 'default' });
    expect(container.querySelector('.accordion-group-default')).toBeInTheDocument();
  });

  test('solid variant class', () => {
    const { container } = renderAccordion({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.accordion-group-solid')).toBeInTheDocument();
  });

  test('light variant class', () => {
    const { container } = renderAccordion({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.accordion-group-light')).toBeInTheDocument();
  });
});

/* ─── Expansion ─── */
describe('Expansion', () => {
  test('starts collapsed — content hidden', () => {
    renderAccordion();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('defaultExpanded shows content', () => {
    renderAccordion({}, { defaultExpanded: true });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('click toggles expansion', () => {
    renderAccordion();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Title'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Title'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('controlled expansion via expanded prop', () => {
    const { rerender } = render(
      <AccordionGroup>
        <Accordion expanded={false}>
          <AccordionSummary>Title</AccordionSummary>
          <AccordionDetails>Content</AccordionDetails>
        </Accordion>
      </AccordionGroup>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    rerender(
      <AccordionGroup>
        <Accordion expanded={true}>
          <AccordionSummary>Title</AccordionSummary>
          <AccordionDetails>Content</AccordionDetails>
        </Accordion>
      </AccordionGroup>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('onChange fires on toggle', () => {
    const onChange = jest.fn();
    renderAccordion({}, { onChange });
    fireEvent.click(screen.getByText('Title'));
    expect(onChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText('Title'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

/* ─── ARIA ─── */
describe('ARIA attributes', () => {
  test('summary has aria-expanded=false when collapsed', () => {
    renderAccordion();
    expect(screen.getByText('Title').closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  test('summary has aria-expanded=true when expanded', () => {
    renderAccordion({}, { defaultExpanded: true });
    expect(screen.getByText('Title').closest('button')).toHaveAttribute('aria-expanded', 'true');
  });

  test('summary has aria-controls pointing to details', () => {
    renderAccordion({}, { defaultExpanded: true });
    const btn = screen.getByText('Title').closest('button');
    const controlsId = btn.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(screen.getByText('Content').closest('[role="region"]')).toHaveAttribute('id', controlsId);
  });

  test('details has role=region and aria-labelledby', () => {
    renderAccordion({}, { defaultExpanded: true });
    const region = screen.getByText('Content').closest('[role="region"]');
    expect(region).toHaveAttribute('aria-labelledby');
    const labelledById = region.getAttribute('aria-labelledby');
    expect(screen.getByText('Title').closest('button')).toHaveAttribute('id', labelledById);
  });
});

/* ─── Keyboard ─── */
describe('Keyboard', () => {
  test('Enter toggles expansion', () => {
    renderAccordion();
    const btn = screen.getByText('Title').closest('button');
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('Space toggles expansion', () => {
    renderAccordion();
    const btn = screen.getByText('Title').closest('button');
    fireEvent.keyDown(btn, { key: ' ' });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

/* ─── Disabled ─── */
describe('Disabled', () => {
  test('disabled accordion does not toggle on click', () => {
    renderAccordion({}, { disabled: true });
    fireEvent.click(screen.getByText('Title'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('disabled accordion has tabIndex -1', () => {
    renderAccordion({}, { disabled: true });
    const btn = screen.getByText('Title').closest('button');
    expect(btn).toHaveAttribute('tabindex', '-1');
  });

  test('disabled class applied', () => {
    const { container } = renderAccordion({}, { disabled: true });
    expect(container.querySelector('.accordion-disabled')).toBeInTheDocument();
  });
});

/* ─── Dividers ─── */
describe('Dividers', () => {
  test('dividers present by default', () => {
    const { container } = render(
      <AccordionGroup>
        <Accordion><AccordionSummary>A</AccordionSummary><AccordionDetails>a</AccordionDetails></Accordion>
        <Accordion><AccordionSummary>B</AccordionSummary><AccordionDetails>b</AccordionDetails></Accordion>
      </AccordionGroup>
    );
    const items = container.querySelectorAll('.accordion');
    const firstStyle = window.getComputedStyle(items[0]);
    expect(firstStyle.borderBottom).not.toBe('none');
  });
});

/* ─── Convenience Exports ─── */
describe('Convenience exports', () => {
  test('DefaultAccordionGroup renders default variant', () => {
    const { container } = render(
      <DefaultAccordionGroup>
        <Accordion><AccordionSummary>T</AccordionSummary><AccordionDetails>C</AccordionDetails></Accordion>
      </DefaultAccordionGroup>
    );
    expect(container.querySelector('.accordion-group-default')).toBeInTheDocument();
  });

  test('SolidAccordionGroup renders with data-theme', () => {
    const { container } = render(
      <SolidAccordionGroup color="primary">
        <Accordion><AccordionSummary>T</AccordionSummary><AccordionDetails>C</AccordionDetails></Accordion>
      </SolidAccordionGroup>
    );
    expect(container.querySelector('.accordion-group-solid')).toBeInTheDocument();
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });

  test('LightAccordionGroup renders with data-theme', () => {
    const { container } = render(
      <LightAccordionGroup color="success">
        <Accordion><AccordionSummary>T</AccordionSummary><AccordionDetails>C</AccordionDetails></Accordion>
      </LightAccordionGroup>
    );
    expect(container.querySelector('.accordion-group-light')).toBeInTheDocument();
    expect(container.querySelector('[data-theme="Success-Light"]')).toBeInTheDocument();
  });
});

/* ─── Multiple Accordions ─── */
describe('Multiple accordions', () => {
  test('each accordion toggles independently', () => {
    render(
      <AccordionGroup>
        <Accordion><AccordionSummary>First</AccordionSummary><AccordionDetails>Content A</AccordionDetails></Accordion>
        <Accordion><AccordionSummary>Second</AccordionSummary><AccordionDetails>Content B</AccordionDetails></Accordion>
      </AccordionGroup>
    );
    fireEvent.click(screen.getByText('First'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.queryByText('Content B')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Second'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });
});
