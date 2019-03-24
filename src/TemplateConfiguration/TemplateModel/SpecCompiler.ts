import { TopLevelSpec } from 'vega-lite';

import Layout from './Layout';
import { LayoutType } from './LayoutType';
import { getAbstraction } from './SpecUtils';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';
import PlotTemplate from './PlotTemplate';
import CompositionTemplate from './CompositionTemplate';
import { Data } from 'vega-lite/build/src/data';
import RepeatTemplate from './RepeatTemplate';

const compositionLayouts: LayoutType[] = ['repeat', 'overlay', 'concatenate', 'facet'];
const positioningLayouts: LayoutType[]= ['cartesian', 'histogram', 'node-link'];

export default class SpecCompiler2 {

  public getBasicSchema(data: Data) {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'data': data
    };
  }

  private abstractCompositions(schema: any, compositionProperty: string): TopLevelSpec {
    const abstraction: any = getAbstraction(schema, compositionProperty);

    if (compositionProperty === 'spec') {
      schema[compositionProperty] = abstraction;
    } else {
      schema[compositionProperty] =  [ abstraction ];
    }

    return schema;
  }

  private applyRepeatLayout(template: Template, schema: any): TopLevelSpec {
    schema = this.abstractCompositions(schema, 'spec');

    // parent must be repeat template to reach this branch
    schema.repeat = (template.parent as RepeatTemplate).repeat;

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'hconcat');
  }

  private applyOverlayLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'layer');
  }

  private applyCompositionLayout(template: Template, schema: any, layout: Layout): TopLevelSpec {
    if (layout.type === 'repeat') {
      this.applyRepeatLayout(template, schema);
    } else if (layout.type === 'concatenate') {
      this.applyConcatLayout(schema);
    } else if (layout.type === 'overlay') {
      this.applyOverlayLayout(schema);
    }

    return schema;
  }

  private getSingleLayerSpec(template: Template, layout: Layout): TopLevelSpec {
    let schema: any = null;

    if (template instanceof CompositionTemplate || template instanceof PlotTemplate) {
      schema = this.getVegaSpecification(template);

      if (schema !== null) {
        schema = this.applyCompositionLayout(template, schema, layout);
      }
    }

    return schema;
  }

  private getMultiLayerSpec(templates: Template[], layout: Layout): TopLevelSpec {
    const schema: any = this.getBasicSchema(null);

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t))
      .filter(t => t !== null);

    const individualViewAbstractions = individualSchemas.map(s => {
      return getAbstraction(s, null);
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

  private getDataInHierarchy(template: Template) {
    // data can be stored either in a child node or on the top level template, therefore find the
    // top level, get its flat hierarchy and find a template with a dataset bound to it
    let topLevelTemplate: Template = template;

    while (topLevelTemplate.parent !== null) {
      topLevelTemplate = topLevelTemplate.parent;
    }

    const flatHierarchy = topLevelTemplate.getFlatHierarchy();
    const dataTemplate: Template = flatHierarchy.find(t => {
      return t.dataRef !== null && t.dataRef !== undefined;
    });

    return dataTemplate.dataRef;
  }

  private getPlotSchema(template: PlotTemplate) {
    const data = this.getDataInHierarchy(template);
    const schema = this.getBasicSchema(data) as any;

    if (template.visualElements.length === 0) {
      schema.mark = (template as VisualMarkTemplate).type;
    } else {
      schema.mark = (template.visualElements[0] as VisualMarkTemplate).type;
    }

    if (template.selection !== undefined) {
      schema.selection = template.selection;
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

    console.log(schema);

    return schema;
  }
}