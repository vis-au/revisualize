import * as React from 'react';

import VegaRenderer from '../Model/Renderer/VegaRenderer';
import Layout from './TemplateModel/Layout';
import SpecCompiler from './TemplateModel/SpecCompiler';
import Template from './TemplateModel/Template';

import './TemplatePreview.css';

interface Props {
  templates: Template[];
  layout: Layout;
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
    let spec = this.specCompiler.getVegaSpecification(this.props.templates, this.props.layout);

    if (spec === null) {
      spec = {} as any;
    }

    return (
      <VegaRenderer
        id={ this.props.templates.map(t => t.id).join('_') }
        showExportOptions={ true }
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