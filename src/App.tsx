import * as React from 'react';
import { GraphNode, Template, URLDatasetNode } from 'toolkitmodel';

import TemplateConfigurationView from './TemplateConfiguration/TemplateConfigurationView';
import MainView from './ToolkitView/MainView';

import './App.css';

interface State {
  width: number;
  datasets: GraphNode[];
  dataflowVisible: boolean;
  templates: Template[];
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.onTemplatesChanged = this.onTemplatesChanged.bind(this);
    this.onDatasetsChanged = this.onDatasetsChanged.bind(this);

    this.state = {
      datasets: [],
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
        datasets.push(...dataset.getFullAncestry())
      }
    });

    return datasets;
  }

  public render() {
    return (
      <div className="App">
        <MainView>
          <TemplateConfigurationView
            className={ this.state.dataflowVisible ? 'faded' : '' }
            templates={ this.state.templates }
            onDatasetsChanged={ this.onDatasetsChanged }
            onTemplatesChanged={ this.onTemplatesChanged }
          />
        </MainView>
      </div>
    );
  }
}
