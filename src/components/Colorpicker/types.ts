import { TabValue } from '../../types';

export interface IPropsComp {
  value: string;
  format?: 'rgb' | 'hsl' | 'hex';
  debounceMS?: number;
  debounce?: boolean;
  showAlpha?: boolean;
  showInputs?: boolean;
  showGradientResult?: boolean;
  showGradientStops?: boolean;
  showGradientMode?: boolean;
  showGradientAngle?: boolean;
  showGradientPosition?: boolean;
  colorBoardHeight?: number;
  defaultColors?: string[];
  defaultActiveTab?: TabValue;
  onChangeTabs?: (tab: string) => void;
  onChange: (value: string) => void;
}

export interface IPropsMain extends IPropsComp {
  gradient?: boolean;
  solid?: boolean;
  popupWidth?: number;
}

export interface IActiveColor {
  hex: string;
  alpha: number;
  loc: string | number;
  index: string | number;
}
