import { createRef, StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import tinycolor from 'tinycolor2';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReactGPicker } from './ColorPicker';
import { STYLE_ELEMENT_ID } from './hooks/useInjectStyles';
import { Controlled, drag, mockRect } from './test/helpers';
import type { ReactGPickerHandle } from './types';

const hexInput = () => screen.getByRole('textbox', { name: 'Hex' });
const alphaInput = () => screen.getByRole('textbox', { name: 'Alpha' });
const slider = (name: string) => screen.getByRole('slider', { name });

afterEach(() => {
  vi.useRealTimers();
});

describe('rendering', () => {
  it.each([
    ['#ffffff', 'ffffff', '100'],
    ['rgba(0, 0, 0, 0.5)', '000000', '50'],
    ['black', '000000', '100'],
    ['hsl(0,0%,0%)', '000000', '100'],
    ['transparent', '000000', '0'],
    ['', 'ffffff', '100'],
    [undefined, 'ffffff', '100']
  ])('shows hex / alpha inputs for %j', (value, hex, alpha) => {
    render(<ReactGPicker value={value} />);
    expect(hexInput()).toHaveValue(hex);
    expect(alphaInput()).toHaveValue(alpha);
  });

  it('applies popupWidth, className and colorBoardHeight', () => {
    const { container, rerender } = render(
      <ReactGPicker
        value='#fff'
        popupWidth={300}
        colorBoardHeight={150}
        className='custom'
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('popup_tabs', 'custom');
    expect(root.style.width).toBe('300px');
    expect(
      (container.querySelector('.color-picker-panel-board-hsv') as HTMLElement)
        .style.height
    ).toBe('150px');

    rerender(<ReactGPicker value='#fff' popupWidth='100%' />);
    expect(root.style.width).toBe('100%');
  });

  it('renders nothing when both modes are disabled', () => {
    const { container } = render(
      <ReactGPicker solid={false} gradient={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the default swatches, or none for an empty list', () => {
    const { rerender } = render(<ReactGPicker value='#fff' />);
    expect(screen.getAllByRole('button')).toHaveLength(12);
    rerender(<ReactGPicker value='#fff' defaultColors={[]} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders every mode without React warnings', async () => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    const user = userEvent.setup();
    render(
      <StrictMode>
        <ReactGPicker value='#fff' />
        <ReactGPicker
          value='linear-gradient(90deg, red 0%, blue 100%)'
          solid={false}
          gradient
        />
        <ReactGPicker value='#fff' gradient />
      </StrictMode>
    );
    await user.click(screen.getByRole('tab', { name: 'Gradient' }));
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('injects its stylesheet once per document', () => {
    document.getElementById(STYLE_ELEMENT_ID)?.remove();
    render(
      <>
        <ReactGPicker value='#fff' />
        <ReactGPicker value='#000' />
      </>
    );
    const styles = document.head.querySelectorAll(`#${STYLE_ELEMENT_ID}`);
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent).toContain('.popup_tabs');
  });
});

describe('tabs', () => {
  it('only shows tabs when both modes are enabled', () => {
    const { rerender } = render(<ReactGPicker value='#fff' />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    rerender(<ReactGPicker value='#fff' gradient />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it.each([
    ['#fff', undefined, 'Solid'],
    ['linear-gradient(90deg, red 0%, blue 100%)', undefined, 'Gradient'],
    ['#fff', 'gradient', 'Gradient']
  ] as const)(
    'starts on the right tab for %s (defaultActiveTab %s)',
    (value, tab, expected) => {
      render(<ReactGPicker value={value} gradient defaultActiveTab={tab} />);
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        expected
      );
    }
  );

  it('switches with the mouse and keyboard, reporting real changes only', async () => {
    const onChangeTabs = vi.fn();
    const user = userEvent.setup();
    render(<ReactGPicker value='#fff' gradient onChangeTabs={onChangeTabs} />);

    await user.click(screen.getByRole('tab', { name: 'Gradient' }));
    expect(screen.getByRole('tab', { name: 'Gradient' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Gradient' })).toHaveClass(
      'popup_tabs-header-label popup_tabs-header-label-active'
    );
    expect(
      screen.getByRole('slider', { name: 'Color stop 1' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Gradient' }));
    expect(onChangeTabs).toHaveBeenCalledTimes(1);

    await user.keyboard('{ArrowRight}');
    expect(onChangeTabs).toHaveBeenLastCalledWith('solid');
    expect(screen.getByRole('tab', { name: 'Solid' })).toHaveFocus();
  });
});

describe('hex and alpha inputs', () => {
  it.each([
    ['rgb', 'rgb(255, 0, 0)'],
    ['hex', '#ff0000'],
    ['hsl', 'hsl(0, 100%, 50%)']
  ] as const)(
    'emits a committed hex in %s format',
    async (format, expected) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ReactGPicker
          value='#ffffff'
          format={format}
          debounceMS={0}
          onChange={onChange}
        />
      );
      await user.clear(hexInput());
      await user.type(hexInput(), 'ff0000{Enter}');
      expect(onChange).toHaveBeenCalledExactlyOnceWith(expected);
    }
  );

  it('reverts an invalid hex instead of emitting black', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ReactGPicker value='#ffffff' debounceMS={0} onChange={onChange} />);
    await user.clear(hexInput());
    await user.type(hexInput(), 'zxcxz');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(hexInput()).toHaveValue('ffffff');
  });

  it('takes alpha from an 8-digit hex', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled initial='#ffffff' onChange={onChange} />);
    await user.clear(hexInput());
    await user.type(hexInput(), '#ff000080{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('rgba(255, 0, 0, 0.5)');
    expect(alphaInput()).toHaveValue('50');
  });

  it('commits typed alpha values, parsing "05" as 5 and clamping to 100', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled initial='#ffffff' onChange={onChange} />);

    await user.clear(alphaInput());
    await user.type(alphaInput(), '05{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('rgba(255, 255, 255, 0.05)');
    expect(alphaInput()).toHaveValue('5');

    await user.clear(alphaInput());
    await user.type(alphaInput(), '250{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('rgb(255, 255, 255)');
    expect(alphaInput()).toHaveValue('100');
  });

  it('steps alpha with the arrow keys (Shift for 10)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled initial='#ffffff' format='hex' onChange={onChange} />);
    await user.click(alphaInput());
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('#fffffffc');
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    expect(onChange).toHaveBeenLastCalledWith('#ffffffe3');
    expect(alphaInput()).toHaveValue('89');
    await user.keyboard('{Shift>}{ArrowUp}{ArrowUp}{/Shift}');
    expect(alphaInput()).toHaveValue('100');
  });

  it('leaves arrow keys alone when another handler already handled them', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDownCapture={(e) => e.preventDefault()}>
        <ReactGPicker value='#ffffff' debounceMS={0} onChange={onChange} />
      </div>
    );
    await user.click(alphaInput());
    await user.keyboard('{ArrowDown}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides alpha and emits opaque colors when showAlpha is false', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ReactGPicker
        value='rgba(255, 0, 0, 0.5)'
        showAlpha={false}
        debounceMS={0}
        onChange={onChange}
      />
    );
    expect(
      screen.queryByRole('textbox', { name: 'Alpha' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('slider', { name: 'Alpha' })
    ).not.toBeInTheDocument();
    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgb(0, 255, 0)');
  });

  it('hides the inputs when showInputs is false', () => {
    render(<ReactGPicker value='#fff' showInputs={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

describe('onChange emission', () => {
  it('does not emit without user changes (empty value, focus and blur)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ReactGPicker value='' format='hex' debounceMS={0} onChange={onChange} />
    );
    await user.click(hexInput());
    await user.click(alphaInput());
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('debounces and only emits the latest value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(
      <ReactGPicker value='#ff0000' debounceMS={300} onChange={onChange} />
    );
    const alpha = slider('Alpha');
    fireEvent.keyDown(alpha, { key: 'ArrowLeft' });
    fireEvent.keyDown(alpha, { key: 'ArrowLeft' });
    fireEvent.keyDown(alpha, { key: 'ArrowLeft' });
    act(() => vi.advanceTimersByTime(299));
    expect(onChange).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgba(255, 0, 0, 0.97)');
  });

  it('emits immediately when debounce is false', () => {
    const onChange = vi.fn();
    render(
      <ReactGPicker
        value='#ff0000'
        debounce={false}
        debounceMS={300}
        onChange={onChange}
      />
    );
    fireEvent.keyDown(slider('Alpha'), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgba(255, 0, 0, 0.99)');
  });

  it('flushes a pending change on unmount instead of dropping it', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { unmount } = render(
      <ReactGPicker value='#ff0000' onChange={onChange} />
    );
    fireEvent.keyDown(slider('Alpha'), { key: 'Home' });
    unmount();
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgba(255, 0, 0, 0)');
  });

  it('ignores echoes of its own values but adopts external changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Controlled
        initial='#ff0000'
        format='hex'
        external={['#0000ff', '#00ff00']}
        onChange={onChange}
      />
    );

    await user.clear(hexInput());
    await user.type(hexInput(), '00ff00{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('#00ff00');

    await user.click(screen.getByRole('button', { name: 'external 0' }));
    expect(hexInput()).toHaveValue('0000ff');

    // Back to the value the picker emitted earlier: still an external change.
    await user.click(screen.getByRole('button', { name: 'external 1' }));
    expect(hexInput()).toHaveValue('00ff00');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('sliders', () => {
  it('picks saturation / brightness by dragging the board', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ReactGPicker value='#ff0000' debounceMS={0} onChange={onChange} />
    );
    mockRect(container.querySelector('.color-picker-panel-board')!, {
      width: 200,
      height: 100
    });
    drag(slider('Saturation and brightness'), { x: 100, y: 50 });
    expect(onChange).toHaveBeenLastCalledWith(
      tinycolor({ h: 0, s: 0.5, v: 0.5 }).toRgbString()
    );
  });

  it('keeps the hue when the color passes through black', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Controlled initial='#00ff00' format='hex' onChange={onChange} />
    );
    mockRect(container.querySelector('.color-picker-panel-board')!, {
      width: 200,
      height: 100
    });
    const board = slider('Saturation and brightness');

    drag(board, { x: 200, y: 100 });
    expect(onChange).toHaveBeenLastCalledWith('#000000');
    drag(board, { x: 200, y: 0 });
    expect(onChange).toHaveBeenLastCalledWith('#00ff00');
    expect(slider('Hue')).toHaveAttribute('aria-valuenow', '120');
  });

  it('drags the hue and alpha sliders', () => {
    const onChange = vi.fn();
    render(<Controlled initial='#ff0000' onChange={onChange} />);
    mockRect(slider('Hue'), { width: 360, height: 8 });
    mockRect(slider('Alpha'), { width: 100, height: 8 });

    drag(slider('Hue'), { x: 0, y: 4 }, [{ x: 240, y: 4 }]);
    expect(onChange).toHaveBeenLastCalledWith('rgb(0, 0, 255)');
    drag(slider('Alpha'), { x: 25, y: 4 });
    expect(onChange).toHaveBeenLastCalledWith('rgba(0, 0, 255, 0.25)');
  });

  it('ignores secondary mouse buttons', () => {
    const onChange = vi.fn();
    render(<ReactGPicker value='#ff0000' debounceMS={0} onChange={onChange} />);
    mockRect(slider('Alpha'), { width: 100, height: 8 });
    drag(slider('Alpha'), { x: 25, y: 4 }, [], { button: 2 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports the keyboard on the hue, alpha and board sliders', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled initial='#ff0000' format='hex' onChange={onChange} />);

    slider('Hue').focus();
    await user.keyboard('{PageUp}');
    expect(onChange).toHaveBeenLastCalledWith(
      tinycolor({ h: 10, s: 1, v: 1 }).toHexString()
    );

    slider('Saturation and brightness').focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(
      tinycolor({ h: 10, s: 1, v: 0.99 }).toHexString()
    );

    slider('Alpha').focus();
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(
      tinycolor({ h: 10, s: 1, v: 0.99, a: 0 }).toHex8String()
    );
  });

  it('makes a fully transparent color opaque when a color is picked', () => {
    const onChange = vi.fn();
    render(
      <ReactGPicker
        value='transparent'
        format='hex'
        debounceMS={0}
        onChange={onChange}
      />
    );
    fireEvent.keyDown(slider('Hue'), { key: 'End' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith('#000000');
    fireEvent.keyDown(slider('Saturation and brightness'), {
      key: 'ArrowUp',
      shiftKey: true
    });
    expect(onChange).toHaveBeenLastCalledWith('#1a1a1a');
  });
});

describe('swatches and imperative API', () => {
  it('emits a clicked swatch and marks the matching one', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled initial='#ffffff' onChange={onChange} />);
    const swatch = screen.getByRole('button', { name: '#FF6900' });
    expect(swatch).toHaveAttribute('aria-pressed', 'false');
    await user.click(swatch);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgb(255, 105, 0)');
    expect(swatch).toHaveAttribute('aria-pressed', 'true');
    expect(swatch).toHaveClass('default-color-panel_item-active');
  });

  it('ignores invalid default colors', () => {
    render(
      <ReactGPicker
        value='#fff'
        defaultColors={['#ff0000', 'nope', '#ff0000', 'red']}
      />
    );
    expect(
      screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))
    ).toEqual(['#ff0000', 'red']);
  });

  it('applies colors through the ref', () => {
    const onChange = vi.fn();
    const ref = createRef<ReactGPickerHandle>();
    render(
      <ReactGPicker
        ref={ref}
        value='#ffffff'
        debounceMS={0}
        onChange={onChange}
      />
    );
    act(() => ref.current?.applyColor('#00ff00'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rgb(0, 255, 0)');
    expect(hexInput()).toHaveValue('00ff00');
    act(() => ref.current?.applyColor('not a color'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
