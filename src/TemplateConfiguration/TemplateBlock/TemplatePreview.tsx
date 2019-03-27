import * as React from 'react';

import VegaRenderer from '../../Model/Renderer/VegaRenderer';
import SpecCompiler from '../TemplateModel/SpecCompiler';
import Template from '../TemplateModel/Template';

import './TemplatePreview.css';

interface Props {
  template: Template,
  templateVersion: number,
  onRenderComplete: () => void
}
interface State {

}

export default class TemplatePreview extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;
  private templateVersion: number;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();

    this.templateVersion = this.props.templateVersion;
  }

  private renderVegaPreview() {
    const template = this.props.template;
    let spec = this.specCompiler.getVegaSpecification(template, true, true);

    if (spec === null) {
      spec = {} as any;
    }

    return (
      <VegaRenderer
        id={ `renderer${this.props.template.id}` }
        onRenderComplete={ this.props.onRenderComplete }
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

  public shouldComponentUpdate() {
    return this.props.templateVersion !== this.templateVersion;
  }

  public componentDidUpdate() {
    this.templateVersion = this.props.templateVersion;
  }
}