import { Axis, LinearScale } from 'vega';

import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';
import { LayoutStructure } from './LayoutStructure';

export default class TwoDimensionalPlot implements LayoutStructure {
  public pattern: Pattern;

  private _dataset: DataflowNode;

  private useHorizontalDefaults: boolean = true;
  private useVerticalDefaults: boolean = true;

  private horizontalScale: LinearScale = {
    name: 'horizontal',
    range: 'width',
    type: 'linear',
    zero: true
  };
  private verticalScale: LinearScale = {
    name: 'vertical',
    range: 'height',
    type: 'linear',
    zero: true
  };

  public get name() { return '2D Plot'; }

  public update() {
    this.updateDefaultBindings()
  }

  private updateDefaultBindings() {
    if (this.pattern.visualElement === null) { return; }

    if (this.horizontalScale.domain !== undefined && this.useHorizontalDefaults) {
      this.pattern.visualElement.bindings.set('x', {
        field: (this.horizontalScale.domain as any).field,
        scale: this.horizontalScale.name,
      });

      this.useHorizontalDefaults = false;
    }

    if (this.verticalScale.domain !== undefined && this.useVerticalDefaults) {
      this.pattern.visualElement.bindings.set('y', {
        field: (this.verticalScale.domain as any).field,
        scale: this.verticalScale.name,
      });

      this.useVerticalDefaults = false;
    }
  }

  public get scales(): LinearScale[] {
    const scales: LinearScale[] = [
      this.horizontalScale,
      this.verticalScale
    ];

    return scales;
  }

  public get dataset(): DataflowNode {
    return this._dataset;
  }
  public set dataset(dataset: DataflowNode) {
    delete this.horizontalScale.domain;
    delete this.verticalScale.domain;

    this.useHorizontalDefaults = true;
    this.useVerticalDefaults = true;

    this._dataset = dataset;
  }

  public get axes(): Axis[] {
    const leftAxis: Axis = {
      orient: 'bottom',
      scale: this.horizontalScale.name
    };

    const bottomAxis: Axis = {
      orient: 'left',
      scale: this.verticalScale.name
    };

    const axes: Axis[] = [
      bottomAxis, leftAxis
    ];

    return axes;
  }

  public get blockedVisualVariables(): ArbitraryVisualVariableName[] {
    return [];
  }
}