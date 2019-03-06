import { InteractionGraphLink } from './InteractionGraphLink';
import { InteractionGraphNode } from './InteractionGraphNode';

export default class InteractionGraph {
  private _nodes: InteractionGraphNode[];
  private _links: InteractionGraphLink[];

  public addNode(node: InteractionGraphNode) {
    this._nodes.push(node);
  }

  public removeNode(node: InteractionGraphNode) {
    const indexInNodes = this._nodes.indexOf(node);

    if (indexInNodes > -1) {
      this._nodes.splice(indexInNodes, 1);
    }
  }

  public hasNode(node: InteractionGraphNode) {
    return this._nodes.indexOf(node) > -1;
  }

  public addLink(link: InteractionGraphLink) {
    this._links.push(link);
  }

  public removeLink(link: InteractionGraphLink) {
    const indexInLinks = this._links.indexOf(link);

    if (indexInLinks > -1) {
      this._links.splice(indexInLinks, 1);
    }
  }

  public hasLink(link: InteractionGraphLink): boolean {
    return this._links.indexOf(link) > -1;
  }

  public get nodes(): InteractionGraphNode[] {
    return this._nodes;
  }

  public get links(): InteractionGraphLink[] {
    return this._links;
  }
}