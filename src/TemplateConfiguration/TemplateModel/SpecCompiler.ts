import { TopLevelSpec } from 'vega-lite';

import { getAbstraction } from './SpecUtils';
import Template from './Template';
import PlotTemplate from './PlotTemplate';
import CompositionTemplate from './CompositionTemplate';
import RepeatTemplate from './RepeatTemplate';
import ConcatTemplate from './ConcatTemplate';
import LayerTemplate from './LayerTemplate';
import { Composition } from './LayoutType';
import { Data } from 'vega-lite/build/src/data';


export default class SpecCompiler {
  public getBasicSchema(): any {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json'
    };
  }

  private setSingleViewProperties(schema: any, template: Template, includeData: boolean = true) {
    if (includeData && template.data !== undefined) {
      schema.data = template.data;
    }
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
    if (template.transform !== undefined) {
      schema.transform = template.transform;
    }
    if (template.config !== undefined) {
      schema.config = template.config;
    }

    return schema;
  }

  private getRootTemplate(template: Template) {
    let workingNode = template;

    while (workingNode.parent !== null) {
      workingNode = workingNode.parent;
    }

    return workingNode;
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

  private applyCompositionLayout(template: Template, schema: any, composition: Composition): TopLevelSpec {
    if (composition === 'repeat') {
      this.applyRepeatLayout(template, schema);
    } else if (composition === 'concatenate') {
      this.applyConcatLayout(schema);
    } else if (composition === 'overlay') {
      this.applyOverlayLayout(schema);
    } else if (composition === 'facet') {
      // TODO
    }

    return schema;
  }

  private getSingleLayerSpec(parentTemplate: Template): TopLevelSpec {
    const template = parentTemplate.visualElements[0];
    const layout = parentTemplate.layout;
    let schema: any = null;

    schema = this.getVegaSpecification(template, false);

    if (schema !== null) {
      schema = this.applyCompositionLayout(template, schema, layout as Composition);
    }

    return schema;
  }

  private getDataInHierarchy(template: Template) {
    // data can be stored either in a child node or on the top level template, therefore find the
    // top level, get its flat hierarchy and find a template with a dataset bound to it
    let topLevelTemplate: Template = template;

    while (topLevelTemplate.parent !== null) {
      if (topLevelTemplate.data !== undefined && topLevelTemplate.data !== null) {
        return topLevelTemplate.data;
      }

      topLevelTemplate = topLevelTemplate.parent;
    }

    const flatHierarchy = topLevelTemplate.getFlatHierarchy();
    const dataTemplate: Template = flatHierarchy.find(t => {
      return t.data !== null && t.data !== undefined;
    });

    return dataTemplate.data;
  }

  private getMultiLayerSpec(template: Template, useOverwrittenEncodings: boolean): TopLevelSpec {
    const templates = template.visualElements;
    const schema: any = this.getBasicSchema();
    const overwriteChildEncodings = !(template instanceof RepeatTemplate) && useOverwrittenEncodings;

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t, false, overwriteChildEncodings));

    const individualViewAbstractions = individualSchemas
      .map(s => getAbstraction(s));

    if (template instanceof ConcatTemplate) {
      if (template.isVertical) {
        schema.vconcat = individualViewAbstractions;
      } else {
        schema.hconcat = individualViewAbstractions;
      }
    } else if (template instanceof LayerTemplate) {

      if (template.groupEncodings.size > 0) {
        schema.encoding = {};
        template.groupEncodings.forEach((value, key) => schema.encoding[key] = value);
        individualViewAbstractions.forEach(abstraction => {
          delete abstraction.data;
        });
      }

      schema.layer = individualViewAbstractions;
    }

    return schema;
  }

  private getPlotSchema(template: PlotTemplate, inferData: boolean, useOverwrittenEncodings: boolean) {
    const schema = this.getBasicSchema();
    let data: Data = null;

    if (inferData) {
      data = this.getDataInHierarchy(template);
    } else {
      data = template.data;
    }

    if (data !== undefined && data !== null) {
      schema.data = data;
    }

    schema.mark = template.type;

    if (template.selection !== undefined) {
      schema.selection = template.selection;
    }

    schema.encoding = {};

    template.encodings.forEach((value, key) => {
      schema.encoding[key] = value;

      const overwrittenValue = template.overwrittenEncodings.get(key);

      if (useOverwrittenEncodings && overwrittenValue !== undefined) {
        schema.encoding[key] = overwrittenValue;
      }
    });

    return schema;
  }

  private getCompositionSchema(template: Template, inferData: boolean, useOverwrittenEncodings: boolean) {
    let schema: any = null;

    if (template.visualElements.length === 1) {
      schema = this.getSingleLayerSpec(template);
    } else if (template.visualElements.length > 1) {
      schema = this.getMultiLayerSpec(template, useOverwrittenEncodings);
    }

    if (inferData) {
      schema.data = this.getDataInHierarchy(template);
    } else {
      schema.data = template.data;
    }

    return schema;
  }

  public getVegaSpecification(template: Template, inferProperties: boolean = false, useOverwrittenEncodings: boolean = false) {
    let schema: any = null;

    if (template instanceof PlotTemplate) {
      schema = this.getPlotSchema(template, inferProperties, useOverwrittenEncodings);
    } else if (template instanceof CompositionTemplate) {
      schema = this.getCompositionSchema(template, inferProperties, useOverwrittenEncodings);
    }

    schema = this.setSingleViewProperties(schema, template);

    if (inferProperties) {
      let rootTemplate = this.getRootTemplate(template);
      schema = this.setSingleViewProperties(schema, rootTemplate, false);
    }

    console.log(schema);

    return schema;
  }
}