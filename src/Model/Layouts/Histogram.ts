import { Axis, LinearScale, PointScale } from 'vega';

import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';
import { LayoutStructure } from './LayoutStructure';

export default class Histogram implements LayoutStructure {
  public pattern: Pattern;

  private _dataset: DataflowNode;

  private useHorizontalDefaults: boolean = true;
  private useVerticalDefaults: boolean = true;

  private horizontalScale: PointScale = {
    name: 'bins',
    padding: 0.25,
    range: 'width',
    round: true,
    type: 'point',
  };
  private verticalScale: LinearScale = {
    name: 'values',
    nice: true,
    range: 'height',
    type: 'linear',
  };

  private bottomAxis: Axis;
  private leftAxis: Axis;

  public get name() { return 'Histogram'; }

  public update() {
    this.updateDefaultBindings();
  }

  private updateDefaultBindings() {
    if (!this.useHorizontalDefaults && !this.useVerticalDefaults) { return; }

    if (this.pattern.visualElement === null) { return; }

    // TODO: stack the values for the vertical scale field and group them by the horizontal scale
    if (this.horizontalScale.domain !== undefined && this.pattern.visualElement !== null && this.useHorizontalDefaults) {
      this.pattern.visualElement.bindings.set('xc', {
        field: (this.horizontalScale.domain as any).field,
        scale: this.horizontalScale.name,
      });

      this.pattern.visualElement.bindings.set('xc', {
        field: (this.horizontalScale.domain as any).field,
        scale: this.horizontalScale.name,
      });

      this.useHorizontalDefaults = false;
    }

    if (this.verticalScale.domain !== undefined && this.pattern.visualElement !== null && this.useVerticalDefaults) {

      if (this.pattern.visualElement.mark.type === 'rect') {
        this.pattern.visualElement.bindings.set('y', {
          scale: this.verticalScale.name,
          field: (this.verticalScale.domain as any).field,
        });
        this.pattern.visualElement.bindings.set('y2', {
          scale: this.verticalScale.name,
          signal: '0'
        });
      } else {
        this.pattern.visualElement.bindings.set('y', {
          field: (this.verticalScale.domain as any).field,
          scale: this.verticalScale.name,
        });
      }

      this.useVerticalDefaults = false;
    }
  }

  public get scales(): Array<PointScale|LinearScale> {
    const scales = [
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
    this.leftAxis = {
      orient: 'bottom',
      scale: this.horizontalScale.name
    };

    this.bottomAxis = {
      orient: 'left',
      scale: this.verticalScale.name
    };

    const axes: Axis[] = [
      this.bottomAxis,
      this.leftAxis
    ];

    return axes;
  }

  public get blockedVisualVariables(): ArbitraryVisualVariableName[] {
    const blocked: ArbitraryVisualVariableName[] = [];

    if (this.verticalScale.domain !== undefined && this.pattern.visualElement !== null) {
      if (this.pattern.visualElement.mark.type === 'rect') {
        blocked.push('y');
      }
    }

    return blocked;
  }
}