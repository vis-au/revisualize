
import { InlineDataset } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import GraphNode from '../GraphNode';

export default abstract class DatasetNode extends GraphNode {
  public fields: string[];
  public values: InlineDataset;

  constructor() {
    super();

    this.fields = [];
    this.values = [];
  }

  public getTransformList() {
    // datasets are roots in a data graph and therefore do not have parent or child transforms
    return [] as Transform[];
  }
}