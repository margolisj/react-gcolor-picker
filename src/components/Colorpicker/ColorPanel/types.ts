import { Dispatch, SetStateAction } from 'react';

import { ITinyColor } from '../../../utils/color';
import { HexAlpha } from '../../../types';

export type TPropsComp = {
  rootPrefixCls?: string;
  color: ITinyColor;
  alpha?: number;
  colorBoardHeight?: number;
  onChange: (color: ITinyColor) => void;
  setChange: Dispatch<SetStateAction<boolean>>;
};

export type TPropsCompAlpha = {
  rootPrefixCls?: string;
  color: ITinyColor;
  alpha?: number;
  showAlpha?: boolean;
  onChange: (alpha: number) => void;
  setChange: Dispatch<SetStateAction<boolean>>;
};

export type TPropsMain = {
  alpha: number;
  className?: string;
  hex: string;
  showAlpha?: boolean;
  colorBoardHeight?: number;
  onChange: ({ alpha, hex }: HexAlpha) => void;
};

export type TCoords = {
  x: number;
  y: number;
};
