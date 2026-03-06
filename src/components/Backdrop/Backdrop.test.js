// src/components/Backdrop/Backdrop.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Backdrop,
  DarkBackdrop,
  LightBackdrop,
  InvisibleBackdrop,
  BlurredBackdrop,
  ColoredBackdrop,
  AnimatedBackdrop,
} from './Backdrop';

describe('Backdrop Component', () => {
  test('renders when open is true', () => {
    const { container } = render(<Backdrop open={true} />);
    const backdrop = container.querySelector('[role="presentation"]') || container.firstChild;
    expect(backdrop).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    const { container } = render(<Backdrop open={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('calls onClick when backdrop is clicked', async () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Backdrop open={true} onClick={handleClick} />
    );
    
    const backdrop = container.firstChild;
    await userEvent.click(backdrop);
    expect(handleClick).toHaveBeenCalled();
  });

  test('applies custom sx styles', () => {
    const { container } = render(
      <Backdrop 
        open={true} 
        sx={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}
      />
    );
    
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: rgba(255, 0, 0, 0.5)');
  });

  test('respects zIndex prop', () => {
    const { container } = render(
      <Backdrop open={true} zIndex={9999} />
    );
    
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('z-index: 9999');
  });

  test('invisible backdrop is transparent', () => {
    const { container } = render(
      <Backdrop open={true} invisible={true} />
    );
    
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: transparent');
  });

  test('DarkBackdrop has darker opacity', () => {
    const { container } = render(<DarkBackdrop open={true} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: rgba(0, 0, 0, 0.7)');
  });

  test('LightBackdrop has lighter opacity', () => {
    const { container } = render(<LightBackdrop open={true} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: rgba(0, 0, 0, 0.3)');
  });

  test('InvisibleBackdrop is transparent', () => {
    const { container } = render(<InvisibleBackdrop open={true} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: transparent');
  });

  test('BlurredBackdrop applies blur filter', () => {
    const { container } = render(<BlurredBackdrop open={true} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('backdrop-filter: blur(4px)');
  });

  test('BlurredBackdrop accepts custom blur amount', () => {
    const { container } = render(<BlurredBackdrop open={true} blur="8px" />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('backdrop-filter: blur(8px)');
  });

  test('ColoredBackdrop uses custom color', () => {
    const { container } = render(
      <ColoredBackdrop 
        open={true} 
        color="rgba(255, 0, 0, 0.5)"
      />
    );
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('background-color: rgba(255, 0, 0, 0.5)');
  });

  test('AnimatedBackdrop hidden when not open', () => {
    const { container } = render(<AnimatedBackdrop open={false} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('visibility: hidden');
  });

  test('AnimatedBackdrop visible when open', () => {
    const { container } = render(<AnimatedBackdrop open={true} />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('visibility: visible');
  });

  test('renders children when provided', () => {
    const { getByText } = render(
      <Backdrop open={true}>
        <div>Child Content</div>
      </Backdrop>
    );
    expect(getByText('Child Content')).toBeInTheDocument();
  });

  test('accepts transition duration prop', () => {
    const { container } = render(
      <Backdrop open={true} transitionDuration={500} />
    );
    const backdrop = container.firstChild;
    expect(backdrop).toHaveStyle('transition: background-color 500ms ease-in-out');
  });

  test('backdrop closes on click', async () => {
    const handleClick = jest.fn();
    const { container, rerender } = render(
      <Backdrop open={true} onClick={handleClick} />
    );
    
    const backdrop = container.firstChild;
    await userEvent.click(backdrop);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('supports aria attributes', () => {
    const { container } = render(
      <Backdrop 
        open={true} 
        role="presentation"
        aria-hidden="true"
      />
    );
    
    const backdrop = container.firstChild;
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  });

  test('cursor changes based on onClick prop', () => {
    const { container: container1 } = render(
      <Backdrop open={true} onClick={() => {}} />
    );
    expect(container1.firstChild).toHaveStyle('cursor: pointer');

    const { container: container2 } = render(
      <Backdrop open={true} />
    );
    expect(container2.firstChild).toHaveStyle('cursor: default');
  });
});
