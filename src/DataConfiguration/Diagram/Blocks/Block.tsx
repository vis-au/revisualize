import * as React from 'react';

import DataflowGraph from '../../../Model/DataFlowGraph/DataflowGraph';
import TransformNode from '../../../Model/DataFlowGraph/TransformNode';
import GraphNode from '../../../TemplateConfiguration/VegaLiteData/GraphNode';
import CONFIG from '../DataFlowConfig';

import DatasetNode from '../../../TemplateConfiguration/VegaLiteData/Datasets/DatasetNode';
import './Block.css';

interface BlockProps {
  name: string;
  body: JSX.Element;
  footer?: JSX.Element;
  node: GraphNode;
  focusedNode: GraphNode;
  className?: string;
  indicators?: any;
  plumbing: any; // cannot set jsplumbinstance because typing is inconsistent

  updateGraph: (newGraph: DataflowGraph) => void;
  onClick: (event: any) => void;
}

export default class Block extends React.Component<BlockProps, {}> {
  constructor(props: BlockProps) {
    super(props);

    setTimeout(this.addPlumbing.bind(this), 0);
  }

  private addPlumbing() {
    const nodeSelector = document.querySelector(`#${this.props.node.id}`);
    const bodySelector = document.querySelector(`#${this.props.node.id} .body`);

    const plumbing = this.props.plumbing;

    // drag link to block to create link
    plumbing.makeSource(bodySelector, CONFIG.sourceEndpointOptions);

    if (this.props.node instanceof TransformNode) {
      plumbing.makeTarget(nodeSelector, CONFIG.targetEndpointOptions);
    }

    // dragging links to components creates links as well
    plumbing.draggable(nodeSelector, {
      filter: '.body,.body *'
    });
  }

  private deleteNodeFromGraph() {
    // const graph = this.props.node.graph;
    // const nodes = graph.nodes;
    // const indexInNodes = nodes.indexOf(this.props.node);

    // nodes.splice(indexInNodes, 1);

    // this.props.updateGraph(graph);
  }

  private deletePlumbing() {
    const plumbing = this.props.plumbing;

    // find all connections, since those use different endpoints than the one added on creation
    const connections = plumbing
      .getAllConnections()
      .filter((c: any) => {
        const e = c.getAttachedElements();
        const isSource = e[0].element.parentNode.id === this.props.node.id;
        const isTarget = e[1].element.id === this.props.node.id;
        return isSource || isTarget;
      });

    connections.forEach((c: any) => plumbing.deleteConnection(c));
  }

  private delete(event: MouseEvent) {
    this.deletePlumbing();
    this.deleteNodeFromGraph();
    event.stopPropagation();
  }

  private getClassName() {
    const nodeTypeClass = this.props.node instanceof DatasetNode ? 'dataset' : 'transform';
    const classNameProp = (this.props.className || '');
    const isfocusedNode = this.props.focusedNode === this.props.node;
    const focusedNodeClass = isfocusedNode ? 'focus' : '';

    return `component ${nodeTypeClass} ${classNameProp} ${focusedNodeClass}`;
  }

  public render() {
    return (
      <div
        onClick={ this.props.onClick }
        className={ this.getClassName() }
        id={ this.props.node.id }>
        <div className="indicators">
          { this.props.indicators }
        </div>
        <div className="header">
          <h2>
            <span className="name">{this.props.name}</span>
            <span className="delete" onClick={ this.delete.bind(this) }></span>
          </h2>
        </div>
        <div className="body">
          { this.props.body }
        </div>
        <div className="footer">
          { this.props.footer }
        </div>
      </div>
    );
  }
}