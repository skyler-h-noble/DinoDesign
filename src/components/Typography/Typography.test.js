// src/components/Typography/Typography.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Typography, H1, H2, H3, H4, H5, H6,
  Body, BodySmall, BodyLarge, BodySemibold, BodyBold,
  Label, Caption, Overline, OverlineSmall,
} from './Typography';

describe('Typography', () => {
  test('renders children', () => {
    render(<Typography>Hello world</Typography>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  test('defaults to body style', () => {
    render(<Typography>Default</Typography>);
    const el = screen.getByText('Default');
    expect(el).toHaveClass('typography-body');
  });

  test('defaults to p element for body', () => {
    render(<Typography>Text</Typography>);
    const el = screen.getByText('Text');
    expect(el.tagName).toBe('P');
  });
});

describe('Semantic elements', () => {
  test('h1 renders as h1', () => {
    render(<Typography textStyle="h1">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H1');
  });

  test('h2 renders as h2', () => {
    render(<Typography textStyle="h2">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H2');
  });

  test('h3 renders as h3', () => {
    render(<Typography textStyle="h3">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H3');
  });

  test('h4 renders as h4', () => {
    render(<Typography textStyle="h4">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H4');
  });

  test('h5 renders as h5', () => {
    render(<Typography textStyle="h5">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H5');
  });

  test('h6 renders as h6', () => {
    render(<Typography textStyle="h6">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H6');
  });

  test('body renders as p', () => {
    render(<Typography textStyle="body">Text</Typography>);
    expect(screen.getByText('Text').tagName).toBe('P');
  });

  test('label renders as label', () => {
    render(<Typography textStyle="label">Field</Typography>);
    expect(screen.getByText('Field').tagName).toBe('LABEL');
  });

  test('caption renders as span', () => {
    render(<Typography textStyle="caption">Note</Typography>);
    expect(screen.getByText('Note').tagName).toBe('SPAN');
  });

  test('button renders as span', () => {
    render(<Typography textStyle="button">Click</Typography>);
    expect(screen.getByText('Click').tagName).toBe('SPAN');
  });

  test('overline renders as span', () => {
    render(<Typography textStyle="overline">SECTION</Typography>);
    expect(screen.getByText('SECTION').tagName).toBe('SPAN');
  });
});

describe('Component override', () => {
  test('h2 style rendered as h3 element', () => {
    render(<Typography textStyle="h2" component="h3">Override</Typography>);
    const el = screen.getByText('Override');
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('typography-h2');
  });

  test('body rendered as span', () => {
    render(<Typography textStyle="body" component="span">Inline</Typography>);
    expect(screen.getByText('Inline').tagName).toBe('SPAN');
  });
});

describe('Style classes', () => {
  const styles = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'body', 'body-small', 'body-large', 'body-semibold', 'body-bold',
    'button', 'label', 'caption', 'overline',
  ];

  styles.forEach((s) => {
    test(s + ' applies correct class', () => {
      render(<Typography textStyle={s}>Test</Typography>);
      expect(screen.getByText('Test')).toHaveClass('typography-' + s);
    });
  });
});

describe('Color', () => {
  test('header color class', () => {
    render(<Typography textStyle="h1" color="header">Title</Typography>);
    expect(screen.getByText('Title')).toHaveClass('typography-color-header');
  });

  test('standard color class', () => {
    render(<Typography textStyle="body" color="standard">Text</Typography>);
    expect(screen.getByText('Text')).toHaveClass('typography-color-standard');
  });

  test('quiet color class', () => {
    render(<Typography textStyle="body" color="quiet">Quiet</Typography>);
    expect(screen.getByText('Quiet')).toHaveClass('typography-color-quiet');
  });

  test('headings default to header color', () => {
    render(<Typography textStyle="h1">Title</Typography>);
    expect(screen.getByText('Title')).toHaveClass('typography-color-header');
  });

  test('body defaults to standard color', () => {
    render(<Typography textStyle="body">Text</Typography>);
    expect(screen.getByText('Text')).toHaveClass('typography-color-standard');
  });

  test('caption defaults to quiet color', () => {
    render(<Typography textStyle="caption">Note</Typography>);
    expect(screen.getByText('Note')).toHaveClass('typography-color-quiet');
  });

  test('overline defaults to quiet color', () => {
    render(<Typography textStyle="overline">SECTION</Typography>);
    expect(screen.getByText('SECTION')).toHaveClass('typography-color-quiet');
  });
});

describe('Width', () => {
  test('fill width class', () => {
    render(<Typography textStyle="body" width="fill">Block</Typography>);
    expect(screen.getByText('Block')).toHaveClass('typography-width-fill');
  });

  test('hug width class', () => {
    render(<Typography textStyle="body" width="hug">Inline</Typography>);
    expect(screen.getByText('Inline')).toHaveClass('typography-width-hug');
  });

  test('headings default to fill', () => {
    render(<Typography textStyle="h2">Title</Typography>);
    expect(screen.getByText('Title')).toHaveClass('typography-width-fill');
  });

  test('label defaults to hug', () => {
    render(<Typography textStyle="label">Field</Typography>);
    expect(screen.getByText('Field')).toHaveClass('typography-width-hug');
  });

  test('caption defaults to hug', () => {
    render(<Typography textStyle="caption">Note</Typography>);
    expect(screen.getByText('Note')).toHaveClass('typography-width-hug');
  });
});

describe('noWrap', () => {
  test('adds noWrap truncation styles', () => {
    render(<Typography noWrap>Long text here</Typography>);
    const el = screen.getByText('Long text here');
    const styles = window.getComputedStyle(el);
    expect(styles.overflow).toBe('hidden');
    expect(styles.textOverflow).toBe('ellipsis');
    expect(styles.whiteSpace).toBe('nowrap');
  });
});

describe('gutterBottom', () => {
  test('adds margin-bottom', () => {
    render(<Typography gutterBottom>Spaced</Typography>);
    const el = screen.getByText('Spaced');
    const styles = window.getComputedStyle(el);
    expect(styles.marginBottom).toBe('0.5em');
  });
});

describe('Convenience exports', () => {
  test('H1', () => { render(<H1>T</H1>); expect(screen.getByText('T')).toHaveClass('typography-h1'); });
  test('H2', () => { render(<H2>T</H2>); expect(screen.getByText('T')).toHaveClass('typography-h2'); });
  test('H3', () => { render(<H3>T</H3>); expect(screen.getByText('T')).toHaveClass('typography-h3'); });
  test('H4', () => { render(<H4>T</H4>); expect(screen.getByText('T')).toHaveClass('typography-h4'); });
  test('H5', () => { render(<H5>T</H5>); expect(screen.getByText('T')).toHaveClass('typography-h5'); });
  test('H6', () => { render(<H6>T</H6>); expect(screen.getByText('T')).toHaveClass('typography-h6'); });
  test('Body', () => { render(<Body>T</Body>); expect(screen.getByText('T')).toHaveClass('typography-body'); });
  test('BodySmall', () => { render(<BodySmall>T</BodySmall>); expect(screen.getByText('T')).toHaveClass('typography-body-small'); });
  test('BodyLarge', () => { render(<BodyLarge>T</BodyLarge>); expect(screen.getByText('T')).toHaveClass('typography-body-large'); });
  test('BodySemibold', () => { render(<BodySemibold>T</BodySemibold>); expect(screen.getByText('T')).toHaveClass('typography-body-semibold'); });
  test('BodyBold', () => { render(<BodyBold>T</BodyBold>); expect(screen.getByText('T')).toHaveClass('typography-body-bold'); });
  test('Label', () => { render(<Label>T</Label>); expect(screen.getByText('T')).toHaveClass('typography-label'); });
  test('Caption', () => { render(<Caption>T</Caption>); expect(screen.getByText('T')).toHaveClass('typography-caption'); });
  test('Overline', () => { render(<Overline>T</Overline>); expect(screen.getByText('T')).toHaveClass('typography-overline'); });
  test('OverlineSmall', () => { render(<OverlineSmall>T</OverlineSmall>); expect(screen.getByText('T')).toHaveClass('typography-overline'); });
});
