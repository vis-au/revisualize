import * as React from 'react';

import VegaRenderer from '../Model/Renderer/VegaRenderer';
import Layout from './TemplateModel/Layout';
import SpecCompiler from './TemplateModel/SpecCompiler';
import Template from './TemplateModel/Template';

import './CompositeVisualElementBlock.css';

interface Props {
  templates: Template[];
  layout: Layout;
}
interface State {

}

export default class CompositeVisualElementBlock extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();
  }

  private renderVisualElements() {
    const spec = this.specCompiler.getVegaSpecification(this.props.templates, this.props.layout);

    return (
      <VegaRenderer
        id={ this.props.templates.map(t => t.id).join('_') }
        showExportOptions={ true }
        width={ 125 }
        height={ 100 }
        schema={ spec }
      />
    );
  }

  public render() {
    return (
      <div className="composite visualElement">
        { this.renderVisualElements() }
      </div>
    );
  }
}