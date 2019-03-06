import * as React from 'react';

import DataflowGraph from '../../../Model/DataFlowGraph/DataflowGraph';
import { DataflowNode } from '../../../Model/DataFlowGraph/DataflowNode';
import TransformNode from '../../../Model/DataFlowGraph/TransformNode';
import Block from './Block';

import './TransformBlock.css';

interface Props {
  node: TransformNode;
  focusedNode: DataflowNode;
  dragPlumbing: any;
  onClick: (event: any) => void;
  updateGraph: (newGraph: DataflowGraph) => void;
  onNodeChanged: () => void;
}

export default class FunctionalBlock extends React.Component<Props, {}> {

  private doesNodeHaveDatasource() {
    const nodesWithDatasource = this.props.node.graph.getFunctionalNodesConnectedToAnyDataset();
    const hasDatasource = nodesWithDatasource.indexOf(this.props.node) > -1;

    return hasDatasource;
  }

  private renderLeafMarker() {
    const leafNodes = this.props.node.graph.getLeafNodes();
    const indexInLeafNodes = leafNodes.filter(node => node.id === this.props.node.id)[0];
    const isLeafNode = indexInLeafNodes !== undefined;

    if (!isLeafNode) { return false; }

    return (
      <span
        key="leafMarker"
        className={'marker leaf'}
        title={ this.props.node.id }>
      </span>
    );
  }

  private renderBody(): JSX.Element {
    return null;
  }

  public render() {
    return (
      <Block
        node={ this.props.node }
        focusedNode={ this.props.focusedNode }
        name={ (this.props.node.name || this.props.node.id) }
        className={ this.doesNodeHaveDatasource() ? 'transform' : 'transform invalid' }
        indicators={ this.renderLeafMarker() }
        body={ this.renderBody() }
        onClick= { this.props.onClick }
        plumbing={ this.props.dragPlumbing }
        updateGraph={ this.props.updateGraph }
      />
    );
  }
}
