import * as React from 'react';
import { CompositionTemplate, GraphNode, PlotTemplate, SpecCompiler, Template } from 'toolkitmodel';

import VegaRenderer from '../../../Widgets/Renderer/VegaRenderer';
import Sidebar from '../../../Widgets/Sidebar';
import CompositionTemplateProperties from './CompositionTemplateProperties';
import PlotTemplateProperties from './PlotTemplateProperties';

import SizeConfiguration from './SizeConfiguration';
import './TemplateConfigurationSidebar.css';

interface Props {
  onTemplateChanged: () => void;
  focusedTemplate: Template;
  datasets: GraphNode[];
}
interface State {
  hidden: boolean;
  JSONHidden: boolean;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.onDatasetOptionChanged = this.onDatasetOptionChanged.bind(this);
    this.renderDatasetDropdownOption = this.renderDatasetDropdownOption.bind(this);

    this.specCompiler = new SpecCompiler();
    this.state = {
      hidden: true,
      JSONHidden: true
    };
  }

  public onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  private onDatasetOptionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    const newOptionName = event.target.value;
    const newOption = this.props.datasets.find(d => d.name === newOptionName);

    if (newOption === undefined) {
      return;
    }

    this.props.focusedTemplate.dataTransformationNode = newOption;

    this.props.onTemplateChanged();
  }

  private renderDatasetDropdownOption(datasetOption: GraphNode) {
    return (
      <option
        value={ datasetOption.name }
        className="dataset">

        { datasetOption.name }
      </option>
    );
  }

  private renderDatasetSection() {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    const hasData = this.props.focusedTemplate.dataTransformationNode !== null;
    const hasDataClassName = hasData ? '' : 'unbound';

    const label = hasData
      ? this.props.focusedTemplate.dataTransformationNode.name
      : 'none'

    return (
      <div className={ `datasetSection ${hasDataClassName}` }>
        <h2>Dataset</h2>
        {/* <div className="dataset">{ label }</div> */}
        <select
          name="dataset"
          id="datasetSelection"
          className="datasetSelection"
          value={ label }
          onChange={ this.onDatasetOptionChanged }>
          { this.props.datasets.map(this.renderDatasetDropdownOption) }
        </select>
      </div>
    );
  }

  private renderFocusedTemplateProperties() {
    if (this.props.focusedTemplate instanceof CompositionTemplate) {
      return (
        <CompositionTemplateProperties
          template={ this.props.focusedTemplate }
          onTemplateChanged={ this.props.onTemplateChanged } />
      );
    } else if (this.props.focusedTemplate instanceof PlotTemplate) {
      return (
        <PlotTemplateProperties
          template={ this.props.focusedTemplate }
          onTemplateChanged={ this.props.onTemplateChanged } />
      );
    }
  }

  private renderSizeConfiguration() {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    return (
      <SizeConfiguration
        template={ this.props.focusedTemplate }
        onTemplateChanged={ this.props.onTemplateChanged }
      />
    );
  }

  private renderPreview() {
    if (this.props.focusedTemplate === null) {
      return null;
    }
    if (!this.state.JSONHidden) {
      return null;
    }

    const template = this.props.focusedTemplate;
    const schema = this.specCompiler.getVegaSpecification(template, true, true);

    return (
      <div className="previewContainer">
        <VegaRenderer
          schema={ schema }
          width={ 300 }
          height={ 200 }
        />
      </div>
    );
  }

  private renderVegaLiteCode() {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    const template = this.props.focusedTemplate;
    const spec = this.specCompiler.getVegaSpecification(template, true, true);
    const specString = JSON.stringify(spec, null, 2);

    return (
      <div className="vegaLiteContainer">
        <textarea
          contentEditable={ false }
          id="templateConfigurationSidebarVegaPreview"
          className={ this.state.JSONHidden ? 'hidden' : '' }
          value={ specString }
          onChange={ () => null }>
        </textarea>
      </div>
    );
  }

  public render() {
    const label = this.state.JSONHidden ? 'show JSON' : 'show Preview';

    return (
      <Sidebar
        id="templateConfigurationSidebar"
        height={ window.innerHeight - 75 }
        hidden={ this.state.hidden && this.props.focusedTemplate === null }
        positionLeft={ false }
        toggle={ this.onToggle }>

        <div className="sidebarContainer">
          { this.renderDatasetSection() }
          { this.renderFocusedTemplateProperties() }
          { this.renderSizeConfiguration() }

          <button className="JSONToggle" onClick={() => this.setState({ JSONHidden: !this.state.JSONHidden })}>
            { label }
          </button>
          { this.renderPreview() }
          { this.renderVegaLiteCode() }
        </div>

      </Sidebar>
    );
  }
}