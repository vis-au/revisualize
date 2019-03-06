import { Axis, Data, GroupMark, LinearScale, LineMark, Mark, RuleMark, Scale, Signal, TextMark, Transform } from 'vega';
import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';
import { LayoutStructure } from './LayoutStructure';

// adapted from https://github.com/vega/vega/issues/1085#issuecomment-349078017

export default class RadialLayout implements LayoutStructure {
  private _transformedData: Data[];
  private _transformedMarks: Mark[];
  private _transformedScales: Scale[];
  private _transformedSignals: Signal[];

  private starplotData: Data[] = null;
  private fieldNameExpansionData: Data = null;
  private foldData: Data = null;
  private fieldsData: Data = null;
  private starPlotMark: Mark = null;
  private angleScale: Scale = null;

  private radiusRange: Signal = null;
  private radius: Signal = null;


  private _pattern: Pattern;
  public dataset: DataflowNode;

  public get name() { return 'Radial'; }

  public update() {
    this.updateTransformedElements();
  }

  private updateTransformedElements() {
    this.starplotData = null;
    this.foldData = null;
    this.fieldsData = null;
    this.starPlotMark = null;

    this.radius = {
      name: `radius${this._pattern.id}`,
      update: 'width / 2'
    };
    this.radiusRange = {
      name: `radiusRange${this._pattern.id}`,
      update: '[0, width / 2]'
    };

    this._transformedData = this.getTransformedData();
    this._transformedScales = this.getTransformedScales();
    this._transformedSignals = [ this.radius, this.radiusRange ];
    this._transformedMarks = this.getTransformedMarks();
  }

  public get scales(): Scale[] {
    return [];
  }

  private getTransformedData() {
    let transformedData: Data[] = [];

    if (this._pattern.visualElement === null) { return transformedData; }
    if (this._pattern.dataset === null) { return transformedData; }

    this.starplotData = this.getStarplotData();
    transformedData = transformedData.concat(this.starplotData);

    return transformedData;
  }

  private getStarplotData(): Data[] {
    const starplotData: Data[] = [];

    this.fieldNameExpansionData = {
      name: `expanded${this._pattern.id}`,
      source: this._pattern.dataset.name,
      transform: this._pattern.dataset.fields.map(field => {
        return {
          type: 'formula',
          expr: `datum.${field}`,
          as: `${field}${this._pattern.id}`
        } as Transform;
      })
    };

    this.foldData = {
      name: `folded${this._pattern.id}`,
      source: `expanded${this._pattern.id}`,
      transform: [
        {
          type: 'fold',
          fields: this._pattern.dataset.fields.map(f => `${f}${this._pattern.id}`)
        }
      ]
    };

    this.fieldsData = {
      name: `fields${this._pattern.id}`,
      source: this.foldData.name,
      transform: [
        {
          type: 'aggregate',
          groupby: ['key'],
          fields: ['value', 'value'],
          ops: ['min', 'max']
        }
      ]
    };

    starplotData.push(this.fieldNameExpansionData);
    starplotData.push(this.foldData);
    starplotData.push(this.fieldsData);

    return starplotData;
  }

  private getTransformedScales(): Scale[] {
    const transformedScales: Scale[] = [];

    if (this._pattern.dataset === null) { return transformedScales; }
    if (this.fieldsData === null) { return transformedScales; }

    this.angleScale = {
      name: `angleScale${this._pattern.id}`,
      type: 'point',
      range: [ 2 * Math.PI, 0 ],
      padding: 0.5,
      domain: {
        data: this.fieldsData.name,
        field: 'key'
      }
    };

    transformedScales.push(this.angleScale);

    this._pattern.dataset.fields.forEach(field => {
      const fieldScale: Scale = {
        name: `${field}${this._pattern.id}`,
        type: 'linear',
        range: {
          signal: this.radiusRange.name
        },
        zero: true,
        nice: true,
        domain: {
          data: this._pattern.dataset.name,
          field
        }
      };

      transformedScales.push(fieldScale);
    });

    return transformedScales;
  }

  private getTransformedMarks(): Mark[] {
    let transformedMarks: Mark[] = [];

    if (this.foldData === null) { return transformedMarks; }
    if (this.fieldsData === null) { return transformedMarks; }
    if (this._pattern.visualElement === null) { return transformedMarks; }

    this.starPlotMark = this.getRadialMark();
    const layoutMarks = this.getLayoutMarks();

    transformedMarks = transformedMarks.concat(layoutMarks);
    transformedMarks.push(this.starPlotMark);

    return transformedMarks;
  }

  private getRadialMark(): Mark {
    const radialMark: LineMark = JSON.parse(JSON.stringify(this._pattern.visualElement.mark));

    radialMark.from = {
      data: this.foldData.name
    };

    radialMark.encode.update.x = {
      signal: `scale(datum.key, datum.value) * cos(scale('${this.angleScale.name}', datum.key))`
    };
    radialMark.encode.update.y = {
      signal: `scale(datum.key, datum.value) * sin(scale('${this.angleScale.name}', datum.key))`
    };

    return radialMark;
  }

  private getLayoutMarks(): Mark[] {
    const layoutMarks: Mark[] = [];

    const gridMark: RuleMark = {
      name: 'grid',
      from: {
        data: this.fieldsData.name
      },
      type: 'rule',
      encode: {
        update: {
          x: {
            signal: `1 * ${this.radius.name} * cos(scale('${this.angleScale.name}', datum.key))`
          },
          y: {
            signal: `1 * ${this.radius.name} * sin(scale('${this.angleScale.name}', datum.key))`
          },
          x2: { value: 0 },
          y2: { value: 0 },
          stroke: { value: '#ccc'}
        }
      }
    };
    const labelMark: TextMark = {
      name: 'label',
      type: 'text',
      from: {
        data: this.fieldsData.name
      },
      encode: {
        update: {
          x: {
            signal: `1.2 * ${this.radius.name} * cos(scale('${this.angleScale.name}', datum.key))`
          },
          y: {
            signal: `1.2 * ${this.radius.name} * sin(scale('${this.angleScale.name}', datum.key))`
          },
          baseline: { value: 'top' },
          text: { signal: '"max of " + format(datum.max_value, ".2f")' },
          align: { value: 'center' },
          fill: { value: '#888' }
        }
      }
    };
    const scaleMark: TextMark = {
      name: 'scale',
      type: 'text',
      from: {
        data: this.fieldsData.name
      },
      encode: {
        update: {
          x: {
            signal: `1.2 * ${this.radius.name} * cos(scale('${this.angleScale.name}', datum.key))`
          },
          y: {
            signal: `1.2 * ${this.radius.name} * sin(scale('${this.angleScale.name}', datum.key))`
          },
          baseline: { value: 'bottom' },
          text: { field: 'key' },
          align: { value: 'center' },
          fill: { value: '#888' }
        }
      }
    };

    layoutMarks.push(gridMark);
    layoutMarks.push(labelMark);
    layoutMarks.push(scaleMark);

    return layoutMarks;
  }

  public get pattern() {
    return this._pattern;
  }
  public set pattern(pattern: Pattern) {
    this._pattern = pattern;
  }

  public get axes(): Axis[] {
    return [];
  }

  public get blockedVisualVariables(): ArbitraryVisualVariableName[] {
    const blockedVisualVariables: ArbitraryVisualVariableName[] = ['x', 'y'];
    return blockedVisualVariables;
  }

  public get transformedDatasets() {
    return this._transformedData;
  }

  public get transformedMarks() {
    return this._transformedMarks;
  }

  public get transformedScales() {
    return this._transformedScales;
  }

  public get transformedSignals() {
    return this._transformedSignals;
  }
}