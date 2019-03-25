import * as React from 'react';
import { Data } from 'vega-lite/build/src/data';

import VegaRenderer from '../../Model/Renderer/VegaRenderer';
import SpecCompiler from '../TemplateModel/SpecCompiler';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMarkTemplate';

import './TemplatePreview.css';
import { parallelCoordinatesPreset } from '../Toolbar/SpecPresets';

interface Props {
  template: Template
}
interface State {

}

export default class TemplatePreview extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();
  }

  private renderVegaPreview() {
    const template = this.props.template;
    let spec = this.specCompiler.getVegaSpecification(template);

    if (template instanceof VisualMarkTemplate) {
      const dummyData: Data = {
        values: [
          {a: 0, b: 0, c: 'x'},
          {a: 1, b: 2, c: 'y'},
          {a: 2, b: 1, c: 'z'},
        ]
      },
      spec = this.specCompiler.getBasicSchema();
      spec.data = dummyData;
      spec.mark = template.type;
      spec.encoding = {
        x: { field: 'a', type: 'quantitative', axis: { labels: false, title: null, domain: false, range: false, ticks: false, grid: false } },
        y: { field: 'b', type: 'quantitative', axis: { labels: false, title: null, domain: false, range: false, ticks: false, grid: false } },
        text: { field: 'c', type: 'nominal' },
      };

      template.encodings.forEach((value, key) => {
        if (value === null || value === undefined) {
          return;
        }
        spec.encoding[key] = value;
        spec.encoding[key].axis
      });

    } else if (spec === null) {
      spec = {} as any;
    }

    return (
      <VegaRenderer
        id={ `renderer${this.props.template.id}` }
        showExportOptions={ false }
        width={ 50 }
        height={ 50 }
        schema={ spec }
      />
    );
  }

  public render() {
    return (
      <div className="preview">
        { this.renderVegaPreview() }
      </div>
    );
  }
}