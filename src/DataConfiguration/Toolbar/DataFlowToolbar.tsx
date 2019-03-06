import * as React from 'react';
import { Transform } from 'vega';

import DataflowGraph from '../../Model/DataFlowGraph/DataflowGraph';
import TransformNode from '../../Model/DataFlowGraph/TransformNode';
import { TransformGroupName, transformGroupNames } from '../../Model/DataFlowGraph/TransformTypes';
import Toolbar from '../../Widgets/Toolbar';
import TransformGroupBlock from './TransformGroup';

import './DataFlowToolbar.css';

interface Props {
  graph: DataflowGraph;
  updateGraph: (newGraph: DataflowGraph) => void;
}
interface State {
  visibleGroup: string;
}

export default class DataFlowToolbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { visibleGroup: null };
  }

  private onTransformGroupClicked(key: string) {
    this.setState({ visibleGroup: key });
  }

  private addTransformNode(transform: Transform) {
    const graph = this.props.graph;
    const nodes = graph.nodes;

    const newTransformNode = new TransformNode();
    newTransformNode.transform = transform;
    newTransformNode.graph = this.props.graph;

    nodes.push(newTransformNode);

    this.props.updateGraph(graph);
  }

  private renderTransformGroup(key: TransformGroupName) {
    return (
      <TransformGroupBlock
        className="transform"
        key={ key }
        groupName={ key }
        visible={ this.state.visibleGroup === key }
        addBlock={ this.addTransformNode.bind(this) }
        onGroupClicked={ this.onTransformGroupClicked.bind(this) }
      />
    );
  }

  private renderTransformGroups() {
    return (
      <div id="dataflowToolbarTransformGroups">
        { transformGroupNames.map(this.renderTransformGroup.bind(this)) }
      </div>
    );
  }

  public render() {
    return (
      <Toolbar id="dataFlowToolbar">
        <div id="dataflowToolbarTools">
          { this.renderTransformGroups() }
        </div>
      </Toolbar>
    );
  }
}
