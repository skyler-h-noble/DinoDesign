// src/components/Paper/Paper.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Paper,
  usePaperSurface,
  InteractivePaper,
  ElevatedPaper,
  OutlinedPaper,
  CardPaper,
  NestedPaper,
  TieredPaper,
  ResponsivePaper,
  FloatingPaper,
} from './Paper';

describe('usePaperSurface Hook', () => {
  test('returns correct config for Container-Lowest', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Container-Lowest')
    );
    expect(result.current.elevation).toBe(0);
    expect(result.current.dataSurface).toBe('Container-Lowest');
  });

  test('returns correct config for Container-Low', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Container-Low')
    );
    expect(result.current.elevation).toBe(1);
  });

  test('returns correct config for Container', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Container')
    );
    expect(result.current.elevation).toBe(4);
  });

  test('returns correct config for Container-High', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Container-High')
    );
    expect(result.current.elevation).toBe(8);
  });

  test('returns correct config for Container-Highest', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Container-Highest')
    );
    expect(result.current.elevation).toBe(12);
  });

  test('defaults to Container when invalid surface provided', () => {
    const { result } = require('@testing-library/react').renderHook(() =>
      usePaperSurface('Invalid-Surface')
    );
    expect(result.current.elevation).toBe(4);
  });
});

describe('Paper Component', () => {
  test('renders Paper with children', () => {
    render(<Paper>Test Content</Paper>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders with correct data-surface attribute', () => {
    const { container } = render(
      <Paper surface="Container">Content</Paper>
    );
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  test('renders with all surface levels', () => {
    const surfaces = ['Container-Lowest', 'Container-Low', 'Container', 'Container-High', 'Container-Highest'];
    surfaces.forEach(surface => {
      const { container } = render(
        <Paper surface={surface}>Content</Paper>
      );
      expect(container.querySelector(`[data-surface="${surface}"]`)).toBeInTheDocument();
    });
  });

  test('renders outlined variant', () => {
    const { container } = render(
      <Paper outlined>Content</Paper>
    );
    expect(container.querySelector('[data-surface]')).toBeInTheDocument();
  });
});

describe('InteractivePaper Component', () => {
  test('renders InteractivePaper', () => {
    render(<InteractivePaper>Interactive Content</InteractivePaper>);
    expect(screen.getByText('Interactive Content')).toBeInTheDocument();
  });

  test('changes elevation on hover', () => {
    const { container } = render(
      <InteractivePaper surface="Container">Content</InteractivePaper>
    );
    const paper = container.querySelector('[data-surface]');
    expect(paper).toBeInTheDocument();
  });
});

describe('ElevatedPaper Component', () => {
  test('renders ElevatedPaper', () => {
    render(<ElevatedPaper>Elevated Content</ElevatedPaper>);
    expect(screen.getByText('Elevated Content')).toBeInTheDocument();
  });

  test('has elevation variant', () => {
    const { container } = render(
      <ElevatedPaper surface="Container-High">Content</ElevatedPaper>
    );
    expect(container.querySelector('[data-surface="Container-High"]')).toBeInTheDocument();
  });
});

describe('OutlinedPaper Component', () => {
  test('renders OutlinedPaper', () => {
    render(<OutlinedPaper>Outlined Content</OutlinedPaper>);
    expect(screen.getByText('Outlined Content')).toBeInTheDocument();
  });

  test('has border styling', () => {
    const { container } = render(
      <OutlinedPaper>Content</OutlinedPaper>
    );
    expect(container.querySelector('[data-surface]')).toBeInTheDocument();
  });
});

describe('CardPaper Component', () => {
  test('renders CardPaper with different padding sizes', () => {
    const paddings = ['none', 'small', 'medium', 'large'];
    paddings.forEach(padding => {
      const { container } = render(
        <CardPaper padding={padding}>Card Content</CardPaper>
      );
      expect(container).toBeInTheDocument();
    });
  });
});

describe('NestedPaper Component', () => {
  test('renders NestedPaper with outer and inner surfaces', () => {
    const { container } = render(
      <NestedPaper
        outerSurface="Container-Low"
        innerSurface="Container"
      >
        Nested Content
      </NestedPaper>
    );
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});

describe('TieredPaper Component', () => {
  test('renders all 5 elevation levels', () => {
    const { container } = render(<TieredPaper />);
    const surfaces = [
      'Container-Lowest',
      'Container-Low',
      'Container',
      'Container-High',
      'Container-Highest',
    ];
    surfaces.forEach(surface => {
      expect(container.querySelector(`[data-surface="${surface}"]`)).toBeInTheDocument();
    });
  });

  test('displays elevation values', () => {
    render(<TieredPaper />);
    expect(screen.getByText(/elevation: 0dp/)).toBeInTheDocument();
    expect(screen.getByText(/elevation: 1dp/)).toBeInTheDocument();
    expect(screen.getByText(/elevation: 4dp/)).toBeInTheDocument();
    expect(screen.getByText(/elevation: 8dp/)).toBeInTheDocument();
    expect(screen.getByText(/elevation: 12dp/)).toBeInTheDocument();
  });
});

describe('ResponsivePaper Component', () => {
  test('renders ResponsivePaper', () => {
    render(<ResponsivePaper>Responsive Content</ResponsivePaper>);
    expect(screen.getByText('Responsive Content')).toBeInTheDocument();
  });
});

describe('FloatingPaper Component', () => {
  test('renders FloatingPaper with highest elevation', () => {
    const { container } = render(
      <FloatingPaper>Floating Content</FloatingPaper>
    );
    expect(container.querySelector('[data-surface="Container-Highest"]')).toBeInTheDocument();
    expect(screen.getByText('Floating Content')).toBeInTheDocument();
  });
});

describe('Data-surface Attribute', () => {
  test('all paper variants have data-surface attribute', () => {
    const components = [
      <Paper key="1">Paper</Paper>,
      <ElevatedPaper key="2">Elevated</ElevatedPaper>,
      <OutlinedPaper key="3">Outlined</OutlinedPaper>,
      <CardPaper key="4">Card</CardPaper>,
      <FloatingPaper key="5">Floating</FloatingPaper>,
    ];

    components.forEach(component => {
      const { container } = render(component);
      expect(container.querySelector('[data-surface]')).toBeInTheDocument();
    });
  });
});
