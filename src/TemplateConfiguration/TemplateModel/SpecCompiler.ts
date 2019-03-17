import { TopLevelSpec } from 'vega-lite';

import CompositeTemplate from './CompositeTemplate';
import Layout from './Layout';
import { LayoutType } from './LayoutType';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';

const compositionLayouts: LayoutType[] = ['repeat', 'overlay', 'concatenate', 'facet'];
const positioningLayouts: LayoutType[]= ['cartesian', 'histogram', 'node-link'];

export default class SpecCompiler {

  private getBasicSchema() {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'values': [
          {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
          {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
          {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
        ]
      }
    };
  }

  private applyVisualMarkTemplate(schema: any, template: VisualMarkTemplate) {
    schema = this.getBasicSchema();

    schema.mark = template.type;
    schema.encoding = {};

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

    delete schema.layer;

    return {
      layer: currentLayers
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

    if (schema.concat !== undefined) {
      concatProp = 'concat';
    } else if (schema.hconcat !== undefined)  {
      concatProp = 'hconcat';
    } else if (schema.vconcat !== undefined) {
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
      abstraction.encoding.y = {
          field: { repeat: 'row' },
          type: 'ordinal'
      };
    }

    return abstraction;
  }

  private getAbstraction(schema: any, compositionProperty: string): any {
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

    return abstraction;
  }

  private abstractCompositions(schema: any, compositionProperty: string): TopLevelSpec {
    const abstraction: any = this.getAbstraction(schema, compositionProperty);

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
      'column': ['a', 'c'],
      'row': ['a', 'c']
    }

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'hconcat');
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
        'y': {'field': 'b'},
        'text': {
          'field': 'b',
          'type': 'nominal'
        }
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

    if (positioningLayouts.indexOf(layout.type) > -1) {
      schema = this.applyPositionLayout(schema, layout);
    } else if (compositionLayouts.indexOf(layout.type) > -1) {
      schema = this.applyCompositionLayout(schema, layout);
    }

    return schema;
  }

  private getSingleLayerSpec(template: Template, layout: Layout): TopLevelSpec {
    let schema: any = null;

    if (template instanceof VisualMarkTemplate) {
      schema = this.applyVisualMarkTemplate(schema, template);
      schema = this.applyLayout(schema, layout);

    } else if (template instanceof CompositeTemplate) {

      schema = this.getVegaSpecification(template.visualElements, template.layout);

      if (schema !== null) {
        schema = this.applyLayout(schema, layout);
      }
    }

    return schema;
  }

  private getMultiLayerSpec(templates: Template[], layout: Layout): TopLevelSpec {
    const schema: any = this.getBasicSchema();

    const individualSchemas = templates.map(t => this.getVegaSpecification(t.visualElements, t.layout));
    const individualViewAbstractions = individualSchemas.map(s => {
      return this.getAbstraction(s, null);
    });

    if (layout.type === 'concatenate') {
      schema.vconcat = individualViewAbstractions;
    } else if (layout.type === 'overlay') {
      schema.layer = individualViewAbstractions;
    }

    return schema;
  }

  public getVegaSpecification(templates: Template[], layout: Layout): TopLevelSpec {

    let schema: any = null;

    if (templates.length === 0) {
      return schema;
    } else if (templates.length === 1) {
      schema = this.getSingleLayerSpec(templates[0], layout);
    } else if (templates.length > 1) {
      schema = this.getMultiLayerSpec(templates, layout);
    }

    console.log(schema)

    return schema;
  }
}