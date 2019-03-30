import * as React from 'react';

import DataflowGraph from '../../../Model/DataFlowGraph/DataflowGraph';
import GraphNode from '../../../TemplateConfiguration/VegaLiteData/GraphNode';
import TransformNode from '../../../TemplateConfiguration/VegaLiteData/Transforms/TranformNode';
import Block from './Block';

import './TransformBlock.css';

interface Props {
  node: TransformNode;
  focusedNode: GraphNode;
  dragPlumbing: any;
  onClick: (event: any) => void;
  updateGraph: (newGraph: DataflowGraph) => void;
  onNodeChanged: () => void;
}

export default class FunctionalBlock extends React.Component<Props, {}> {

  private doesNodeHaveDatasource() {
    const rootParent = this.props.node.getRootDatasetNode();

    return rootParent !== null;
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
        body={ this.renderBody() }
        onClick= { this.props.onClick }
        plumbing={ this.props.dragPlumbing }
        updateGraph={ this.props.updateGraph }
      />
    );
  }
}
