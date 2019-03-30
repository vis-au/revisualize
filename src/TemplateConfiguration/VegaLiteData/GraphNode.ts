import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import DatasetNode from './Datasets/DatasetNode';
import TransformNode from './Transforms/TranformNode';

export default abstract class GraphNode {
  public readonly id: string;
  public myName: string;
  public parent: GraphNode;
  public children: TransformNode[];

  constructor() {
    this.id = `node${Math.floor(Math.random() * 1000000)}`;
    this.myName = '';
    this.parent = null;
    this.children = [];
  }

  public abstract getSchema(): Data;

  public abstract setSchema(schema: Data): void;

  public abstract getTransformList(): Transform[];

  public getAllChildNodes(): TransformNode[] {
    const allChildNodes = this.children;

    this.children.forEach(childNode => {
      allChildNodes.push(...childNode.getAllChildNodes());
    });

    return allChildNodes;
  }

  public getFullAncestry(): GraphNode[] {
    const allParentNodes: GraphNode[] = [];
    let workingNode: GraphNode = this.parent;

    if (this.parent === null) {
      return [];
    }

    // go up in the node's hierarchy as far as possible
    while (workingNode !== null) {
      allParentNodes.push(workingNode);
      workingNode = workingNode.parent;
    }

    return allParentNodes.reverse();
  }

  public get name(): string {
    if (this.myName === undefined) {
      return this.id;
    }

    return this.myName;
  }

  public set name(name: string) {
    if (name === undefined) {
      name = this.id;
    }

    this.myName = name;
  }
}