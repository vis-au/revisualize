import { ArbitraryValueRef, Data, Encode, PathEncodeEntry, PathMark, ProductionRule } from 'vega';
import { DynamicValue } from '../Interactions/DynamicValue';
import { BasicVisualVariableList, PathVisualVariableList, PathVisualVariableName, VisualElement } from './VisualElement';

export default class Flow implements VisualElement {
  public bindings: Map<PathVisualVariableName, ProductionRule<ArbitraryValueRef>>;
  public mainVariables: PathVisualVariableName[] = ['path', 'fill', 'stroke'];
  public dataset: Data = null;

  private _mark: PathMark = {
    name: 'Flow',
    type: 'path',
  };

  constructor() {
    this.bindings = new Map();

    BasicVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
    PathVisualVariableList.forEach(variable => {
      this.bindings.set(variable, null);
    });
  }

  public update() {
    const encode: Encode<PathEncodeEntry> = {
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

  public get mark(): PathMark {
    this.update();

    return this._mark;
  }
}