import * as vega from 'vega';
import { Data, Spec, View } from 'vega';

import DataflowLink from './DataflowLink';
import { DataflowNode } from './DataflowNode';
import DatasetNode from './DatasetNode';
import TransformNode from './TransformNode';

export default class DataflowGraph {
  constructor(public nodes: DataflowNode[], public links: DataflowLink[]) {}

  public addLink(link: DataflowLink): void {
    this.links.push(link);
  }

  public removeLink(link: DataflowLink): void {
    const links = this.links;
    const indexInLinks = links.indexOf(link);

    this.links.splice(indexInLinks, 1);
  }

  public getLeafNodes(): DataflowNode[] {
    const nodes = this.nodes;
    const links = this.links;

    // find all functional blocks that have no outgoing links and are therefore leafs
    const leafNodes = nodes
      .filter(node => {
        const outgoingLinks = links.filter(link => link.source === node);
        return outgoingLinks.length === 0;
      });

    return leafNodes;
  }

  public getChildNodes(parent: DataflowNode): DataflowNode[] {
    const childNodes = this.links
      .filter(link => link.source === parent)
      .map(link => link.target);

    return childNodes;
  }

  public getDatasetNodes(): DatasetNode[] {
    const datasetNodes: DatasetNode[] = [];

    this.nodes.forEach(node => {
      if (node instanceof DatasetNode) { datasetNodes.push(node); }
    });

    return datasetNodes;
  }

  public getFunctionalNodesConnectedToAnyDataset(): TransformNode[] {
    const nodes = this.nodes;
    let connectedToDataset: any = [];

    const datasetNodes = nodes.filter(node => node.type === 'dataset');
    let workingNodes = datasetNodes;
    let nextWorkingNodes: DataflowNode[] = [];

    // go through the graph iteratively level by level, saving references to explored nodes
    while (workingNodes.length > 0) {
      nextWorkingNodes = [];

      workingNodes.forEach(node => {
        const childNodes = this.getChildNodes(node)
          .filter(n => connectedToDataset.indexOf(n) === -1);

        connectedToDataset = connectedToDataset.concat(childNodes);
        nextWorkingNodes = nextWorkingNodes.concat(childNodes);
      });

      workingNodes = nextWorkingNodes;
    }

    return connectedToDataset;
  }

  private getParentNode(node: DataflowNode) {
    const linkToParent = this.links.find(link => link.target === node);

    if (linkToParent === undefined) { return null; }

    return linkToParent.source;
  }

  private getPathFromConnectedDatasetToNode(node: TransformNode) {
    const path: DataflowNode[] = [];
    let workingNode: DataflowNode = node;

    while (workingNode instanceof TransformNode) {
      path.push(workingNode);
      workingNode = this.getParentNode(workingNode);
    }

    path.push(workingNode);
    path.reverse();

    return path;
  }

  public getDataForTransformNode(node: TransformNode) {
    // get path from root dataset to this node
    const pathToRootDatasetNode = this.getPathFromConnectedDatasetToNode(node);

    // chain data transforms from the path and add it to the root dataset
    const rootDatasetNode = pathToRootDatasetNode[0];

    if (!(rootDatasetNode instanceof DatasetNode)) { return null; }

    const datasetIncludingTransforms: Data = JSON.parse(JSON.stringify(rootDatasetNode.data));
    datasetIncludingTransforms.name = node.name;

    const transforms = pathToRootDatasetNode
      .map(transform => {
        if (!(transform instanceof TransformNode)) { return null; }
        return transform.transform;
      })
      .filter(t => t !== null); // removes null entry added for the root dataset in map()

    datasetIncludingTransforms.transform = transforms;
    return datasetIncludingTransforms;
  }

  public async getFieldsForDataInSpecByName(spec: Spec, name: string) {

    const transformedData = await new Promise<any[]>((res, rej) => {
      const view: View = new View(vega.parse(spec));

      view
        .logLevel(vega.Warn)
        .initialize()
        .renderer('svg')
        .hover()
        .run();

      // vega view takes some time to initialize and run, so wait for 1500 seconds before accessing
      // the dataset, as the dataflow graph may not be done before that
      setTimeout(() => {
        res(view.data(name));
      }, 1500);
    });

    return Object.keys(transformedData[0]);
  }

  public getNumberOfTransformNodesOfType(type: string) {
    // find all transform nodes with a Transform of this type
    const nodesOfThisType = this.nodes.filter(node => {
      if (!(node instanceof TransformNode)) { return false; }

      return node.transform.type === type;
    });

    if (nodesOfThisType.length === 0) { return 0; }

    // get sorted number suffixes
    const indecesOfNodesOfThisType = nodesOfThisType
      .map(node => +node.name.match(/[0-9]+/)[0])
      .sort();

    // return largest suffix + 1
    return indecesOfNodesOfThisType[indecesOfNodesOfThisType.length - 1] + 1;
  }
}