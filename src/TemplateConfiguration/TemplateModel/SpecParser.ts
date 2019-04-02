import { isHConcatSpec, isVConcatSpec } from 'vega-lite/build/src/spec';

import { isInlineData, isNamedData, isUrlData } from 'vega-lite/build/src/data';
import { isFieldDef, isRepeatRef } from 'vega-lite/build/src/fielddef';
import { isConcatSpec } from 'vega-lite/build/src/spec/concat';
import { Transform } from 'vega-lite/build/src/transform';

import DatasetNode from '../VegaLiteData/Datasets/DatasetNode';
import InlineDatasetNode from '../VegaLiteData/Datasets/InlineDatasetNode';
import NamedDataSourceNode from '../VegaLiteData/Datasets/NamedDataSourceNode';
import URLDatasetNode from '../VegaLiteData/Datasets/URLDatasetNode';
import GraphNode from '../VegaLiteData/GraphNode';
import TransformNode from '../VegaLiteData/Transforms/TranformNode';
import CompositionTemplate from './CompositionTemplate';
import ConcatTemplate from './ConcatTemplate';
import FacetTemplate from './FacetTemplate';
import LayerTemplate from './LayerTemplate';
import { MarkEncoding } from './MarkEncoding';
import PlotTemplate from './PlotTemplate';
import RepeatTemplate from './RepeatTemplate';
import { getMarkPropertiesAsMap, isCompositionSchema, isConcatenateSchema, isFacetSchema, isOverlaySchema, isPlotSchema, isRepeatSchema } from './SpecUtils';
import Template from './Template';

export default class SchemaParser {

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
    template.bounds = schema.bounds;
    template.spacing = schema.spacing;
    template.width = schema.width;
    template.height = schema.height;
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
   */
  private removeRepeatFromChildTemplates(template: RepeatTemplate) {
    const nonRepeatSubTemplates = this.getNonRepeatSubtrees(template);

    nonRepeatSubTemplates.forEach(childTemplate => {
      const repeatedFields = template.repeat.column.concat(template.repeat.row);

      childTemplate.encodings.forEach((value: any, key: MarkEncoding) => {
        if (isFieldDef<any>(value)) {
          if (isRepeatRef(value.field)) {
            const index = Math.floor(Math.random() * repeatedFields.length);
            const fieldRef = {
              field: repeatedFields[index],
              type: (value as any).type
            };

            childTemplate.overwrittenEncodings.set(key, fieldRef)
          }
        }
      });
    });
  }

  private getRepeatTemplate(schema: any) {
    const template = new RepeatTemplate([]);
    template.repeat = schema.repeat;
    const childTemplate = this.parse(schema.spec);
    template.visualElements = [childTemplate];
    this.removeRepeatFromChildTemplates(template);

    return template;
  }

  private getFacetTemplate(schema: any) {
    const template = new FacetTemplate([]);
    const visualElements: Template[] = [];

    if (schema.facet !== undefined) {
      template.facet = JSON.parse(JSON.stringify(schema.facet));
      delete schema.facet;
      visualElements.push(this.parse(schema.spec));
    } else if (schema.encoding.facet !== undefined) {
      template.isInlineFacetted = true;
      template.facet = JSON.parse(JSON.stringify(schema.encoding.facet));
      delete schema.encoding.facet;
      visualElements.push(this.parse(schema));
    }

    template.visualElements = visualElements;

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
      template.visualElements.push(this.parse(layer));
    });

    return template;
  }

  private getConcatTemplate(schema: any) {
    const template = new ConcatTemplate([]);

    if (isVConcatSpec(schema)) {
      template.isVertical = true;
      template.isWrappable = false;
      schema.vconcat.forEach((layer: any) => {
        template.visualElements.push(this.parse(layer));
      });
    } else if (isHConcatSpec(schema)) {
      template.isVertical = false;
      template.isWrappable = false;
      schema.hconcat.forEach((layer: any) => {
        template.visualElements.push(this.parse(layer));
      });
    } else if (isConcatSpec(schema)) {
      template.isVertical = false;
      template.isWrappable = true;
      schema.concat.forEach((layer: any) => {
        template.visualElements.push(this.parse(layer));
      });
    }

    return template;
  }

  private getCompositionTemplate(schema: any) {
    let template: CompositionTemplate = null;

    if (isRepeatSchema(schema)) {
      template = this.getRepeatTemplate(schema);
    } else if (isOverlaySchema(schema)) {
      template = this.getLayerTemplate(schema);
    } else if (isFacetSchema(schema)) {
      template = this.getFacetTemplate(schema);
    } else if (isConcatenateSchema(schema)) {
      template = this.getConcatTemplate(schema);
    }

    template.resolve = schema.resolve;
    template.visualElements.forEach(t => t.parent = template);

    return template;
  }

  private getPlotTemplate(schema: any) {
    const plotTemplate = new PlotTemplate(null);
    plotTemplate.mark = schema.mark;

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    const properties = getMarkPropertiesAsMap(schema.mark);

    plotTemplate.encodings = encodings;
    plotTemplate.staticMarkProperties = properties;

    return plotTemplate;
  }

  private getRootDatasetNode(schema: any): DatasetNode {
    const data = schema.data;

    if (data === undefined) {
      return null;
    }

    let rootNode: DatasetNode = null;

    if (isUrlData(data)) {
      rootNode = new URLDatasetNode();
    } else if (isNamedData(data)) {
      rootNode = new NamedDataSourceNode();
    } else if (isInlineData(data)) {
      rootNode = new InlineDatasetNode();
    }

    rootNode.setSchema(data);

    return rootNode;
  }

  private getLeafTransformNode(schema: any, rootNode: DatasetNode): GraphNode {
    const transforms: Transform[] = schema.transform;
    let workingNode: GraphNode = rootNode;

    if (transforms === undefined) {
      return rootNode;
    }

    // create linear transformation list from the spec by creating a new transformation node for
    // each entry in the spec and linking it to the existin graph
    if (transforms !== undefined) {
      transforms.forEach(t => {
        const transformNode = new TransformNode();
        transformNode.transform = t;

        transformNode.parent = workingNode;
        workingNode.children.push(transformNode);

        workingNode = transformNode;
      });
    }

    return workingNode;
  }

  private parseDataTransformation(schema: any): GraphNode {
    const rootDataset = this.getRootDatasetNode(schema);

    if (rootDataset === null) {
      return rootDataset;
    } else {
      return this.getLeafTransformNode(schema, rootDataset);
    }
  }

  public parse(schema: any) {
    let template: Template = null;

    if (isCompositionSchema(schema)) {
      template = this.getCompositionTemplate(schema);
    } else if (isPlotSchema(schema)) {
      template = this.getPlotTemplate(schema);
    }

    this.setSingleViewProperties(schema, template);

    const dataTransformation = this.parseDataTransformation(schema);
    template.dataTransformationNode = dataTransformation;

    if (template instanceof PlotTemplate) {
      template.selection = schema.selection;
    }

    return template;
  }
}