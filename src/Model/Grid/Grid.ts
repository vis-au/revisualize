import { BaseValueRef, RangeEnum, Signal, SignalRef } from 'vega';

export interface Grid {
  x: BaseValueRef<number>;
  y: BaseValueRef<number>;
  signals?: Signal[];
}

export interface RectangularGrid extends Grid {
  width: SignalRef|RangeEnum;
  height: SignalRef|RangeEnum;
}

export interface RadialGrid extends Grid {
  radius: SignalRef|RangeEnum;
  signals?: Signal[];
}

export interface FreeFormGrid extends Grid {}
