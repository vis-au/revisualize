import * as React from 'react';

import DataFlowConfigurationView from './DataConfiguration/DataConfigurationView';
import { DEFAULT_DATA_GRAPH, DEFAULT_SCALES, DEFAULT_SIGNALS } from './DefaultValueFactories/DefaultValueFactory';
import DataflowGraph from './Model/DataFlowGraph/DataflowGraph';
import PatternGraph from './Model/Pattern/PatternGraph';
import TemplateConfigurationView from './TemplateConfiguration/TemplateConfigurationView';
import MainView from './ToolkitView/MainView';
import Tab from './ToolkitView/Tab';
import TabNavigation from './ToolkitView/TabNavigation';
import DataflowSidepanel from './TemplateConfiguration/Sidebars/DataflowPanel';
import TemplateConfigurationSidebar from './TemplateConfiguration/Sidebars/TemplateConfigurationSidebar';
import Template from './TemplateConfiguration/TemplateModel/Template';

import './App.css';

interface State {
  activeTab: Tab;
  height: number;
  width: number;
  dataGraph: DataflowGraph;
  patternGraph: PatternGraph;
  dataflowVisible: boolean;
  templates: Template[];
}

export default class App extends React.Component<{}, State> {
  private tabs: Tab[];

  constructor(props: {}) {
    super(props);

    this.tabs = [
      new Tab('Data'),
      // new Tab('Scales'),
      new Tab('Templates'),
      // new Tab('Interactions'),
      // new Tab('Patterns'),
      // new Tab('Dashboard')
    ];

    this.onTemplatesChanged = this.onTemplatesChanged.bind(this);

    const patternGraph = new PatternGraph();
    patternGraph.globalSignals = DEFAULT_SIGNALS;
    patternGraph.globalScales = DEFAULT_SCALES;
    patternGraph.globalDatasets = DEFAULT_DATA_GRAPH.getDatasetNodes();

    this.state = {
      activeTab: this.tabs[1],
      dataGraph: DEFAULT_DATA_GRAPH,
      height: window.innerHeight,
      patternGraph,
      width: window.innerWidth,
      dataflowVisible: false,
      templates: []
    };

    window.addEventListener('resize', () => {
      this.setState({
        height: window.innerHeight,
        width: window.innerWidth
      });
    });
  }

  private onDataflowPanelToggle() {
    this.setState({ dataflowVisible: !this.state.dataflowVisible });
  }

  private onTemplatesChanged() {
    this.setState({ templates: this.state.templates });
  }

  private updateDataGraph(newGraph: DataflowGraph) {
    this.setState({
      dataGraph: newGraph
    });
  }

  private updatePatternGraph(newPatternGraph: PatternGraph) {
    this.setState({ patternGraph: newPatternGraph });
  }

  private updateActiveTab(activeTab: Tab) {
    this.setState({ activeTab });
  }

  private getActiveTab(): Tab {
    return this.state.activeTab;
  }

  public render() {
    return (
      <div
        className="App"
        style={{ height: this.state.height }}>

        {/* <TabNavigation
          tabs={ this.tabs }
          updateActiveTab={ this.updateActiveTab.bind(this) }
          getActiveTab={ this.getActiveTab.bind(this) }
        /> */}

        <MainView height={ this.state.height }>
          {/* <PatternConfigurationView
            activeTab={ this.state.activeTab }
            patternGraph={ this.state.patternGraph }
            datasetGraph={ this.state.dataGraph }
            onPatternGraphChanged={ this.updatePatternGraph.bind(this) }
          /> */}
          {/* <InteractionConfigurationView
            activeTab={ this.state.activeTab }
            datasetGraph={ this.state.dataGraph }
            patternGraph={ this.state.patternGraph }
            onPatternGraphChanged={ this.updatePatternGraph.bind(this) }
          /> */}
          <DataflowSidepanel
            onToggle={ this.onDataflowPanelToggle.bind(this) }
            hidden={ !this.state.dataflowVisible }>

            <DataFlowConfigurationView
              activeTab={ new Tab('Data') }
              graph={ this.state.dataGraph }
              onDataGraphChanged={ this.updateDataGraph.bind(this) }
            />
          </DataflowSidepanel>
          <TemplateConfigurationView
            className={ this.state.dataflowVisible ? 'faded' : '' }
            activeTab={ this.state.activeTab }
            templates={ this.state.templates }
            onTemplatesChanged={ this.onTemplatesChanged }
          />
          <TemplateConfigurationSidebar
            onTemplateChanged={ this.onTemplatesChanged }
          />
          {/* <PreviewComponentView
            activeTab={ this.state.activeTab }
            width={ this.state.width - 100 }
            height={ this.state.height - 100 }
            patternGraph={ this.state.patternGraph }
          /> */}
        </MainView>
      </div>
    );
  }
}
