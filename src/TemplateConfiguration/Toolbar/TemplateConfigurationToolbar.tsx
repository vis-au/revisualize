import * as React from 'react';
import { BaseSpec } from 'vega-lite/build/src/spec';

import Toolbar from '../../Widgets/Toolbar';
import SpecParser from '../TemplateModel/SpecParser';
import Template from '../TemplateModel/Template';
import { barchartSpec, candlestickSpec, carbonDioxide, concatenateSpec, mosaicPreset, parallelCoordinatesPreset, populationLayerChart, repeatOverlayPreset, scatterplotMatrixSpec, stackedAreaPreset, stackedBarchartPreset, streamGraphPreset } from './SpecPresets';
import VegaJSONInput from './VegaJSONInput';

import './TemplateConfigurationToolbar.css';

interface Props {
  plumbingVisible: boolean;
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
  togglePlumbingVisible: (visible?: boolean) => void;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  private specPresets: Map<string, any>;
  private specParser: SpecParser;

  constructor(props: Props) {
    super(props);

    this.addTemplateFromSpec = this.addTemplateFromSpec.bind(this);
    this.onPlumbingToggleClicked = this.onPlumbingToggleClicked.bind(this);

    this.specParser = new SpecParser();

    this.specPresets = new Map();
    this.specPresets.set('population', populationLayerChart);
    this.specPresets.set('barchart', barchartSpec);
    this.specPresets.set('scattMatrx', scatterplotMatrixSpec);
    this.specPresets.set('candlestick', candlestickSpec);
    this.specPresets.set('concat', concatenateSpec);
    this.specPresets.set('stackedBC', stackedBarchartPreset);
    this.specPresets.set('parallelCoords', parallelCoordinatesPreset);
    this.specPresets.set('repeatOverlay', repeatOverlayPreset);
    this.specPresets.set('mosaic', mosaicPreset);
    this.specPresets.set('streamGraph', streamGraphPreset);
    this.specPresets.set('stackedArea', stackedAreaPreset);
    this.specPresets.set('CO2', carbonDioxide);
  }

  private addTemplateFromSpec(spec: BaseSpec) {
    const parsedTemplate = this.specParser.parse(spec);
    this.props.addTemplates(parsedTemplate.getFlatHierarchy());
  }

  private onPlumbingToggleClicked(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.togglePlumbingVisible(event.target.checked);
  }

  private renderPresetSpec(label: string) {
    return (
      <button key={ label } onClick={ () => this.addTemplateFromSpec(this.specPresets.get(label)) }>{ label }</button>
    );
  }

  private renderPresetSpecs(): JSX.Element[] {
    const specs: JSX.Element[] = [];

    this.specPresets.forEach((preset, key) => {
      specs.push(this.renderPresetSpec(key));
    });

    return specs;
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
          { this.renderPresetSpecs() }
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
    // this.addTemplateFromSpec(this.specPresets.get('concat'));
  }
}