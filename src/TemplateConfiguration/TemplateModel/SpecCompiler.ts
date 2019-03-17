import { TopLevelSpec } from 'vega-lite';

import CompositeTemplate from './CompositeTemplate';
import Layout from './Layout';
import { LayoutType } from './LayoutType';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';

export default class SpecCompiler {

  private applyVisualMarkTemplate(schema: any, template: VisualMarkTemplate) {
    schema = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'values': [
          {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
          {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
          {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
        ]
      },
      'mark': template.type,
      'encoding': {}
    }

    return schema;
  }

  private isAtomicSchema(schema: any): boolean {
    return schema.mark !== undefined;
  }

  private isOverlaySchema(schema: any): boolean {
    return schema.layer !== undefined;
  }

  private isRepeatSchema(schema: any): boolean {
    return schema.repeat !== undefined;
  }

  private isConcatenateSchema(schema: any): boolean {
    return schema.concat !== undefined || schema.hconcat !== undefined || schema.vconcat !== undefined;
  }

  private abstractOverlay(schema: any) {
    const currentLayers = JSON.parse(JSON.stringify(schema.layer));

    delete schema.layers;

    return {
      layers: currentLayers
    }
  }

  private abstractRepeat(schema: any) {
    const currentSpec = JSON.parse(JSON.stringify(schema.spec));
    const currentRepeat = JSON.parse(JSON.stringify(schema.repeat));

    delete schema.spec;
    delete schema.repeat;

    return {
      spec: currentSpec,
      repeat: currentRepeat
    };
  }

  private abstractConcat(schema: any) {
    let currentConcat: any = null;
    let concatProp: string = null;

    if (schema.concat !== null) {
      concatProp = 'concat';
    } else if (schema.hconcat !== null)  {
      concatProp = 'hconcat';
    } else if (schema.vconcat !== null) {
      concatProp = 'vconcat';
    }

    currentConcat = JSON.parse(JSON.stringify(schema[concatProp]));
    delete schema[concatProp];

    return {
      concatProp: currentConcat
    };
  }

  private abstractAtomic(schema: any, compositionProperty: string) {
    const abstraction = {
      mark: JSON.parse(JSON.stringify(schema.mark)),
      encoding: JSON.parse(JSON.stringify(schema.encoding))
    };

    delete schema.mark;
    delete schema.encoding;

    if (compositionProperty === 'spec') {
      abstraction.encoding.x = {
          field: { repeat: 'column' },
          type: 'ordinal'
      };
    }

    return abstraction;
  }

  private abstractCompositions(schema: any, compositionProperty: string): TopLevelSpec {
    let abstraction: any = null;

    if (this.isAtomicSchema(schema)) {
      abstraction = this.abstractAtomic(schema, compositionProperty);
    } else if (this.isOverlaySchema(schema)) {
      abstraction = this.abstractOverlay(schema)
    } else if (this.isRepeatSchema(schema)) {
      abstraction = this.abstractRepeat(schema);
    } else if (this.isConcatenateSchema(schema)) {
      abstraction = this.abstractConcat(schema);
    }


    if (compositionProperty === 'spec') {
      schema[compositionProperty] = abstraction;
    } else {
      schema[compositionProperty] =  [ abstraction ];
    }

    return schema;
  }

  private applyRepeatLayout(schema: any): TopLevelSpec {
    schema = this.abstractCompositions(schema, 'spec');

    schema.repeat = {
      'column': ['a', 'c']
    }

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'concat');
  }

  private applyOverlayLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'layer');
  }

  private applyCompositionLayout(schema: any, layout: Layout): TopLevelSpec {
    if (layout.type === 'repeat') {
      this.applyRepeatLayout(schema);
    } else if (layout.type === 'concatenate') {
      this.applyConcatLayout(schema);
    } else if (layout.type === 'overlay') {
      this.applyOverlayLayout(schema);
    }

    return schema;
  }

  private applyPositionLayout(schema: any, layout: Layout): TopLevelSpec {
    schema.encoding = {};

    // apply basic positioning for x and y coordinates, without a layouting type
    if (['cartesian', 'histogram'].indexOf(layout.type) > -1) {
      schema.encoding = {
        'x': {'field': 'a'},
        'y': {'field': 'b'}
      };
    }

    // set the encodings for the marks, based on the layout type
    if (layout.type === 'cartesian') {
      schema.encoding.x.type = 'quantitative';
      schema.encoding.y.type = 'quantitative';
    } else if (layout.type === 'histogram') {
      schema.encoding.x.type = 'ordinal';
      schema.encoding.y.type = 'quantitative';
    }

    return schema;
  }

  private applyLayout(schema: any, layout: Layout) {
    if (schema === null) {
      return schema;
    }
    if (layout === null) {
      return schema;
    }

    const compositionLayouts: LayoutType[] = ['repeat', 'overlay', 'concatenate', 'facet'];
    const positioningLayouts: LayoutType[]= ['cartesian', 'histogram', 'node-link'];

    if (positioningLayouts.indexOf(layout.type) > -1) {
      schema = this.applyPositionLayout(schema, layout);
    } else if (compositionLayouts.indexOf(layout.type) > -1) {
      schema = this.applyCompositionLayout(schema, layout);
    }

    return schema;
  }

  public getVegaSpecification(templates: Template[], layout: Layout): TopLevelSpec {

    let schema: any = null;

    if (templates.length === 0) {
      return schema;
    }

    const template = templates[0];

    if (template instanceof VisualMarkTemplate) {
      schema = this.applyVisualMarkTemplate(schema, template);
      schema = this.applyLayout(schema, layout);

    } else if (template instanceof CompositeTemplate) {

      schema = this.getVegaSpecification(template.visualElements, template.layout);

      if (schema !== null) {
        schema = this.applyLayout(schema, layout);
      }
    }

    console.log(schema)

    return schema;
  }
}