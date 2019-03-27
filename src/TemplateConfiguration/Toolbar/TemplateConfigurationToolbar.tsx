import * as React from 'react';

import Toolbar from '../../Widgets/Toolbar';
import LayerTemplate from '../TemplateModel/LayerTemplate';
import PlotTemplate from '../TemplateModel/PlotTemplate';
import RepeatTemplate from '../TemplateModel/RepeatTemplate';
import SpecDecompiler from '../TemplateModel/SpecDecompiler';
import Template from '../TemplateModel/Template';
import { barchartSpec, candlestickSpec, carbonDioxide, concatenateSpec, mosaicPreset, parallelCoordinatesPreset, populationLayerChart, repeatOverlayPreset, scatterplotMatrixSpec, stackedAreaPreset, stackedBarchartPreset, streamGraphPreset } from './SpecPresets';

import { BaseSpec } from 'vega-lite/build/src/spec';
import './TemplateConfigurationToolbar.css';
import VegaJSONInput from './VegaJSONInput';

interface Props {
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  private specPresets: Map<string, any>;

  constructor(props: Props) {
    super(props);

    this.addTemplateFromSpec = this.addTemplateFromSpec.bind(this);

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
    const decompiler = new SpecDecompiler();

    const decompilation = decompiler.decompile(spec);
    this.props.addTemplates(decompilation.getFlatHierarchy());
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

  public render() {
    return (
      <Toolbar id="templateToolbar">
        <div className="column" id="templateImport">
          <h2>Import</h2>
          { this.renderPresetSpecs() }
        </div>
        <div className="column">
          <h2>JSON</h2>
          <VegaJSONInput loadSpec={ this.addTemplateFromSpec } />
        </div>
      </Toolbar>
    );
  }

  public componentDidMount() {
    // this.addTemplateFromSpec(this.specPresets.get('concat'));
  }
}