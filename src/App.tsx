import * as React from 'react';

import DataFlowConfigurationView from './DataConfiguration/DataConfigurationView';
import { DEFAULT_DATA_GRAPH, DEFAULT_SCALES, DEFAULT_SIGNALS } from './DefaultValueFactories/DefaultValueFactory';
import PatternGraph from './Model/Pattern/PatternGraph';
import DataflowSidepanel from './TemplateConfiguration/Sidebars/DataflowPanel';
import TemplateConfigurationView from './TemplateConfiguration/TemplateConfigurationView';
import Template from './TemplateConfiguration/TemplateModel/Template';
import URLDatasetNode from './TemplateConfiguration/VegaLiteData/Datasets/URLDatasetNode';
import GraphNode from './TemplateConfiguration/VegaLiteData/GraphNode';
import MainView from './ToolkitView/MainView';
import Tab from './ToolkitView/Tab';

import './App.css';

interface State {
  activeTab: Tab;
  height: number;
  width: number;
  datasets: GraphNode[];
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
    this.onDatasetsChanged = this.onDatasetsChanged.bind(this);

    const patternGraph = new PatternGraph();
    patternGraph.globalSignals = DEFAULT_SIGNALS;
    patternGraph.globalScales = DEFAULT_SCALES;
    patternGraph.globalDatasets = DEFAULT_DATA_GRAPH.getDatasetNodes();

    this.state = {
      activeTab: this.tabs[1],
      datasets: [],
      height: window.innerHeight,
      patternGraph,
      width: window.innerWidth,
      dataflowVisible: false,
      templates: [],
    };
  }

  private onDataflowPanelToggle() {
    this.setState({ dataflowVisible: !this.state.dataflowVisible });
  }

  private onTemplatesChanged() {
    const urlDatasets: URLDatasetNode[] = this.state.datasets
      .filter(d => d instanceof URLDatasetNode) as URLDatasetNode[];

    const newDatasets = this.getDatasetsFromTemplates()
      .filter(d => {
        if (d instanceof URLDatasetNode) {
          return urlDatasets.find(ud => ud.url === d.url) === undefined;
        } else {
          return this.state.datasets.find(dd => dd.name === d.name) === undefined;
        }
      });

    this.state.datasets.push(...newDatasets);

    this.setState({
      templates: this.state.templates,
      datasets: this.state.datasets
    });
  }

  private onDatasetsChanged() {
    this.setState({
      datasets: this.state.datasets
    });
  }

  private getDatasetsFromTemplates() {
    const datasets: GraphNode[] = this.state.datasets.map(d => d);

    this.state.templates.forEach(template => {
      const dataset = template.dataTransformationNode;

      if (dataset !== null) {
        datasets.push(dataset);
        datasets.push(...dataset.getFullAncestry())
      }
    });

    return datasets;
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
              datasets={ this.state.datasets }
              onDatasetsChanged={ this.onDatasetsChanged }
            />
          </DataflowSidepanel>
          <TemplateConfigurationView
            className={ this.state.dataflowVisible ? 'faded' : '' }
            activeTab={ this.state.activeTab }
            templates={ this.state.templates }
            onDatasetsChanged={ this.onDatasetsChanged }
            onTemplatesChanged={ this.onTemplatesChanged }
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
