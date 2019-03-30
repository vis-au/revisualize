import * as React from 'react';

import DatasetNode from '../TemplateConfiguration/VegaLiteData/Datasets/DatasetNode';
import GraphNode from '../TemplateConfiguration/VegaLiteData/GraphNode';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import DataFlowDiagram from './Diagram/DataFlowDiagram';
import DataFlowSidebar from './Sidebar/DataFlowSidebar';
import DataFlowToolbar from './Toolbar/DataFlowToolbar';
import DataImportPanel from './Toolbar/DataImportPanel';

import './DataConfigurationView.css';

interface Props {
  activeTab: Tab;
  datasets: GraphNode[];
  onDatasetsChanged: () => void;
}
interface State {
  focusedNode: GraphNode;
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

  private addDatasetNodeToGraph(node: DatasetNode) {
    const nodes = this.props.datasets;
    const nodesWithEqualName = nodes.find(n => n.name === node.name);

    if (nodesWithEqualName !== undefined) {
      return;
    }

    this.props.datasets.push(node);

    this.props.onDatasetsChanged();
  }

  private selectFocusedNode(event: any) {
    // onclick event could be triggered by any node inside block, therefore travel up to component
    // to set selected class there
    let block = event.target;
    while (!block.classList.contains('component')) {
      block = block.parentNode;
    }

    const componentNode = this.props.datasets.filter(node => node.id === block.id)[0];

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
      <DataImportPanel
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
          datasets={ this.props.datasets }
          updateGraph= { this.props.onDatasetsChanged }
        />
        <div id="dataFlowBody">
          <DataFlowDiagram
            datasets={ this.props.datasets }
            updateGraph= { this.props.onDatasetsChanged }
            focusedNode={ this.state.focusedNode }
            selectFocusedNode={ this.selectFocusedNode.bind(this) }
            deselectFocusedNode={ this.deselectfocusedNode.bind(this) }
          />
          <DataFlowSidebar
            focusedNode={ this.state.focusedNode }
            updateFocusedNode={ this.props.onDatasetsChanged }
          />
          <button
            className="floatingAddButton"
            id="addNewDataset"
            onClick={ () => { this.setState({ dataImportVisible: true }); } }>

            +
          </button>
        </div>
      </ViewContainer>
    );
  }
}
