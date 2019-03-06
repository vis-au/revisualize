import { ArbitraryValueRef, Data, Encode, ProductionRule, SymbolEncodeEntry, SymbolMark } from 'vega';

import { DynamicValue } from '../Interactions/DynamicValue';
import { BasicVisualVariableList, SymbolVisualVariableList, SymbolVisualVariableName, VisualElement } from './VisualElement';

export default class Point implements VisualElement {
  public bindings: Map<SymbolVisualVariableName, ProductionRule<ArbitraryValueRef>>;
  public mainVariables: SymbolVisualVariableName[] = ['x', 'y', 'fill'];
  public dataset: Data = null;

  private _mark: SymbolMark = {
    name: 'Point',
    type: 'symbol',
  };

  constructor() {
    this.bindings = new Map();

    BasicVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
    SymbolVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
  }

  public update() {
    const encode: Encode<SymbolEncodeEntry> = {
      enter: {
        shape: { value: 'circle' }
      },
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

  public get mark(): SymbolMark {
    this.update();

    return this._mark;
  }
}