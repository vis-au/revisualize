import * as React from 'react';
import { Transform } from 'vega-lite/build/src/transform';

import { TransformGroupName, transformGroupNames } from '../../Model/DataFlowGraph/TransformTypes';
import GraphNode from '../../TemplateConfiguration/VegaLiteData/GraphNode';
import TransformNode from '../../TemplateConfiguration/VegaLiteData/Transforms/TranformNode';
import Toolbar from '../../Widgets/Toolbar';
import TransformGroupBlock from './TransformGroup';

import './DataFlowToolbar.css';

interface Props {
  datasets: GraphNode[];
  updateGraph: () => void;
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
    const newTransformNode = new TransformNode();

    newTransformNode.transform = transform;

    this.props.datasets.push(newTransformNode);
    this.props.updateGraph();
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
