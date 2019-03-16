import { TopLevelSpec } from 'vega-lite';

import CompositeTemplate from './CompositeTemplate';
import Layout from './Layout';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';

export default class SpecCompiler {

  private applyVisualMarkTemplate(spec: any, template: VisualMarkTemplate) {
    spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'values': [
          {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
          {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
          {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
        ]
      },
      'mark': template.type
    }

    return spec;
  }

  private isAtomicSpec(spec: any): boolean {
    return spec.mark !== undefined;
  }

  private isOverlaySpec(spec: any): boolean {
    return spec.layer !== undefined;
  }

  private isRepeatSpec(spec: any): boolean {
    return spec.repeat !== undefined;
  }

  private isConcatenateSpec(spec: any): boolean {
    return spec.concat !== undefined || spec.hconcat !== undefined || spec.vconcat !== undefined;
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

  private abstractCompositions(schema: any, compositionProperty: string, composeInsideArray: boolean = true): TopLevelSpec {
    let abstraction: any = null;

    if (this.isOverlaySpec(schema)) {
      abstraction = this.abstractOverlay(schema)
    } else if (this.isRepeatSpec(schema)) {
      abstraction = this.abstractRepeat(schema);
    } else if (this.isConcatenateSpec(schema)) {
      abstraction = this.abstractConcat(schema);
    }

    if (composeInsideArray) {
      schema[compositionProperty] =  [ abstraction ];
    } else {
      schema[compositionProperty] = abstraction;
    }

    return schema;
  }

  private applyRepeatLayout(schema: any): TopLevelSpec {
    if (this.isAtomicSpec(schema)) {
      schema.spec = {
        mark: JSON.parse(JSON.stringify(schema.mark)),
        encoding: JSON.parse(JSON.stringify(schema.encoding))
      }

      delete schema.mark;
      delete schema.encoding;

      schema.spec.encoding.x = {
          field: { repeat: 'column' },
          type: 'ordinal'
      };
    } else {
      schema = this.abstractCompositions(schema, 'spec', false);
    }

    schema.repeat = {
      'column': ['a', 'c']
    }

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    // if (this.isAtomicSpec(schema)) {
    //   schema.concat = [
    //     {
    //       mark: JSON.parse(JSON.stringify(schema.mark)),
    //       encoding: JSON.parse(JSON.stringify(schema.encoding))
    //     }
    //   ];

    //   delete schema.mark;
    //   delete schema.encoding;
    // } else {
    //   schema = this.applyCompositionLayout(schema, 'concat');
    // }

    return schema;
  }

  private applyOverlayLayout(schema: any): TopLevelSpec {
    if (this.isAtomicSpec(schema)) {
      schema.layer = [
        {
          mark: JSON.parse(JSON.stringify(schema.mark)),
          encoding: JSON.parse(JSON.stringify(schema.encoding))
        }
      ];

      delete schema.mark;
      delete schema.encoding;
    } else {
      schema = this.abstractCompositions(schema, 'layer');
    }

    return schema;
  }

  private applyCompositeLayout(spec: any, layout: Layout): TopLevelSpec {
    // TODO: requires transpilation to vega first
    if (['cartesian', 'histogram'].indexOf(layout.type) > -1) {
      return spec;
    }

    if (layout.type === 'repeat') {
      this.applyRepeatLayout(spec);
    } else if (layout.type === 'concatenate') {
      this.applyConcatLayout(spec);
    } else if (layout.type === 'overlay') {
      this.applyOverlayLayout(spec);
    }

    return spec;
  }

  private applyVisualMarkLayout(spec: any, layout: Layout): TopLevelSpec {
    if (spec === null) {
      return spec;
    }
    if (layout === null) {
      return spec;
    }

    spec.encoding = {};

    // apply basic positioning for x and y coordinates, without a layouting type
    if (['cartesian', 'histogram'].indexOf(layout.type) > -1) {
      spec.encoding = {
        'x': {'field': 'a'},
        'y': {'field': 'b'}
      };
    }

    // set the encodings for the marks, based on the layout type
    if (layout.type === 'cartesian') {
      spec.encoding.x.type = 'quantitative';
      spec.encoding.y.type = 'quantitative';
    } else if (layout.type === 'histogram') {
      spec.encoding.x.type = 'ordinal';
      spec.encoding.y.type = 'quantitative';
    } else if (layout.type === 'repeat') {

    }

    return spec;
  }

  public getVegaSpecification(templates: Template[], layout: Layout): TopLevelSpec {

    let spec: any = null;

    if (templates.length === 0) {
      return spec;
    }

    const template = templates[0];

    if (template instanceof VisualMarkTemplate) {
      spec = this.applyVisualMarkTemplate(spec, template);
      spec = this.applyVisualMarkLayout(spec, layout);

    } else if (template instanceof CompositeTemplate) {

      spec = this.getVegaSpecification(template.visualElements, template.layout);

      if (spec !== null) {
        spec = this.applyCompositeLayout(spec, layout);
      }
    }

    console.log(spec)

    return spec;
  }
}