import { Data, Spec } from 'vega';
import DataflowGraph from './DataFlowGraph/DataflowGraph';
import { DataflowNode } from './DataFlowGraph/DataflowNode';
import DatasetNode from './DataFlowGraph/DatasetNode';
import TransformNode from './DataFlowGraph/TransformNode';
import Pattern from './Pattern/Pattern';


export default class VegaAdapter {
  public transformNodeToDataProperty(node: DataflowNode, graph?: DataflowGraph): Data {

    if (node instanceof DatasetNode) {
      return node.data;
    } else if (node instanceof TransformNode) {
      return graph.getDataForTransformNode(node);
    }

    return null;
  }

  public getSchemaForPattern(pattern: Pattern) {
    const schema: Spec = {};

    schema.$schema = this.getVegaSchemaURL();
    schema.data = [];
    schema.marks = [];
    schema.scales = [];
    schema.signals = pattern.graph.globalSignals;

    if (pattern.dataset !== null) {
      schema.data = [pattern.dataset.data];
      pattern.graph.globalDatasets
        .filter(dataset => schema.data.find(d => d.name === dataset.name) === undefined)
        .forEach(dataset => { schema.data.push(dataset.data); });
    }

    if (pattern.layout !== null) {
      schema.scales = pattern.layout.scales;
      schema.scales = schema.scales.concat(pattern.customScales);
      schema.axes = pattern.layout.axes;

      if (pattern.layout.transformedDatasets !== undefined) {
        schema.data = schema.data.concat(pattern.layout.transformedDatasets);
      }
      if (pattern.layout.transformedScales !== undefined) {
        schema.scales = schema.scales.concat(pattern.layout.transformedScales);
      }
      if (pattern.layout.transformedSignals !== undefined) {
        schema.signals = schema.signals.concat(pattern.layout.transformedSignals);
      }
    }

    if (pattern.visualElement !== null) {
      schema.marks = [ pattern.visualElement.mark ];

      // layout may add modifications to the mark of the visual element
      if (pattern.layout !== null) {
        const transformedData = pattern.layout.transformedMarks;
        if (transformedData !== null && transformedData !== undefined) {
          schema.marks = pattern.layout.transformedMarks;
        }
      }
    }

    if (pattern.interactionProviders.length > 0) {
      pattern.interactionProviders.forEach(provider => {
        provider.interaction.signals.forEach(signal => {
          if (schema.signals.find(s => s.name === signal.name) === undefined) {
            schema.signals.push(signal);
          }
        });
      });
    }

    return schema;
  }

  public getVegaSchemaURL() {
    return 'https://vega.github.io/schema/vega/v4.json';
  }
}