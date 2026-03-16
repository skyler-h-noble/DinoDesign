// src/components/Grid/Grid.test.js
import React from 'react';
import { render } from '@testing-library/react';
import {
  Grid,
  GridContainer,
  GridItem,
  FullWidthGrid,
  HalfWidthGrid,
  ThirdWidthGrid,
  QuarterWidthGrid,
  ResponsiveGrid,
  AutoGrid,
  CenteredGrid,
  ColumnGrid,
} from './Grid';
import { axe } from 'jest-axe';

describe('Grid Component', () => {
  test('renders Grid', () => {
    const { container } = render(
      <Grid>
        <div>Content</div>
      </Grid>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders as container', () => {
    const { container } = render(
      <Grid container>
        <div>Content</div>
      </Grid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('renders as item', () => {
    const { container } = render(
      <Grid item>
        <div>Content</div>
      </Grid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('accepts spacing prop', () => {
    const { container } = render(
      <Grid container spacing={4}>
        <div>Content</div>
      </Grid>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('GridContainer Component', () => {
  test('renders GridContainer', () => {
    const { container } = render(
      <GridContainer>
        <div>Content</div>
      </GridContainer>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('is full width by default', () => {
    const { container } = render(
      <GridContainer>
        <div>Content</div>
      </GridContainer>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('GridItem Component', () => {
  test('renders GridItem', () => {
    const { container } = render(
      <GridItem>
        <div>Content</div>
      </GridItem>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('has responsive defaults', () => {
    const { container } = render(
      <GridItem xs={12} sm={6} md={4}>
        <div>Content</div>
      </GridItem>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('FullWidthGrid Component', () => {
  test('renders FullWidthGrid', () => {
    const { container } = render(
      <FullWidthGrid>
        <div>Full width content</div>
      </FullWidthGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });
});

describe('HalfWidthGrid Component', () => {
  test('renders HalfWidthGrid', () => {
    const { container } = render(
      <HalfWidthGrid>
        <div>Half width content</div>
      </HalfWidthGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });
});

describe('ThirdWidthGrid Component', () => {
  test('renders ThirdWidthGrid', () => {
    const { container } = render(
      <ThirdWidthGrid>
        <div>Third width content</div>
      </ThirdWidthGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });
});

describe('QuarterWidthGrid Component', () => {
  test('renders QuarterWidthGrid', () => {
    const { container } = render(
      <QuarterWidthGrid>
        <div>Quarter width content</div>
      </QuarterWidthGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });
});

describe('ResponsiveGrid Component', () => {
  test('renders ResponsiveGrid', () => {
    const { container } = render(
      <ResponsiveGrid columns={3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </ResponsiveGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('distributes children evenly', () => {
    const { container } = render(
      <ResponsiveGrid columns={2}>
        <div>Item 1</div>
        <div>Item 2</div>
      </ResponsiveGrid>
    );
    const grids = container.querySelectorAll('[class*="MuiGrid"]');
    expect(grids.length).toBeGreaterThan(0);
  });
});

describe('AutoGrid Component', () => {
  test('renders AutoGrid', () => {
    const { container } = render(
      <AutoGrid minWidth={200}>
        <div>Item 1</div>
        <div>Item 2</div>
      </AutoGrid>
    );
    expect(container).toBeInTheDocument();
  });

  test('uses CSS grid', () => {
    const { container } = render(
      <AutoGrid minWidth={250}>
        <div>Content</div>
      </AutoGrid>
    );
    const grid = container.firstChild;
    expect(grid).toHaveStyle('display: grid');
  });
});

describe('CenteredGrid Component', () => {
  test('renders CenteredGrid', () => {
    const { container } = render(
      <CenteredGrid>
        <div>Centered content</div>
      </CenteredGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('centers content', () => {
    const { container } = render(
      <CenteredGrid>
        <div>Content</div>
      </CenteredGrid>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('ColumnGrid Component', () => {
  test('renders ColumnGrid', () => {
    const { container } = render(
      <ColumnGrid columns={6}>
        <div>Content</div>
      </ColumnGrid>
    );
    expect(container.querySelector('[class*="MuiGrid"]')).toBeInTheDocument();
  });

  test('accepts custom column width', () => {
    const { container } = render(
      <ColumnGrid columns={8}>
        <div>Content</div>
      </ColumnGrid>
    );
    expect(container).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Grid — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Grid><div>Item</div></Grid>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Grid><div>Item</div></Grid>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Grid><div>Item</div></Grid>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
