import { PointScale, RangeEnum } from 'vega';

import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';
import { LayoutStructure } from './LayoutStructure';

export default class List implements LayoutStructure {
  public pattern: Pattern;
  public height: RangeEnum;
  public width: RangeEnum;

  private _dataset: DataflowNode;

  private useListDefaults: boolean = true;

  private listScale: PointScale = {
    name: 'list',
    range: 'height',
    type: 'point',
  };

  public update() {
    this.updateDefaultBindings();
  }

  public get name() { return 'List'; }

  private updateDefaultBindings() {
    if (!this.useListDefaults) { return; }
    if (this.pattern.visualElement === null) { return; }

    if (this.listScale.domain !== undefined) {
      this.pattern.visualElement.bindings.set('y', {
        field: (this.listScale.domain as any).field,
        scale: this.listScale.name,
      });

      this.useListDefaults = false;
    }
  }

  public get scales(): PointScale[] {
    return [ this.listScale ];
  }

  public get dataset(): DataflowNode {
    return this._dataset;
  }
  public set dataset(dataset: DataflowNode) {
    this._dataset = dataset;
    delete this.listScale.domain;

    this.useListDefaults = true;
  }

  public get blockedVisualVariables(): ArbitraryVisualVariableName[] {
    return [];
  }
}