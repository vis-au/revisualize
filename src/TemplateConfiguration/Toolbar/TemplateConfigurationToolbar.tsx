import * as React from 'react';
import { BaseSpec } from 'vega-lite/build/src/spec';

import SpecParser from '../../Model/TemplateModel/SpecParser';
import Template from '../../Model/TemplateModel/Template';
import Toolbar from '../../Widgets/Toolbar';
import VegaJSONInput from './VegaJSONInput';

import './TemplateConfigurationToolbar.css';

interface Props {
  plumbingVisible: boolean;
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
  togglePlumbingVisible: (visible?: boolean) => void;
  toggleExampleOverlayVisible: (visible?: boolean) => void;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  private specParser: SpecParser;

  constructor(props: Props) {
    super(props);

    this.addTemplateFromSpec = this.addTemplateFromSpec.bind(this);
    this.onPlumbingToggleClicked = this.onPlumbingToggleClicked.bind(this);
    this.onExampleToggleClicked = this.onExampleToggleClicked.bind(this);
  }

  private addTemplateFromSpec(spec: BaseSpec) {
    const parsedTemplate = this.specParser.parse(spec);
    this.props.addTemplates(parsedTemplate.getFlatHierarchy());
  }

  private onPlumbingToggleClicked(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.togglePlumbingVisible(event.target.checked);
  }

  private onExampleToggleClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.props.toggleExampleOverlayVisible();
  }

  private renderPlumbingToggle() {
    return (
      <div className="plumbingToggleContainer">
        <input
          type="checkbox"
          id="plumbingToggle"
          checked={ this.props.plumbingVisible }
          onChange={ this.onPlumbingToggleClicked } />
        <label htmlFor="plumbingToggle">Show Connections</label>
      </div>
    );
  }

  public render() {
    return (
      <Toolbar id="templateToolbar">
        <div className="column" id="templateImport">
          <h2>Import</h2>
          <button className="toggleExampleOverlay" onClick={ this.onExampleToggleClicked }>
            Show Examples
          </button>
        </div>
        <div className="column">
          <h2>Vega-lite JSON</h2>
          <VegaJSONInput loadSpec={ this.addTemplateFromSpec } />
        </div>
        <div className="column">
          { this.renderPlumbingToggle() }
        </div>
      </Toolbar>
    );
  }

  public componentDidMount() {
    // this.addTemplateFromSpec(this.specPresets.get('repeatOverlay'));
  }
}