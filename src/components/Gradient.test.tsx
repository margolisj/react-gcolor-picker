import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ReactGPicker } from '../ColorPicker';
import { Controlled, drag, mockRect } from '../test/helpers';
import type { ReactGPickerHandle } from '../types';

const RED_BLUE = 'linear-gradient(90deg, #ff0000 0%, #0000ff 100%)';

const hexInput = () => screen.getByRole('textbox', { name: 'Hex' });
const stops = () => screen.getAllByRole('slider', { name: /^Color stop/ });
const stop = (n: number) =>
  screen.getByRole('slider', { name: `Color stop ${n}` });
const activeStopIndex = () =>
  stops().findIndex((el) => el.classList.contains('active'));

const renderGradient = (props: Parameters<typeof Controlled>[0] = {}) => {
  const onChange = vi.fn();
  const utils = render(
    <Controlled
      solid={false}
      gradient
      defaultColors={[]}
      onChange={onChange}
      {...props}
    />
  );
  const track = utils.container.querySelector('.gradient-stops')!;
  mockRect(track, { width: 200, height: 8 });
  return { ...utils, onChange, track };
};

describe('gradient picker', () => {
  it('starts with the last stop active and shows its color', () => {
    renderGradient({ initial: RED_BLUE });
    expect(stops()).toHaveLength(2);
    expect(activeStopIndex()).toBe(1);
    expect(hexInput()).toHaveValue('0000ff');
  });

  it('edits the highlighted stop after the value is replaced from outside', async () => {
    // Regression for the nectar-blocks "GradientBug" story: the second stop
    // showed as active while edits changed the last one.
    const injected =
      'linear-gradient(180deg, rgb(122, 201, 251) 1.00%,rgb(209, 89, 223) 68.00%,rgb(255, 120, 88) 90.00%)';
    const user = userEvent.setup();
    const { onChange } = renderGradient({
      initial: 'linear-gradient(180deg, #000000 0%, #005aff 100%)',
      external: [injected]
    });

    await user.click(screen.getByRole('button', { name: 'external 0' }));
    expect(stops()).toHaveLength(3);
    expect(activeStopIndex()).toBe(1);
    expect(hexInput()).toHaveValue('d159df');

    await user.clear(hexInput());
    await user.type(hexInput(), 'ff0000{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      'linear-gradient(180deg, rgb(122, 201, 251) 1.00%,rgb(255, 0, 0) 68.00%,rgb(255, 120, 88) 90.00%)'
    );
    expect(activeStopIndex()).toBe(1);
  });

  it('updates colors when no stop sits at 100%', async () => {
    const user = userEvent.setup();
    const { onChange } = renderGradient({
      initial: 'linear-gradient(90deg, #ff0000 10%, #0000ff 80%)'
    });
    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      'linear-gradient(90deg, rgb(255, 0, 0) 10.00%,rgb(0, 255, 0) 80.00%)'
    );
  });

  it('selects a stop on press without moving it', () => {
    const { onChange } = renderGradient({ initial: RED_BLUE });
    drag(stop(1), { x: 3, y: 0 });
    expect(activeStopIndex()).toBe(0);
    expect(hexInput()).toHaveValue('ff0000');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves a stop by dragging and keeps the output sorted', () => {
    const { onChange } = renderGradient({
      initial: 'linear-gradient(90deg, #ff0000 0%, #0000ff 50%)'
    });
    drag(stop(1), { x: 0, y: 0 }, [
      { x: 100, y: 4 },
      { x: 160, y: 4 }
    ]);
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, rgb(0, 0, 255) 50.00%,rgb(255, 0, 0) 80.00%)'
    );
    expect(activeStopIndex()).toBe(0);
    expect(stop(1)).toHaveStyle({ left: '80%' });
  });

  it('adds a stop where the track is clicked, using the active color', async () => {
    const user = userEvent.setup();
    const { onChange, container } = renderGradient({ initial: RED_BLUE });
    await user.pointer({
      keys: '[MouseLeft]',
      target: container.querySelector('.gradient-stop-preview')!,
      coords: { clientX: 50, clientY: 4 }
    });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      'linear-gradient(90deg, rgb(255, 0, 0) 0.00%,rgb(0, 0, 255) 25.00%,rgb(0, 0, 255) 100.00%)'
    );
    expect(stops()).toHaveLength(3);
    expect(activeStopIndex()).toBe(1);
  });

  it('removes stops by double-click, Delete and dragging off the track, keeping at least two', async () => {
    const user = userEvent.setup();
    const { onChange } = renderGradient({
      initial:
        'linear-gradient(90deg, red 0%, lime 25%, blue 50%, yellow 75%, black 100%)'
    });

    await user.dblClick(stop(2));
    expect(stops()).toHaveLength(4);

    act(() => stop(1).focus());
    await user.keyboard('{Delete}');
    expect(stops()).toHaveLength(3);

    const marker = stop(1);
    drag(marker, { x: 0, y: 0 }, [{ x: 0, y: 200 }]);
    expect(stops()).toHaveLength(2);
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, rgb(255, 255, 0) 75.00%,rgb(0, 0, 0) 100.00%)'
    );

    await user.dblClick(stop(1));
    act(() => stop(2).focus());
    await user.keyboard('{Delete}');
    expect(stops()).toHaveLength(2);
  });

  it('hides a stop while it is dragged off the track', () => {
    renderGradient({
      initial: 'linear-gradient(90deg, red 0%, lime 50%, blue 100%)'
    });
    fireEvent.pointerDown(stop(2), { clientX: 100, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(window, { clientX: 100, clientY: 200, pointerId: 1 });
    expect(stop(2)).toHaveClass('hide');
    fireEvent.pointerMove(window, { clientX: 100, clientY: 4, pointerId: 1 });
    expect(stop(2)).toHaveClass('active');
    fireEvent.pointerUp(window, { clientX: 100, clientY: 4, pointerId: 1 });
    expect(stops()).toHaveLength(3);
  });

  it('moves the focused stop with the arrow keys', async () => {
    const user = userEvent.setup();
    const { onChange } = renderGradient({ initial: RED_BLUE });
    act(() => stop(1).focus());
    expect(activeStopIndex()).toBe(0);
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, rgb(255, 0, 0) 1.00%,rgb(0, 0, 255) 100.00%)'
    );
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(stop(1)).toHaveAttribute('aria-valuenow', '11');
  });

  it('toggles linear / radial and restores the previous angle', async () => {
    const user = userEvent.setup();
    const { onChange } = renderGradient({
      initial: 'linear-gradient(45deg, #ff0000 0%, #0000ff 100%)'
    });
    await user.click(
      screen.getByRole('button', { name: 'Switch to radial gradient' })
    );
    expect(onChange).toHaveBeenLastCalledWith(
      'radial-gradient(circle at center, rgb(255, 0, 0) 0.00%,rgb(0, 0, 255) 100.00%)'
    );
    await user.click(screen.getByRole('button', { name: 'Top left' }));
    expect(onChange).toHaveBeenLastCalledWith(
      'radial-gradient(circle at left top, rgb(255, 0, 0) 0.00%,rgb(0, 0, 255) 100.00%)'
    );
    expect(screen.getByRole('button', { name: 'Top left' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await user.click(
      screen.getByRole('button', { name: 'Switch to linear gradient' })
    );
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(45deg, rgb(255, 0, 0) 0.00%,rgb(0, 0, 255) 100.00%)'
    );
  });

  it('rotates a linear gradient by dragging, snapping to 45° (22.5° with Shift)', () => {
    const { onChange, container } = renderGradient({ initial: RED_BLUE });
    const result = container.querySelector('.gradient-result')!;
    mockRect(result, { width: 200, height: 100 });

    // Straight up from the center is 0°.
    drag(result, { x: 100, y: 0 });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.stringMatching(/^linear-gradient\(0deg,/)
    );

    // 30° from the center: 0° with the default snap, 22.5° with Shift.
    const p = { x: 100 + 50, y: 50 - 50 * Math.sqrt(3) };
    drag(result, { x: 100, y: 50 + 50 }, [p]);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.stringMatching(/^linear-gradient\(0deg,/)
    );
    drag(result, p, [], { shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.stringMatching(/^linear-gradient\(22\.5deg,/)
    );
  });

  it('does not rotate when the angle control is hidden', () => {
    const { onChange, container } = renderGradient({
      initial: RED_BLUE,
      showGradientAngle: false
    });
    const result = container.querySelector('.gradient-result')!;
    mockRect(result, { width: 200, height: 100 });
    drag(result, { x: 100, y: 0 });
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('.gradient-angle')).not.toBeInTheDocument();
  });

  it('formats stop colors and drops alpha when showAlpha is false', async () => {
    const user = userEvent.setup();
    const initial =
      'linear-gradient(90deg, rgba(255, 0, 0, 0.5) 0%, #0000ff 100%)';
    const { onChange, unmount } = renderGradient({ initial, format: 'hex' });
    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, #ff000080 0.00%,#00ff00 100.00%)'
    );
    unmount();

    const opaque = renderGradient({ initial, format: 'hex', showAlpha: false });
    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(opaque.onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, #ff0000 0.00%,#00ff00 100.00%)'
    );
  });

  it('keeps fractional stop positions from the value', async () => {
    const user = userEvent.setup();
    const { onChange } = renderGradient({
      initial: 'linear-gradient(90deg, #ff0000 8.5%, #0000ff 91.25%)'
    });
    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, rgb(255, 0, 0) 8.50%,rgb(0, 255, 0) 91.25%)'
    );
  });

  it('applies colors and gradients through the ref', () => {
    const onChange = vi.fn();
    const ref = createRef<ReactGPickerHandle>();
    render(
      <ReactGPicker
        ref={ref}
        value={RED_BLUE}
        solid={false}
        gradient
        debounceMS={0}
        onChange={onChange}
      />
    );
    act(() => ref.current?.applyColor('#00ff00'));
    expect(onChange).toHaveBeenLastCalledWith(
      'linear-gradient(90deg, rgb(255, 0, 0) 0.00%,rgb(0, 255, 0) 100.00%)'
    );
    act(() =>
      ref.current?.applyColor('radial-gradient(circle at right, red, blue)')
    );
    expect(onChange).toHaveBeenLastCalledWith(
      'radial-gradient(circle at right, rgb(255, 0, 0) 0.00%,rgb(0, 0, 255) 100.00%)'
    );
  });

  it('picks a default gradient swatch', async () => {
    const user = userEvent.setup();
    const swatch =
      'linear-gradient(0deg, rgb(0, 198, 251) 0%, rgb(0, 91, 234) 100%)';
    const { onChange } = renderGradient({
      initial: RED_BLUE,
      defaultColors: [swatch, '#ff0000']
    });
    expect(screen.getAllByRole('button', { name: /gradient\(/ })).toHaveLength(
      1
    );
    await user.click(screen.getByRole('button', { name: swatch }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      'linear-gradient(0deg, rgb(0, 198, 251) 0.00%,rgb(0, 91, 234) 100.00%)'
    );
    expect(screen.getByRole('button', { name: swatch })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('turns a solid value into a gradient that ends with that color', () => {
    renderGradient({ initial: '#ff6900' });
    expect(hexInput()).toHaveValue('ff6900');
    expect(stops()).toHaveLength(2);
  });
});
