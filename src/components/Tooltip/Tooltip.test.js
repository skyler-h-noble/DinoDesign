// src/components/Tooltip/Tooltip.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Tooltip, SolidTooltip, LightTooltip, OutlineTooltip } from './Tooltip';

// MUI Tooltip uses Popper; tests use open={true} for synchronous rendering

describe('Tooltip', () => {
  test('renders children', () => {
    render(<Tooltip title="Tip"><button>Trigger</button></Tooltip>);
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  test('shows tooltip content when open', async () => {
    render(
      <Tooltip title="Hello tooltip" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Hello tooltip')).toBeInTheDocument();
    });
  });

  test('hides tooltip when open={false}', () => {
    render(
      <Tooltip title="Hidden" open={false}>
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});

describe('data-theme', () => {
  test('solid primary => data-theme=Primary', async () => {
    render(
      <Tooltip title="Solid" variant="solid" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
    });
  });

  test('solid info => data-theme=Info-Medium', async () => {
    render(
      <Tooltip title="Info" variant="solid" color="info" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Info-Medium"]')).toBeInTheDocument();
    });
  });

  test('solid success => data-theme=Success-Medium', async () => {
    render(
      <Tooltip title="Suc" variant="solid" color="success" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Success-Medium"]')).toBeInTheDocument();
    });
  });

  test('solid error => data-theme=Error-Medium', async () => {
    render(
      <Tooltip title="Err" variant="solid" color="error" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Error-Medium"]')).toBeInTheDocument();
    });
  });

  test('light primary => data-theme=Primary-Light', async () => {
    render(
      <Tooltip title="Light" variant="light" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Primary-Light"]')).toBeInTheDocument();
    });
  });

  test('light warning => data-theme=Warning-Light', async () => {
    render(
      <Tooltip title="Warn" variant="light" color="warning" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Warning-Light"]')).toBeInTheDocument();
    });
  });

  test('outline has no data-theme', async () => {
    render(
      <Tooltip title="Outline" variant="outline" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Outline')).toBeInTheDocument();
    });
    expect(document.querySelector('.tooltip-content[data-theme]')).not.toBeInTheDocument();
  });
});

describe('Variant classes', () => {
  test('solid class', async () => {
    render(
      <Tooltip title="S" variant="solid" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-solid')).toBeInTheDocument();
    });
  });

  test('light class', async () => {
    render(
      <Tooltip title="L" variant="light" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-light')).toBeInTheDocument();
    });
  });

  test('outline class', async () => {
    render(
      <Tooltip title="O" variant="outline" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-outline')).toBeInTheDocument();
    });
  });
});

describe('Size classes', () => {
  test('small', async () => {
    render(
      <Tooltip title="Sm" size="small" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-small')).toBeInTheDocument();
    });
  });

  test('medium', async () => {
    render(
      <Tooltip title="Md" size="medium" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-medium')).toBeInTheDocument();
    });
  });

  test('large', async () => {
    render(
      <Tooltip title="Lg" size="large" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-large')).toBeInTheDocument();
    });
  });
});

describe('Arrow', () => {
  test('renders arrow when arrow=true', async () => {
    const { baseElement } = render(
      <Tooltip title="Arr" arrow open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(baseElement.querySelector('[class*="MuiTooltip-arrow"]')).toBeInTheDocument();
    });
  });

  test('no arrow when arrow=false', async () => {
    const { baseElement } = render(
      <Tooltip title="NoArr" arrow={false} open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('NoArr')).toBeInTheDocument();
    });
    expect(baseElement.querySelector('[class*="MuiTooltip-arrow"]')).not.toBeInTheDocument();
  });
});

describe('Placement', () => {
  test('applies placement via popper', async () => {
    render(
      <Tooltip title="Top" placement="top" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Top')).toBeInTheDocument();
    });
    expect(document.querySelector('[data-popper-placement="top"]')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('SolidTooltip', async () => {
    render(
      <SolidTooltip title="ST" color="primary" open={true}>
        <button>T</button>
      </SolidTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-solid')).toBeInTheDocument();
    });
  });

  test('LightTooltip', async () => {
    render(
      <LightTooltip title="LT" color="primary" open={true}>
        <button>T</button>
      </LightTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-light')).toBeInTheDocument();
    });
  });

  test('OutlineTooltip', async () => {
    render(
      <OutlineTooltip title="OT" color="primary" open={true}>
        <button>T</button>
      </OutlineTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-outline')).toBeInTheDocument();
    });
  });
});
