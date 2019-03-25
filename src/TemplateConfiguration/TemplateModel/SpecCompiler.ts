import { TopLevelSpec } from 'vega-lite';

import Layout from './Layout';
import { getAbstraction } from './SpecUtils';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';
import PlotTemplate from './PlotTemplate';
import CompositionTemplate from './CompositionTemplate';
import { Data } from 'vega-lite/build/src/data';
import RepeatTemplate from './RepeatTemplate';
import ConcatTemplate from './ConcatTemplate';
import LayerTemplate from './LayerTemplate';

export default class SpecCompiler {
  public getBasicSchema(data: Data) {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'data': data
    };
  }

  private setSingleViewProperties(schema: any, template: Template) {
    if (template.bounds !== undefined) {
      schema.bounds = template.bounds;
    }
    if (template.spacing !== undefined) {
      schema.spacing = template.spacing;
    }
    if (template.height !== undefined) {
      schema.height = template.height;
    }
    if (template.width !== undefined) {
      schema.width = template.width;
    }

    return schema;
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

  private getMultiLayerSpec(template: Template): TopLevelSpec {
    const templates = template.visualElements;
    const schema: any = this.getBasicSchema(this.getDataInHierarchy(template));

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t))
      .filter(t => t !== null);

    const individualViewAbstractions = individualSchemas.map(s => {
      return getAbstraction(s, null);
    });

    if (template instanceof ConcatTemplate) {
      if (template.isVertical) {
        schema.vconcat = individualViewAbstractions;
      } else {
        schema.hconcat = individualViewAbstractions;
      }
    } else if (template instanceof LayerTemplate) {
      schema.layer = individualViewAbstractions;
    }

    return schema;
  }

  private getVisualMarkSchema(template: Template) {
    let schema: any = null;

    schema = this.getPlotSchema(template as PlotTemplate);

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
      return this.getMultiLayerSpec(template);
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

    schema = this.setSingleViewProperties(schema, template);
    console.log(schema);

    return schema;
  }
}