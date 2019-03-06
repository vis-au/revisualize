import { ArbitraryValueRef, Data, Encode, LineEncodeEntry, LineMark, ProductionRule } from 'vega';
import { DynamicValue } from '../Interactions/DynamicValue';
import { BasicVisualVariableList, LineVisualVariableList, LineVisualVariableName, VisualElement } from './VisualElement';

export default class Line implements VisualElement {
  public bindings: Map<LineVisualVariableName, ProductionRule<ArbitraryValueRef>>;
  public mainVariables: LineVisualVariableName[] = ['x', 'y', 'stroke', 'interpolate'];
  public dataset: Data = null;

  private _mark: LineMark = {
    name: 'Line',
    type: 'line',
  };

  constructor() {
    this.bindings = new Map();

    BasicVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
    LineVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
  }

  public update() {
    const encode: Encode<LineEncodeEntry> = {
      enter: {},
      update: {}
    };

    this.bindings.forEach((value, key) => {
      if (value === null) { return; }
      if (value instanceof DynamicValue) {
        encode.update[key] = value.productionRule;
      } else {
        encode.update[key] = value;
      }
    });

    this._mark.encode = encode;

    if (this.dataset !== null) {
      this._mark.from = { data: this.dataset.name };
    } else {
      delete this._mark.from;
    }
  }

  public get mark(): LineMark {
    this.update();

    return this._mark;
  }
}