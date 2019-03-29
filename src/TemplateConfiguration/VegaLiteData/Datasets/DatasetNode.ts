
import { Transform } from 'vega-lite/build/src/transform';
import GraphNode from '../GraphNode';

export default abstract class DatasetNode extends GraphNode {
  public getTransformList() {
    // datasets are roots in a data graph and therefore do not have parent or child transforms
    return [] as Transform[];
  }
}