import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import TransformNode from './Transforms/TranformNode';

export default abstract class GraphNode {
  public readonly id: string;
  public parent: GraphNode;
  public children: TransformNode[];

  constructor() {
    this.id = `node${Math.random()}`;
    this.parent = null;
    this.children = [];
  }

  public abstract getSchema(): Data;

  public abstract setSchema(schema: Data): void;

  public abstract getTransformList(): Transform[];
}