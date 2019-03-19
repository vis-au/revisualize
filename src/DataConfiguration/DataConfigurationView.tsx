import * as React from 'react';

import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import { DataflowNode } from '../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import DataFlowDiagram from './Diagram/DataFlowDiagram';
import DataFlowSidebar from './Sidebar/DataFlowSidebar';
import DataFlowToolbar from './Toolbar/DataFlowToolbar';
import DataImport from './Toolbar/DataImport';

import './DataConfigurationView.css';

interface Props {
  activeTab: Tab;
  graph: DataflowGraph;
  onDataGraphChanged: (graph: DataflowGraph) => void;
}
interface State {
  focusedNode: DataflowNode;
  dataImportVisible: boolean;
}

export default class DataConfigurationView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      dataImportVisible: false,
      focusedNode: null,
    };
  }

  private updateGraph(newGraph: DataflowGraph) {
    this.props.onDataGraphChanged(newGraph);
  }

  private addDatasetNodeToGraph(node: DatasetNode) {
    const nodes = this.props.graph.nodes;

    const nodesWithEqualName = nodes.find(n => n.name === node.name);
    if (nodesWithEqualName !== undefined) { return; }

    node.graph = this.props.graph;
    this.props.graph.nodes.push(node);

    this.updateGraph(this.props.graph);
  }

  private selectfocusedNode(event: any) {
    // onclick event could be triggered by any node inside block, therefore travel up to component
    // to set selected class there
    let block = event.target;
    while (!block.classList.contains('component')) {
      block = block.parentNode;
    }

    const componentNode = this.props.graph.nodes.filter(node => node.id === block.id)[0];

    // this.state.focusedNode = componentNode;
    this.setState({ focusedNode: componentNode });

    // would cause click event to reach root --> deslects focus
    event.stopPropagation();
  }

  private deselectfocusedNode() {
    this.setState({ focusedNode: null });
  }

  private renderDataImportPanel() {
    return (
      <DataImport
        visible={ this.state.dataImportVisible }
        hidePanel={ () => { this.setState({ dataImportVisible: false });}}
        addDatasetNodeToGraph={ this.addDatasetNodeToGraph.bind(this) } />
    );
  }

  public render() {
    return (
      <ViewContainer id="dataFlowComponent" name="Data" activeContainerName={ this.props.activeTab.name }>
        { this.renderDataImportPanel() }
        <DataFlowToolbar
          graph={ this.props.graph }
          updateGraph= { this.updateGraph.bind(this) }
        />
        <div id="dataFlowBody">
          <DataFlowDiagram
            graph={ this.props.graph }
            updateGraph= { this.updateGraph.bind(this) }
            focusedNode={ this.state.focusedNode }
            selectFocusedNode={ this.selectfocusedNode.bind(this) }
            deselectFocusedNode={ this.deselectfocusedNode.bind(this) }
          />
          <DataFlowSidebar
            focusedNode={ this.state.focusedNode }
            updateFocusedNode={ () => this.updateGraph(this.props.graph) }
            showDataImport={ () => { this.setState({ dataImportVisible: true }); } }
          />
        </div>
      </ViewContainer>
    );
  }
}
