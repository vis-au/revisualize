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

const dummyData = {
  'values': [
    {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
    {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
    {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
  ]
};

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

  private getSingleLayerSpec(parentTemplate: Template): TopLevelSpec {
    const template = parentTemplate.visualElements[0];
    const layout = parentTemplate.layout;
    let schema: any = null;

    if (template instanceof CompositionTemplate || template instanceof PlotTemplate) {
      schema = this.getVegaSpecification(template);

      if (schema !== null) {
        schema = this.applyCompositionLayout(template, schema, layout);
      }
    }

    return schema;
  }

  private getDataInHierarchy(template: Template) {
    if (template instanceof VisualMarkTemplate) {
      return dummyData;
    }

    // data can be stored either in a child node or on the top level template, therefore find the
    // top level, get its flat hierarchy and find a template with a dataset bound to it
    let topLevelTemplate: Template = template;

    while (topLevelTemplate.parent !== null) {
      if (topLevelTemplate.dataRef !== undefined && topLevelTemplate.dataRef !== null) {
        return topLevelTemplate.dataRef;
      }

      topLevelTemplate = topLevelTemplate.parent;
    }

    const flatHierarchy = topLevelTemplate.getFlatHierarchy();
    const dataTemplate: Template = flatHierarchy.find(t => {
      return t.dataRef !== null && t.dataRef !== undefined;
    });

    return dataTemplate.dataRef;
  }

  private getMultiLayerSpec(template: Template): TopLevelSpec {
    const templates = template.visualElements;
    const schema: any = this.getBasicSchema(template.dataRef);

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t))
      .filter(t => t !== null);

    const individualViewAbstractions = individualSchemas.map(s => {
      return getAbstraction(s);
    });

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

  private getVisualMarkSchema(template: Template) {
    let schema: any = null;

    schema = this.getPlotSchema(template as PlotTemplate);

    return schema;
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
    let schema: any = null;

    if (template.visualElements.length === 1) {
      schema = this.getSingleLayerSpec(template);
    } else if (template.visualElements.length > 1) {
      schema = this.getMultiLayerSpec(template);
    }

    schema.data = this.getDataInHierarchy(template);
    return schema;
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