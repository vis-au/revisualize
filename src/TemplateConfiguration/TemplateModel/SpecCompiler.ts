import { TopLevelSpec } from 'vega-lite';

import Layout from './Layout';
import { LayoutType } from './LayoutType';
import { isAtomicSchema, isConcatenateSchema, isOverlaySchema, isRepeatSchema } from './SpecUtils';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';
import PlotTemplate from './PlotTemplate';
import CompositionTemplate from './CompositionTemplate';

const compositionLayouts: LayoutType[] = ['repeat', 'overlay', 'concatenate', 'facet'];
const positioningLayouts: LayoutType[]= ['cartesian', 'histogram', 'node-link'];

export default class SpecCompiler2 {

  public getBasicSchema() {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'data': {
        'values': [
          {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
          {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
          {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
        ]
      }
    };
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
      if (abstraction.encoding.x !== undefined) {
        abstraction.encoding.x = {
            field: { repeat: 'column' },
            type: 'ordinal'
        };
      }
      if (abstraction.encoding.y !== undefined) {
        abstraction.encoding.y = {
            field: { repeat: 'row' },
            type: 'ordinal'
        };
      }
    }

    return abstraction;
  }

  private getAbstraction(schema: any, compositionProperty: string): any {
    let abstraction: any = null;

    if (isAtomicSchema(schema)) {
      abstraction = this.abstractAtomic(schema, compositionProperty);
    } else if (isOverlaySchema(schema)) {
      abstraction = this.abstractOverlay(schema)
    } else if (isRepeatSchema(schema)) {
      abstraction = this.abstractRepeat(schema);
    } else if (isConcatenateSchema(schema)) {
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
    if (schema.encoding == undefined) {
      schema.encoding = {};
    }

    // apply basic positioning for x and y coordinates, without a layouting type
    if (['cartesian', 'histogram'].indexOf(layout.type) > -1) {
      schema.encoding.x = {'field': 'a'};
      schema.encoding.y = {'field': 'b'};
      schema.encoding.text = {'field': 'b', 'type': 'nominal'};
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

    if (template instanceof CompositionTemplate || template instanceof PlotTemplate) {
      schema = this.getVegaSpecification(template);

      if (schema !== null) {
        schema = this.applyLayout(schema, layout);
      }
    }

    return schema;
  }

  private getMultiLayerSpec(templates: Template[], layout: Layout): TopLevelSpec {
    const schema: any = this.getBasicSchema();

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t))
      .filter(t => t !== null);

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

  private getVisualMarkSchema(template: Template) {
    let schema: any = null;

    schema = this.getPlotSchema(template);

    return schema;
  }

  private getPlotSchema(template: PlotTemplate) {
    const schema = this.getBasicSchema() as any;

    if (template.visualElements.length === 0) {
      schema.mark = (template as VisualMarkTemplate).type;
    } else {
      schema.mark = (template.visualElements[0] as VisualMarkTemplate).type;
    }

    schema.encoding = {};

    template.encodings.forEach((value, key) => {
      schema.encoding[key] = value;
    });

    return schema;
  }

  private getCompositionSchema(template: Template) {
    if (template.visualElements.length === 1) {
      return this.getSingleLayerSpec(template.visualElements[0], template.layout);
    } else if (template.visualElements.length > 1) {
      return this.getMultiLayerSpec(template.visualElements, template.layout);
    }
  }

  public getVegaSpecification(template: Template) {
    let schema: any = null;

    if (template instanceof VisualMarkTemplate) {
      schema = this.getVisualMarkSchema(template);
    } else if (template instanceof PlotTemplate) {
      schema = this.getPlotSchema(template);
    } else if (template instanceof CompositionTemplate) {
      schema = this.getCompositionSchema(template);
    }

    return schema;
  }
}