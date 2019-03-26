import { isVConcatSpec, isHConcatSpec } from "vega-lite/build/src/spec";

import { isCompositionSchema, isRepeatSchema, isPlotSchema, isOverlaySchema, isFacetSchema, isConcatenateSchema, getMarkPropertiesAsMap } from "./SpecUtils";
import PlotTemplate from "./PlotTemplate";
import Template from "./Template";
import { MarkEncoding } from "./MarkEncoding";
import RepeatTemplate from "./RepeatTemplate";
import LayerTemplate from "./LayerTemplate";
import FacetTemplate from "./FacetTemplate";
import ConcatTemplate from "./ConcatTemplate";
import { isRepeatRef, isFieldDef } from "vega-lite/build/src/fielddef";

export default class SchemaDecompiler {

  private getEncodingsMapFromPlotSchema(schema: any) {
    const templateEncodings = new Map<MarkEncoding, any>();

    // a mark can also be configured using the "global" encoding of layered views, in this case the
    // mark's encoding can be empty
    if (schema.encoding === undefined) {
      return templateEncodings;
    }

    const schemaEncodings = Object.keys(schema.encoding) as MarkEncoding[];

    schemaEncodings.forEach((encoding: MarkEncoding) => {
      templateEncodings.set(encoding, schema.encoding[encoding]);
    });

    return templateEncodings;
  }

  private setSingleViewProperties(schema: any, template: Template) {
    template.description = schema.description;
    template.data = schema.data;
    template.bounds = schema.bounds;
    template.spacing = schema.spacing;
    template.width = schema.width;
    template.height = schema.height;
    template.transform = schema.transform;
    template.config = schema.config;
  }

  private getNonRepeatSubtrees(template: Template) {
    const nonRepeatSubtrees: Template[] = [];

    template.visualElements.forEach(t => {
      if (!(t instanceof RepeatTemplate)) {
        nonRepeatSubtrees.push(t);
        nonRepeatSubtrees.push(...this.getNonRepeatSubtrees(t));
      }
    });

    return nonRepeatSubtrees;
  }

  /**
   * In a repeat spec, the bindings inside the child templates can reference the repeated fields
   * instead of fields from the data. In order to render such a template without its parent,
   * modify this binding to the first entries in the repeated fields of the parent
   **/
  private removeRepeatFromChildTemplates(template: RepeatTemplate) {
    const nonRepeatSubTemplates = this.getNonRepeatSubtrees(template);

    nonRepeatSubTemplates.forEach(childTemplate => {
      const overwriteEncodings = new Map<MarkEncoding, any>();
      const repeatedFields = template.repeat.column.concat(template.repeat.row);

      childTemplate.encodings.forEach((value: any, key: MarkEncoding) => {
        if (isFieldDef<any>(value)) {
          if (isRepeatRef(value.field)) {
            const index = Math.floor(Math.random() * repeatedFields.length);
            const fieldRef = {
              field: repeatedFields[index],
              type: (value as any).type
            };
            overwriteEncodings.set(key, fieldRef)
          }
        }
      });

      childTemplate.overwrittenEncodings = overwriteEncodings;
    });
  }

  private getRepeatTemplate(schema: any) {
    const template = new RepeatTemplate([]);
    template.repeat = schema.repeat;
    let childTemplate = this.decompile(schema.spec);
    template.visualElements = [childTemplate];
    this.removeRepeatFromChildTemplates(template);

    return template;
  }

  private getLayerTemplate(schema: any) {
    const template = new LayerTemplate([]);

    if (schema.encoding !== undefined) {
      const groupEncodings = Object.keys(schema.encoding);
      groupEncodings.forEach((encoding: MarkEncoding) => {
        (template as LayerTemplate).groupEncodings.set(encoding, schema.encoding[encoding]);
      });
    }

    schema.layer.forEach((layer: any) => {
      template.visualElements.push(this.decompile(layer));
    });

    return template;
  }

  private getFacetTemplate(schema: any) {
    const template = new FacetTemplate([]);
    const plot = this.getPlotTemplate(schema);

    template.visualElements = [plot];

    return template;
  }

  private getConcatTemplate(schema: any) {
    const template = new ConcatTemplate([]);

    if (isVConcatSpec(schema)) {
      template.isVertical = true;
      schema.vconcat.forEach((layer: any) => {
        template.visualElements.push(this.decompile(layer));
      });
    } else if (isHConcatSpec(schema)) {
      template.isVertical = false;
      schema.hconcat.forEach((layer: any) => {
        template.visualElements.push(this.decompile(layer));
      });
    }

    return template;
  }

  private getCompositionTemplate(schema: any) {
    let template: Template = null;

    if (isRepeatSchema(schema)) {
      template = this.getRepeatTemplate(schema);
    } else if (isOverlaySchema(schema)) {
      template = this.getLayerTemplate(schema);
    } else if (isFacetSchema(schema)) {
      template = this.getFacetTemplate(schema);
    } else if (isConcatenateSchema(schema)) {
      template = this.getConcatTemplate(schema);
    }

    template.visualElements.forEach(t => t.parent = template);

    return template;
  }

  private getPlotTemplate(schema: any) {
    const plotTemplate = new PlotTemplate(null);
    const markType = typeof schema.mark === 'string' ? schema.mark : schema.mark.type;
    plotTemplate.type = markType;

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    const properties = getMarkPropertiesAsMap(schema.mark);

    plotTemplate.encodings = encodings;
    plotTemplate.staticMarkProperties = properties;

    return plotTemplate;
  }

  public decompile(schema: any) {
    let template: Template = null;

    if (isCompositionSchema(schema)) {
      template = this.getCompositionTemplate(schema);
    } else if (isPlotSchema(schema)) {
      template = this.getPlotTemplate(schema);
    }

    this.setSingleViewProperties(schema, template);

    if (template instanceof PlotTemplate) {
      template.selection = schema.selection;
    }

    return template;
  }
}