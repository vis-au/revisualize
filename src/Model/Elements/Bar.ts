import { ArbitraryValueRef, Data, Encode, ProductionRule, RectEncodeEntry, RectMark } from 'vega';
import { DynamicValue } from '../Interactions/DynamicValue';
import { BasicVisualVariableList, RectVisualVariableList, RectVisualVariableName, VisualElement } from './VisualElement';

export default class Bar implements VisualElement {
  public bindings: Map<RectVisualVariableName, ProductionRule<ArbitraryValueRef>>;
  public mainVariables: RectVisualVariableName[] = ['x', 'y', 'height', 'width', 'y2', 'fill'];
  public dataset: Data = null;

  private _mark: RectMark = {
    name: 'Bar',
    type: 'rect',
  };

  constructor() {
    this.bindings = new Map();

    BasicVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
    RectVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
  }

  public update() {
    const encode: Encode<RectEncodeEntry> = {
      enter: {},
      update: {}
    };

    this._mark.encode = encode;

    this.bindings.forEach((value, key) => {
      if (value === null) { return; }
      if (value instanceof DynamicValue) {
        encode.update[key] = value.productionRule;
      } else {
        encode.update[key] = value;
      }
    });

    if (this.dataset !== null) {
      this._mark.from = { data: this.dataset.name };
    } else {
      delete this._mark.from;
    }
  }

  public get mark(): RectMark {
    this.update();
    return this._mark;
  }
}