import { Axis, Data, Encode, GroupMark, LinearScale, LineEncodeEntry, LineMark, Mark, PathEncodeEntry,PathMark, PointScale, RectEncodeEntry, RectMark,  Scale } from 'vega';

import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';
import { LayoutStructure } from './LayoutStructure';

export default class ParallelPlot implements LayoutStructure {
  private _transformedData: Data[];
  private _transformedMarks: Mark[];
  private _transformedScales: Scale[];

  private categoryData: Data = null;
  private ribbonData: Data[] = null;
  private parallelCoordinatesData: Data = null;
  private categoryMark: RectMark = null;
  private ribbonMark: PathMark = null;
  private parallelCoordinatesMark: GroupMark = null;
  private verticalScale: LinearScale = null;
  private invertedVerticalScale: LinearScale = null;
  private horizontalScale: PointScale = null;

  private _pattern: Pattern;
  public dataset: DataflowNode;

  public get name() { return 'Parallel Plot'; }

  public update() {
    this.updateTransformedElements();
  }

  private updateTransformedElements() {
    this.horizontalScale = null;
    this.verticalScale = null;
    this.categoryData = null;
    this.categoryMark = null;
    this.ribbonData = null;
    this.ribbonMark = null;
    this.parallelCoordinatesData = null;
    this.parallelCoordinatesMark = null;

    this._transformedData = this.getTransformedData();
    this._transformedScales = this.getTransformedScales();
    this._transformedMarks = this.getTransformedMarks();
  }

  public get scales(): Scale[] {
    // all layout scales are private and cannot be modified by the user
    return [];
  }

  public get axes(): Axis[] {
    if (this.horizontalScale === null) { return []; }

    const axes: Axis[] = [];

    const bottom: Axis = {
      orient: 'bottom',
      scale: this.horizontalScale.name
    };

    axes.push(bottom);

    if (this.pattern.dataset === null) { return axes; }
    if (this.pattern.visualElement === null) { return axes; }
    if (this.pattern.visualElement.mark.type === 'line') {
      // one axis per vertical dimension, which each represents a field from the data
      this.pattern.dataset.fields.forEach(field => {
        const newAxis: Axis = {
          orient: 'left',
          scale: field,
          title: field,
          offset: {
            scale: this.horizontalScale.name, value: field, mult: -1
          }
        };

        axes.push(newAxis);
      });
    }

    return axes;
  }

  public get pattern(): Pattern {
    return this._pattern;
  }
  public set pattern(pattern: Pattern) {
    this._pattern = pattern;
    this.update();
  }

  private getTransformedData() {
    let transformedData: Data[] = [];

    if (this._pattern.visualElement === null) { return transformedData; }

    const markType = this._pattern.visualElement.mark.type;

    if (markType === 'rect' || markType === 'path') {
      if (this._pattern.dataset === null) { return transformedData; }

      this.categoryData = this.getCategoryData();
      transformedData.push(this.categoryData);
    }
    if (markType === 'line') {
      if (this._pattern.dataset === null) { return transformedData; }

      this.parallelCoordinatesData = this.getLineData();
      transformedData.push(this.parallelCoordinatesData);
    }
    if (markType === 'path') {
      if (this._pattern.dataset === null) { return transformedData; }

      this.ribbonData = this.getRibbonData();
      transformedData = transformedData.concat(this.ribbonData);
    }

    return transformedData;
  }

  private getCategoryData(): Data {
    const categoryData: Data = {
      name: `${this._pattern.id}CategoryDataset`,
      source: this._pattern.dataset.name,
      transform: [
        {
          type: 'formula',
          expr: '1',
          as: 'value'
        },
        {
          type: 'fold',
          fields: this._pattern.dataset.fields,
          as: ['dimension', 'category']
        },
        {
          type: 'formula',
          expr: 'datum.dimension + datum.category',
          as: 'category'
        },
        {
          type: 'aggregate',
          fields: ['value'],
          ops: ['sum'],
          groupby: ['dimension', 'category'],
          as: ['value']
        },
        {
          type: 'collect', sort: {field: 'category', order: 'descending'}
        },
        {
          type: 'stack',
          field: 'value',
          groupby: ['dimension']
        }
      ]
    };

    return categoryData;
  }

  private getRibbonData(): Data[] {
    const pairWiseInterconnections: Data[] = [];

    // get mapping for categories that are adjacent to each other in the fields array, i.e.:
    // [A, B, C] --> [source: a, target: b], [source: b, target: c]
    this._pattern.dataset.fields.forEach((field, i) => {
      if (i === this._pattern.dataset.fields.length - 1) { return; }

      const sourceDimension = this._pattern.dataset.fields[i];
      const targetDimension = this._pattern.dataset.fields[i + 1];

      const interconnection: Data = {
        name: `ribbon${sourceDimension}${targetDimension}`,
        source: this._pattern.dataset.name,
        transform: [
          { type: 'formula', expr: `'${sourceDimension}' + datum['${sourceDimension}']`, as: 'sourceCategory' },
          { type: 'formula', expr: `'${targetDimension}' + datum['${targetDimension}']`, as: 'targetCategory' }
        ]
      };

      pairWiseInterconnections.push(interconnection);
    });

    // TODO: this is a hack, as the ribbon dataset relies on the ribbon scales to be created, while
    // the ribbon scales rely on the category data to be ready, so this will cause the scales to
    // be created twice
    if (this.invertedVerticalScale === null || this.verticalScale === null) {
      this.getTransformedScales();
    }

    // ribbons aggregate the number of appearances of pairwise interconnections, creates links
    // from the categories in categoryData and sorts them in their vertical order
    // BUG: has type any, because lookuptransform type wrongly exclusively expects strings in fields
    const ribbonTransforms: any[] = [
      {
        type: 'formula',
        expr: '1',
        as: 'value'
      },
      {
        type: 'aggregate',
        groupby: ['sourceCategory', 'targetCategory'],
        fields: ['value'],
        ops: ['sum'],
        as: ['value']
      },
      {
        type: 'lookup',
        from: this.categoryData.name,
        key: 'category',
        fields: [{expr: 'datum.sourceCategory'}, {expr: 'datum.targetCategory'}],
        as: ['source', 'target']
      },
      {
        type: 'formula',
        expr: `scale('${this.verticalScale.name}', datum.source.y1) + scale('${this.invertedVerticalScale.name}', datum.value) / 2`,
        as: 'sourceY'
      },
      {
        type: 'formula',
        expr: `scale('${this.verticalScale.name}', datum.target.y1) + scale('${this.invertedVerticalScale.name}', datum.value) / 2`,
        as: 'targetY'
      },
      {
        type: 'formula',
        expr: `scale('${this.invertedVerticalScale.name}', datum.value)`,
        as: 'height'
      },
      {
        type: 'collect',
        sort: {field: ['sourceCategory', 'targetCategory']}
      },
      {
        type: 'stack',
        field: 'height',
        groupby: ['sourceCategory'],
        as: ['sourceOffset', 'y1']
      },
      {
        type: 'stack',
        field: 'height',
        groupby: ['targetCategory'],
        as: ['targetOffset', 'y1']
      },
      {
        type: 'linkpath',
        sourceX: { expr: `scale('${this.horizontalScale.name}', datum.source.dimension)`},
        sourceY: { expr: 'datum.sourceY + datum.sourceOffset'},
        targetX: { expr: `scale('${this.horizontalScale.name}', datum.target.dimension)`},
        targetY: { expr: 'datum.targetY + datum.targetOffset'},
        orient: 'horizontal',
        shape: 'diagonal'
      }
    ];

    const ribbonData: Data = {
      name: `${this._pattern.id}RibbonDataset`,
      source: pairWiseInterconnections.map(i => i.name),
      transform: ribbonTransforms
    };

    return pairWiseInterconnections.concat(ribbonData);
  }

  private getLineData(): Data {
    // dataset containing names of the fields in the dataset, same as the names of the vertical
    // scales
    const fieldDataset: Data = {
      name: `${this._pattern.id}Fields`,
      values: this.pattern.dataset.fields
    };

    return fieldDataset;
  }

  private getTransformedScales(): Scale[] {
    const transformedScales: Scale[] = [];

    this.horizontalScale = {
      name: 'horizontal',
      type: 'point',
      range: 'width'
    };

    transformedScales.push(this.horizontalScale);

    if (this._pattern.dataset === null) { return transformedScales; }

    this.horizontalScale.domain = this._pattern.dataset.fields;

    if (this._pattern.visualElement === null) { return transformedScales; }

    const markType = this._pattern.visualElement.mark.type;

    if (markType === 'rect' || markType === 'path') {
      if (this.categoryData === null) { return transformedScales; }

      this.verticalScale = {
        name: `values`,
        type: 'linear',
        domain: {
          data: this.categoryData.name,
          field: 'y1'
        },
        range: 'height'
      };

      transformedScales.push(this.verticalScale);
    }

    if (markType === 'path') {
      if (this.categoryData === null) { return transformedScales; }

      this.invertedVerticalScale = {
        name: `invertedValues`,
        type: 'linear',
        range: [0, {signal: 'height'}],
        domain: {
          data: `${this.categoryData.name}`,
          field: 'y1'
        }
      };

      transformedScales.push(this.invertedVerticalScale);
    }

    if (markType === 'line') {
      if (this.pattern.dataset === null) { return transformedScales; }

      // one line for each individual field --> one linear scale per field
      // adapted from https://vega.github.io/vega/examples/parallel-coordinates/
      this.pattern.dataset.fields.forEach(field => {
        const newScale: LinearScale = {
          type: 'linear',
          name: field,
          zero: false,
          nice: true,
          domain: {
            data: this.pattern.dataset.name,
            field
          },
          range: 'height'
        };

        transformedScales.push(newScale);
      });
    }

    return transformedScales;
  }

  private getTransformedMarks(): Mark[] {
    const transformedMarks: Mark[] = [];

    if (this._pattern.visualElement === null) { return transformedMarks; }

    // rect mark --> parallel sets, line mark --> parallel coordinates
    if (this._pattern.visualElement.mark.type === 'rect') {
      // requires the category dataset to be transformed beforehand
      if (this.categoryData === null) { return transformedMarks; }
      if (this.verticalScale === null) { return transformedMarks; }
      if (this.horizontalScale === null) { return transformedMarks; }

      this.categoryMark = this.getCategoryMark();

      transformedMarks.push(this.categoryMark);

    } else if (this._pattern.visualElement.mark.type === 'line') {
      if (this.horizontalScale === null) { return transformedMarks; }

      this.parallelCoordinatesMark = this.getLineMark();

      transformedMarks.push(this.parallelCoordinatesMark);

    } else if (this._pattern.visualElement.mark.type === 'path') {
      if (this.categoryData === null) { return transformedMarks; }
      if (this.ribbonData === null) { return transformedMarks; }
      if (this.verticalScale === null) { return transformedMarks; }
      if (this.invertedVerticalScale === null) { return transformedMarks; }
      if (this.horizontalScale === null) { return transformedMarks; }

      this.ribbonMark = this.getRibbonMark();

      transformedMarks.push(this.ribbonMark);
    }

    return transformedMarks;
  }

  private getCategoryMark(): RectMark {
    // copy all existing configuration from the visual element to the fixed bars
    const categoryMark = JSON.parse(JSON.stringify(this._pattern.visualElement.mark));

    // set preset parameters
    categoryMark.name = `${this._pattern.id}Category`;
    categoryMark.from = { data: this.categoryData.name };

    // overwrite all positioning to reference the transformed scales and data
    if (categoryMark.encode === undefined) {
      const encode: Encode<RectEncodeEntry> = {
        update: {}
      };

      categoryMark.encode = encode;
    }

    categoryMark.encode.update.x = { scale: this.horizontalScale.name, field: 'dimension' };
    categoryMark.encode.update.y = { scale: this.verticalScale.name, field: 'y0' };
    categoryMark.encode.update.y2 = { scale: this.verticalScale.name, field: 'y1' };
    categoryMark.encode.update.width = { signal: '10' }

    return categoryMark;
  }

  private getRibbonMark(): PathMark {
    const ribbonMark = JSON.parse(JSON.stringify(this._pattern.visualElement.mark));

    ribbonMark.name = `${this._pattern.id}Ribbon`;
    ribbonMark.from = { data: `${this._pattern.id}RibbonDataset` };

    if (ribbonMark.encode === undefined) {
      const encode: Encode<PathEncodeEntry> = {
        update: {}
      };

      ribbonMark.encode = encode;
    }

    ribbonMark.encode.update.strokeWidth = {
      scale: this.invertedVerticalScale.name,
      field: 'value'
    };
    ribbonMark.encode.update.path = { field: 'path' };

    return ribbonMark;
  }

  private getLineMark(): GroupMark {
    // parallel hierarchies lines
    // adapted from https://vega.github.io/vega/examples/parallel-coordinates/

    if (this.parallelCoordinatesData === null) { return null; }

    const parallelCoordinatesMark: LineMark = JSON.parse(JSON.stringify(this._pattern.visualElement.mark));
    parallelCoordinatesMark.from = {
      data: this.parallelCoordinatesData.name
    };

    if (parallelCoordinatesMark.encode === undefined) {
      const encode: Encode<LineEncodeEntry> = {
        update: {}
      };
      parallelCoordinatesMark.encode = encode;
    } else if (parallelCoordinatesMark.encode.update === undefined) {
      parallelCoordinatesMark.encode.update = {};
    }

    parallelCoordinatesMark.encode.update.x = {
      scale: this.horizontalScale.name,
      field: 'data'
    };
    parallelCoordinatesMark.encode.update.y = {
      scale: { datum:  'data' },
      field: { parent: { datum: 'data' }}
    };

    const groupMark: GroupMark = {
      type: 'group',
      from: {
        data: this._pattern.dataset.name
      },
      marks: [ parallelCoordinatesMark ]
    };

    return groupMark;
  }

  public get blockedVisualVariables(): ArbitraryVisualVariableName [] {
    const blockedVisualVariables: ArbitraryVisualVariableName[] = [];
    const markType: string = this.pattern.visualElement.mark.type;

    if (markType === 'rect') {
      blockedVisualVariables.push('x');
      blockedVisualVariables.push('y');
      blockedVisualVariables.push('y2');
      blockedVisualVariables.push('width');
    } else if (markType === 'path') {
      blockedVisualVariables.push('strokeWidth');
      blockedVisualVariables.push('path');
    } else if (markType === 'line') {
      blockedVisualVariables.push('x');
      blockedVisualVariables.push('y');
    }

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
}