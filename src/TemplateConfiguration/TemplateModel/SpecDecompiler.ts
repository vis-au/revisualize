import { isVConcatSpec, isHConcatSpec } from "vega-lite/build/src/spec";

import { isCompositionSchema, isRepeatSchema, isPlotSchema, isOverlaySchema, isFacetSchema, isConcatenateSchema } from "./SpecUtils";
import PlotTemplate from "./PlotTemplate";
import Template from "./Template";
import VisualMarkTemplate from "./VisualMark";
import { MarkEncoding } from "./MarkEncoding";
import RepeatTemplate from "./RepeatTemplate";
import LayerTemplate from "./LayerTemplate";
import FacetTemplate from "./FacetTemplate";
import ConcatTemplate from "./ConcatTemplate";
import { isRepeatRef, Field, isFieldDef } from "vega-lite/build/src/fielddef";
import { string } from "prop-types";

export default class SchemaDecompiler {

  private getEncodingsMapFromPlotSchema(schema: any) {
    const templateEncodings = new Map<MarkEncoding, any>();
    const schemaEncodings = Object.keys(schema.encoding) as MarkEncoding[];

    schemaEncodings.forEach((encoding: MarkEncoding) => {
      templateEncodings.set(encoding, schema.encoding[encoding]);
    });

    return templateEncodings;
  }

  private setSingleViewProperties(schema: any, template: Template) {
    template.description = schema.description;
    template.dataRef = schema.data;
    template.bounds = schema.bounds;
    template.spacing = schema.spacing;
    template.width = schema.width;
    template.height = schema.height;
  }

  private applyRepeatBindingWorkaround(repeatTemplate: RepeatTemplate, childTemplate: Template) {
    // in a repeat spec, the bindings inside the child templates can reference the repeated fields
    // instead of fields from the data. In order to render such a template without its parent,
    // modify this binding to the first entries in the repeated fields of the parent
    const overwriteEncodings = new Map<MarkEncoding, any>();
    const repeatedFields = repeatTemplate.repeat.column.concat(repeatTemplate.repeat.row);

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

    overwriteEncodings.forEach((value, key) => {
      childTemplate.setEncodedValue(key, value);
    });

    return childTemplate;
  }

  private getCompositionTemplate(schema: any) {
    let template: Template = null;
    let visualElements: Template[] = [];

    if (isRepeatSchema(schema)) {
      template = new RepeatTemplate(visualElements);
      (template as RepeatTemplate).repeat = schema.repeat;
      let childTemplate = this.decompile(schema.spec);
      childTemplate = this.applyRepeatBindingWorkaround(template as RepeatTemplate, childTemplate);
      template.visualElements = [childTemplate];
    } else if (isOverlaySchema(schema)) {
      template = new LayerTemplate(visualElements);

      schema.layer.forEach((layer: any) => {
        template.visualElements.push(this.decompile(layer));
      });
    } else if (isFacetSchema(schema)) {
      template = new FacetTemplate(visualElements);

      template.visualElements = [this.getPlotTemplate(schema)];
    } else if (isConcatenateSchema(schema)) {
      template = new ConcatTemplate(visualElements);

      if (isVConcatSpec(schema)) {
        (template as ConcatTemplate).isVertical = true;
        schema.vconcat.forEach((layer: any) => {
          template.visualElements.push(this.decompile(layer));
        });
      } else if (isHConcatSpec(schema)) {
        (template as ConcatTemplate).isVertical = false;
        schema.hconcat.forEach((layer: any) => {
          template.visualElements.push(this.decompile(layer));
        });
      }
    }

    template.visualElements.forEach(t => t.parent = template);

    return template;
  }

  private getPlotTemplate(schema: any) {
    const plotTemplate = new PlotTemplate('histogram', null);
    const visualElement = new VisualMarkTemplate(schema.mark, plotTemplate);
    plotTemplate.visualElements = [visualElement];

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    plotTemplate.encodings = encodings;

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