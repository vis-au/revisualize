import * as React from 'react';
import { Mark } from 'vega-lite/build/src/mark';

import Toolbar from '../../Widgets/Toolbar';
import SpecDecompiler from '../TemplateModel/SpecDecompiler';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMark';
import CompositionTemplate from '../TemplateModel/CompositionTemplate';
import PlotTemplate from '../TemplateModel/PlotTemplate';

import './TemplateConfigurationToolbar.css';

interface Props {
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
}

function getScatterplotMatrixPreset(): Template {
  const compositionTemplate = new CompositionTemplate('repeat', [], null);
  const plotTemplate = new PlotTemplate('histogram', null, compositionTemplate);
  plotTemplate.setEncodedValue('x', {'field': 'a', 'type': 'ordinal'});
  plotTemplate.setEncodedValue('y', {'field': 'b', 'type': 'quantitative'});

  const atomicTemplate = new VisualMarkTemplate('circle', plotTemplate);

  compositionTemplate.visualElements.push(plotTemplate);
  plotTemplate.visualElements.push(atomicTemplate);

  return compositionTemplate;
}

function getLineChartPreset(): Template {
  const compositionTemplate = new CompositionTemplate('overlay', [], null);

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

  constructor(props: Props) {
    super(props);

    this.onMarkClicked = this.onMarkClicked.bind(this);
    this.addTemplateFromSpec = this.addTemplateFromSpec.bind(this);

    this.templatePresets = new Map();
    this.templatePresets.set('Scatterplot Matrix', getScatterplotMatrixPreset);
    this.templatePresets.set('Line Chart', getLineChartPreset);
  }

  private addTemplateFromSpec() {
    const decompiler = new SpecDecompiler();

    const spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'values': [
          {'a': 'A','b': 28}, {'a': 'B','b': 55}, {'a': 'C','b': 43},
          {'a': 'D','b': 91}, {'a': 'E','b': 81}, {'a': 'F','b': 53},
          {'a': 'G','b': 19}, {'a': 'H','b': 87}, {'a': 'I','b': 52}
        ]
      },
      'mark': 'bar',
      'encoding': {
        'x': {'field': 'a', 'type': 'ordinal'},
        'y': {'field': 'b', 'type': 'quantitative'}
      }
    };

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

  public render() {
    return (
      <Toolbar id="templateToolbar">
        <div id="templateImport">
          <h2>Import</h2>
          <button onClick={ this.addTemplateFromSpec }>Spec disk</button>
        </div>
        <div id="templatePresets">
          <h2>Templates</h2>
          { this.renderPresetTemplates() }
        </div>
      </Toolbar>
    );
  }
}