
import { Transform } from 'vega-lite/build/src/transform';
import GraphNode from '../GraphNode';

export default abstract class DatasetNode extends GraphNode {
  public getTransforms() {
    return [] as Transform[];
  }
}