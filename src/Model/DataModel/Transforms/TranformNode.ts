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

  public getSchema() {
    const rootDataset = this.getRootDatasetNode();
    return rootDataset.getSchema();
  }

  public setSchema(data: Data) {
    return;
  }

  public getTransform(): Transform[] {
    const transformNodesOnPathToRoot = this.getFullAncestry();
    const transforms = transformNodesOnPathToRoot
      .filter(n => n instanceof TransformNode)
      .map((n: TransformNode) => n.transform);

    return transforms;
  }
}