import * as React from 'react';
import { Mark } from 'vega-lite/build/src/mark';

import Toolbar from '../../Widgets/Toolbar';
import SpecDecompiler from '../TemplateModel/SpecDecompiler';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMarkTemplate';
import PlotTemplate from '../TemplateModel/PlotTemplate';
import { populationLayerChart, barchartSpec, scatterplotMatrixSpec, candlestickSpec, concatenateSpec, stackedBarchartPreset, parallelCoordinatesPreset } from './SpecPresets';
import RepeatTemplate from '../TemplateModel/RepeatTemplate';
import LayerTemplate from '../TemplateModel/LayerTemplate';

import './TemplateConfigurationToolbar.css';

interface Props {
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
}

const dummyData = {
  'values': [
    {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
    {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
    {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
  ]
};


function getScatterplotMatrixPreset(): Template {
  const compositionTemplate = new RepeatTemplate([]);
  compositionTemplate.data = dummyData;
  compositionTemplate.repeat = {
    column: ['a', 'c'],
    row: ['a', 'c'],
  };

  const plotTemplate = new PlotTemplate('histogram', null, compositionTemplate);
  plotTemplate.setEncodedValue('x', {'field': 'a', 'type': 'ordinal'});
  plotTemplate.setEncodedValue('y', {'field': 'b', 'type': 'quantitative'});

  const atomicTemplate = new VisualMarkTemplate('circle', plotTemplate);

  compositionTemplate.visualElements.push(plotTemplate);
  plotTemplate.visualElements.push(atomicTemplate);

  return compositionTemplate;
}

function getLineChartPreset(): Template {
  const compositionTemplate = new LayerTemplate([]);
  compositionTemplate.data = dummyData;

  const plotTemplate = new PlotTemplate('histogram', null, compositionTemplate);
  plotTemplate.setEncodedValue('x', {'field': 'a', 'type': 'ordinal'});
  plotTemplate.setEncodedValue('y', {'field': 'b', 'type': 'quantitative'});

  const plotTemplate2 = new PlotTemplate('histogram', null, compositionTemplate);
  plotTemplate2.setEncodedValue('x', {'field': 'a', 'type': 'ordinal'});
  plotTemplate2.setEncodedValue('y', {'field': 'b', 'type': 'quantitative'});

  const atomicTemplate = new VisualMarkTemplate('point', plotTemplate);
  const atomicTemplate2 = new VisualMarkTemplate('line', plotTemplate2);

  compositionTemplate.visualElements.push(plotTemplate, plotTemplate2);
  plotTemplate.visualElements = [atomicTemplate];
  plotTemplate2.visualElements = [atomicTemplate2];

  return compositionTemplate;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  private templatePresets: Map<string, () => Template>;
  private specPresets: Map<string, any>;

  constructor(props: Props) {
    super(props);

    this.onMarkClicked = this.onMarkClicked.bind(this);
    this.addTemplateFromSpec = this.addTemplateFromSpec.bind(this);

    this.templatePresets = new Map();
    this.templatePresets.set('Scatterplot Matrix', getScatterplotMatrixPreset);
    this.templatePresets.set('Line Chart', getLineChartPreset);

    this.specPresets = new Map();
    this.specPresets.set('population', populationLayerChart);
    this.specPresets.set('barchart', barchartSpec);
    this.specPresets.set('scattMatrx', scatterplotMatrixSpec);
    this.specPresets.set('candlestick', candlestickSpec);
    this.specPresets.set('concat', concatenateSpec);
    this.specPresets.set('stackedBC', stackedBarchartPreset);
    this.specPresets.set('parallelCoords', parallelCoordinatesPreset);
  }

  private addTemplateFromSpec(label: string) {
    const decompiler = new SpecDecompiler();

    const spec = this.specPresets.get(label);

    const decompilation = decompiler.decompile(spec);
    this.props.addTemplates(decompilation.getFlatHierarchy());
  }

  private onMarkClicked(mark: Mark) {
    const newVisualMark = new VisualMarkTemplate(mark, null);

    this.props.addTemplate(newVisualMark);
  }

  private onPresetClicked(id: string) {
    const presetCallback = this.templatePresets.get(id);

    if (presetCallback === undefined || presetCallback === null) {
      return;
    }

    const flatTemplateHierarchy = presetCallback().getFlatHierarchy();
    this.props.addTemplates(flatTemplateHierarchy);
  }

  private renderPresetTemplate(key: string) {
    return (
      <button key={ key } onClick={ () => this.onPresetClicked(key) }>{ key }</button>
    );
  }

  private renderPresetTemplates(): JSX.Element[] {
    const templates: JSX.Element[] = [];

    this.templatePresets.forEach((preset, key) => {
      templates.push(this.renderPresetTemplate(key));
    });

    return templates;
  }

  private renderPresetSpec(label: string) {
    return (
      <button key={ label } onClick={ () => this.addTemplateFromSpec(label) }>{ label }</button>
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
        <div id="templateImport">
          <h2>Import</h2>
          { this.renderPresetSpecs() }
        </div>
        <div id="templatePresets">
          <h2>Templates</h2>
          { this.renderPresetTemplates() }
        </div>
      </Toolbar>
    );
  }
}