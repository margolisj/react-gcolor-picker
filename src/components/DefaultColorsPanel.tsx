import { isActivationKey } from '../utils/keyboard';

interface DefaultColorsPanelProps {
  /** Valid, de-duplicated colors (solid colors or gradients). */
  colors: string[];
  /** Index of the swatch matching the current color, or -1. */
  activeIndex: number;
  type: 'solid' | 'gradient';
  onSelect: (color: string) => void;
}

/** Grid of preset swatches. */
export const DefaultColorsPanel = ({
  colors,
  activeIndex,
  type,
  onSelect
}: DefaultColorsPanelProps) => {
  if (colors.length === 0) return null;

  return (
    <div className='default-color-panel'>
      {colors.map((color, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={color}
            role='button'
            tabIndex={0}
            title={color}
            aria-label={color}
            aria-pressed={active}
            className={`default-color-panel_item${
              active ? ' default-color-panel_item-active' : ''
            }`}
            style={{
              background: color,
              boxShadow:
                type === 'solid' && active ? `${color} 0px 0px 4px` : undefined
            }}
            onClick={() => onSelect(color)}
            onKeyDown={(e) => {
              if (!isActivationKey(e)) return;
              e.preventDefault();
              onSelect(color);
            }}
          >
            <div className='item_qub' />
          </div>
        );
      })}
    </div>
  );
};
