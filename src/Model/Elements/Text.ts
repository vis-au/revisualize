import { ArbitraryValueRef, Data, Encode, ProductionRule, TextEncodeEntry, TextMark } from 'vega';
import { DynamicValue } from '../Interactions/DynamicValue';
import { BasicVisualVariableList, TextVisualVariableList, TextVisualVariableName, VisualElement } from './VisualElement';

export default class Text implements VisualElement {
  public bindings: Map<TextVisualVariableName, ProductionRule<ArbitraryValueRef>>;
  public mainVariables: TextVisualVariableName[] = ['x', 'y', 'stroke', 'text'];
  public dataset: Data = null;

  private _mark: TextMark = {
    name: 'Text',
    type: 'text',
  };

  constructor() {
    this.bindings = new Map();

    BasicVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
    TextVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
  }

  public update() {
    const encode: Encode<TextEncodeEntry> = {
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

  public get mark(): TextMark {
    this.update();

    return this._mark;
  }
}