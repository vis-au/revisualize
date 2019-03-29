import { isMark, isMarkDef, isPrimitiveMark, Mark, MarkConfig, MarkDef } from 'vega-lite/build/src/mark';
import { SelectionDef } from 'vega-lite/build/src/selection';
import { MarkEncoding } from './MarkEncoding';
import Template from './Template';

export default class PlotTemplate extends Template {
  public selection?: SelectionDef;
  public staticMarkProperties?: Map<MarkEncoding, any>;

  public mark: MarkDef | Mark;

  constructor(parent: Template = null) {
    super([], null, parent);
  }

  public get type(): Mark {
    if (isPrimitiveMark(this.mark)) {
      return this.mark;
    } else if (isMarkDef(this.mark)) {
      return this.mark.type;
    }
  }

  public set type(type: Mark) {
    if (isPrimitiveMark(this.mark)) {
      this.mark = type;
    } else if (isMarkDef(this.mark)) {
      this.mark.type = type;
    }
  }
}