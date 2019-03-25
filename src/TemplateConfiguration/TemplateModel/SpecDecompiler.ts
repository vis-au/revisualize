import { isVConcatSpec, isHConcatSpec } from "vega-lite/build/src/spec";

import CompositionTemplate from "./CompositionTemplate";
import { isCompositionSchema, isRepeatSchema, isPlotSchema, isOverlaySchema, isFacetSchema, isConcatenateSchema } from "./SpecUtils";
import PlotTemplate from "./PlotTemplate";
import Template from "./Template";
import VisualMarkTemplate from "./VisualMark";
import { MarkEncoding } from "./MarkEncoding";
import Layout from "./Layout";
import RepeatTemplate from "./RepeatTemplate";
import LayerTemplate from "./LayerTemplate";
import FacetTemplate from "./FacetTemplate";
import ConcatTemplate from "./ConcatTemplate";

export default class SchemaDecompiler {

  private getEncodingsMapFromPlotSchema(schema: any) {
    const templateEncodings = new Map<MarkEncoding, any>();
    const schemaEncodings = Object.keys(schema.encoding) as MarkEncoding[];

    schemaEncodings.forEach((encoding: MarkEncoding) => {
      templateEncodings.set(encoding, schema.encoding[encoding]);
    });

    return templateEncodings;
  }

  private setCommonToplevelProperties(schema: any, template: Template) {
    template.bounds = schema.bounds;
    template.spacing = schema.spacing;
    template.width = schema.width;
    template.height = schema.height;
  }

  private getCompositionTemplate(schema: any) {
    let template: Template = null;
    let visualElements: Template[] = [];

    if (isRepeatSchema(schema)) {
      template = new RepeatTemplate(visualElements);
      (template as RepeatTemplate).repeat = schema.repeat;
      template.visualElements.push(this.decompile(schema.spec));
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
    this.setCommonToplevelProperties(schema, template);

    return template;
  }

  private getPlotTemplate(schema: any) {
    const plotTemplate = new PlotTemplate('histogram', null);
    const visualElement = new VisualMarkTemplate(schema.mark, plotTemplate);
    plotTemplate.visualElements = [visualElement];

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    this.setCommonToplevelProperties(schema, plotTemplate);
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

    template.description = schema.description;
    template.dataRef = schema.data;

    if (template instanceof PlotTemplate) {
      template.selection = schema.selection;
    }

    return template;
  }
}