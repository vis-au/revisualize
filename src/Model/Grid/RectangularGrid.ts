import { BaseValueRef, RangeEnum, Signal, SignalRef } from 'vega';
import { RectangularGrid } from './Grid';

export default class Rectangular implements RectangularGrid {
  public x: BaseValueRef<number>;
  public y: BaseValueRef<number>;
  public width: SignalRef|RangeEnum;
  public height: SignalRef|RangeEnum;

  constructor() {
    this.x = {
      value: 0
    };

    this.y = {
      value: 0
    };

    this.width = 'width';
    this.height = 'height';
  }

  public get signals(): Signal[] {
    return [];
  }
}