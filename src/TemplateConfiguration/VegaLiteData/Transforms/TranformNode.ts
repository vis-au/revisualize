import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import DatasetNode from '../Datasets/DatasetNode';
import GraphNode from '../GraphNode';

export default class TransformNode extends GraphNode {
  public transform: Transform;

  public getRootDatasetNode() {
    let workingNode: GraphNode = this.parent;

    // go up in the node's hierarchy as far as possible
    while (workingNode.parent !== null) {
      workingNode = workingNode.parent;
    }

    if (!(workingNode instanceof DatasetNode)) {
      return null;
    }

    return workingNode;
  }

  private getTransformsOnPathToRoot(): TransformNode[] {
    const transformsOnPathToRoot: TransformNode[] = [];
    let workingNode: GraphNode = this.parent;

    // go up in the node's hierarchy as far as possible
    while (workingNode.parent !== null) {

      if (workingNode instanceof TransformNode) {
        transformsOnPathToRoot.push(workingNode);
      }

      workingNode = workingNode.parent;
    }

    if (!(workingNode instanceof DatasetNode)) {
      return [];
    }

    return transformsOnPathToRoot.reverse();
  }

  public getSchema() {
    const rootDataset = this.getRootDatasetNode();
    return rootDataset.getSchema();
  }

  public setSchema(data: Data) {
    return;
  }

  public getTransformList(): Transform[] {
    const transformNodesOnPathToRoot = this.getTransformsOnPathToRoot();
    const transforms = transformNodesOnPathToRoot.map(n => n.transform);

    return transforms;
  }
}