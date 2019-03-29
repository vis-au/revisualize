import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import GraphNode from '../GraphNode';

export default class TransformNode extends GraphNode {
  public transform: Transform;

  public getSchema() {
    return {} as Data;
  }

  public setSchema(data: Data) {
    return;
  }

  public getTransformList() {
    return [ this.transform ];
  }
}