/**
 * Player is a COMPOSITION, so the tests are about what it wires rather than
 * what it draws: the transport reaching its handlers, the clock reading as a
 * duration, and the scrubber announcing a position rather than a number.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Player, formatTime } from './Player';

describe('formatTime', () => {
  /* The hour branch exists because a podcast is the ordinary case for a bar
     like this, and 73:04 is not a readable number. */
  test.each([
    [0, '0:00'], [7, '0:07'], [62, '1:02'], [599, '9:59'],
    [3600, '1:00:00'], [4384, '1:13:04'],
  ])('%s seconds reads as %s', (s, out) => {
    expect(formatTime(s)).toBe(out);
  });

  test('a negative or missing value is 0:00, not NaN:NaN', () => {
    expect(formatTime(-5)).toBe('0:00');
    expect(formatTime(undefined)).toBe('0:00');
  });
});

describe('Player', () => {
  test('the play button says what pressing it will do', () => {
    const { rerender } = render(<Player duration={100} />);
    expect(screen.getByRole('button', { name: 'Play' })).toBeTruthy();
    rerender(<Player duration={100} playing />);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
  });

  test('play/pause reports the state it is moving TO', () => {
    const onPlayPause = jest.fn();
    render(<Player duration={100} onPlayPause={onPlayPause} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(onPlayPause).toHaveBeenCalledWith(true);
  });

  /* Absent handler, absent button. A player with no previous track should not
     show a dead control, and only the caller knows whether there is one. */
  test('skip buttons appear only when they have somewhere to go', () => {
    const { rerender } = render(<Player duration={100} />);
    expect(screen.queryByRole('button', { name: 'Previous track' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next track' })).toBeNull();
    rerender(<Player duration={100} onPrevious={() => {}} onNext={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous track' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next track' })).toBeTruthy();
  });

  test('the clock shows elapsed and total, not a bubble on the thumb', () => {
    render(<Player duration={195} defaultPosition={42} />);
    expect(screen.getByText('0:42')).toBeTruthy();
    expect(screen.getByText('3:15')).toBeTruthy();
  });

  /* The scrubber is a position in a track. Reading "42" and leaving the
     listener to work out what that is of is the failure this guards. */
  test('the scrubber announces a position, not a number', () => {
    render(<Player duration={195} defaultPosition={42} onSeek={() => {}} />);
    const slider = screen.getByRole('slider', { name: 'Seek' });
    expect(slider.getAttribute('aria-valuetext')).toBe('0:42 of 3:15');
  });

  /* No onSeek is a player you can watch and not scrub — a preview, a disabled
     state — rather than a slider that silently does nothing. */
  test('without onSeek the scrubber is disabled', () => {
    render(<Player duration={195} defaultPosition={10} />);
    expect(screen.getByRole('slider', { name: 'Seek' })).toBeDisabled();
  });

  test('the whole thing is one named group', () => {
    render(<Player duration={100} aria-label="Episode player" />);
    expect(screen.getByRole('group', { name: 'Episode player' })).toBeTruthy();
  });
});
