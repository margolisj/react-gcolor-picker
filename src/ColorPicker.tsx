import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import type { KeyboardEvent } from 'react';

import { Gradient } from './components/Gradient';
import type { ColorApplier, PanelProps } from './components/panelTypes';
import { Solid } from './components/Solid';
import { DEFAULT_COLORS } from './constants';
import { useDebouncedCallback } from './hooks/useDebouncedCallback';
import { useInjectStyles } from './hooks/useInjectStyles';
import { useIsomorphicLayoutEffect, useLatest } from './hooks/useLatest';
import type { ReactGPickerHandle, ReactGPickerProps, TabValue } from './types';
import { isGradientString } from './utils/color';
import { isActivationKey } from './utils/keyboard';

const TABS: ReadonlyArray<{ value: TabValue; label: string }> = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' }
];

const detectTab = (value: string | undefined): TabValue =>
  isGradientString(value) ? 'gradient' : 'solid';

/**
 * Solid and gradient (linear / radial) color picker.
 *
 * `value` is treated as controlled-but-tolerant: echoes of values the picker
 * emitted are ignored (so a debounced round-trip never resets an in-progress
 * drag), while any other change to `value` is adopted.
 */
export const ReactGPicker = forwardRef<ReactGPickerHandle, ReactGPickerProps>(
  function ReactGPicker(
    {
      value,
      format = 'rgb',
      gradient = false,
      solid = true,
      debounceMS = 300,
      debounce = true,
      showAlpha = true,
      showInputs = true,
      showGradientResult = true,
      showGradientStops = true,
      showGradientMode = true,
      showGradientAngle = true,
      showGradientPosition = true,
      popupWidth = 267,
      colorBoardHeight = 120,
      defaultColors = DEFAULT_COLORS,
      defaultActiveTab,
      className,
      onChangeTabs,
      onChange
    },
    ref
  ) {
    const id = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<ColorApplier>(null);
    useInjectStyles(rootRef);

    const [activeTab, setActiveTab] = useState<TabValue>(
      () => defaultActiveTab ?? detectTab(value)
    );

    // --- Distinguish external value changes from echoes of our own emissions.
    const [lastEmitted, setLastEmitted] = useState<string | undefined>();
    const [syncedValue, setSyncedValue] = useState(value);
    const [revision, setRevision] = useState(0);
    if (value !== syncedValue) {
      setSyncedValue(value);
      if (value !== lastEmitted) setRevision((r) => r + 1);
      if (lastEmitted !== undefined) setLastEmitted(undefined);
    }

    // --- Emission: debounced, de-duplicated against what the parent last saw.
    const knownValue = useRef(value);
    useIsomorphicLayoutEffect(() => {
      knownValue.current = value;
    }, [value]);
    const onChangeRef = useLatest(onChange);
    const emit = useDebouncedCallback(
      (next: string) => {
        if (next === knownValue.current) return;
        knownValue.current = next;
        setLastEmitted(next);
        onChangeRef.current?.(next);
      },
      debounce ? Math.max(0, debounceMS) : 0
    );

    useImperativeHandle(
      ref,
      () => ({
        applyColor: (color: string) => panelRef.current?.applyColor(color)
      }),
      []
    );

    const showTabs = solid && gradient;
    const tab: TabValue | null = showTabs
      ? activeTab
      : solid
        ? 'solid'
        : gradient
          ? 'gradient'
          : null;
    if (tab === null) return null;

    const changeTab = (next: TabValue) => {
      if (next === activeTab) return;
      setActiveTab(next);
      onChangeTabs?.(next);
    };

    const onTabKeyDown = (
      event: KeyboardEvent<HTMLDivElement>,
      index: number
    ) => {
      if (isActivationKey(event)) {
        event.preventDefault();
        changeTab(TABS[index].value);
        return;
      }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const nextIndex = (index + 1) % TABS.length;
      changeTab(TABS[nextIndex].value);
      (
        event.currentTarget.parentElement?.children[nextIndex] as
          HTMLElement | undefined
      )?.focus();
    };

    const panelProps: PanelProps = {
      value,
      revision,
      format,
      showAlpha,
      showInputs,
      colorBoardHeight,
      defaultColors,
      emit
    };

    const panel =
      tab === 'solid' ? (
        <Solid ref={panelRef} {...panelProps} />
      ) : (
        <Gradient
          ref={panelRef}
          {...panelProps}
          showGradientResult={showGradientResult}
          showGradientStops={showGradientStops}
          showGradientMode={showGradientMode}
          showGradientAngle={showGradientAngle}
          showGradientPosition={showGradientPosition}
        />
      );

    const panelId = `${id}-panel`;
    const tabId = (value: TabValue) => `${id}-tab-${value}`;

    return (
      <div
        ref={rootRef}
        className={className ? `popup_tabs ${className}` : 'popup_tabs'}
        style={{ width: popupWidth }}
      >
        {showTabs && (
          <div
            className='popup_tabs-header'
            role='tablist'
            aria-label='Color type'
          >
            {TABS.map((t, index) => {
              const selected = t.value === tab;
              return (
                <div
                  key={t.value}
                  id={tabId(t.value)}
                  role='tab'
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  className={`popup_tabs-header-label${
                    selected ? ' popup_tabs-header-label-active' : ''
                  }`}
                  onClick={() => changeTab(t.value)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                >
                  {t.label}
                </div>
              );
            })}
          </div>
        )}
        <div className='popup_tabs-body'>
          {showTabs ? (
            <div
              className='popup_tabs-body-item'
              role='tabpanel'
              id={panelId}
              aria-labelledby={tabId(tab)}
            >
              {panel}
            </div>
          ) : (
            panel
          )}
        </div>
      </div>
    );
  }
);
