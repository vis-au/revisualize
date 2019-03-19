import * as React from 'react';

import VegaRenderer from '../Model/Renderer/VegaRenderer';
import SpecCompiler from './TemplateModel/SpecCompiler';
import Template from './TemplateModel/Template';
import VisualMarkTemplate from './TemplateModel/VisualMark';

import './TemplatePreview.css';

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
    let spec: any = this.specCompiler.getVegaSpecification(template.visualElements, template.layout);

    if (template instanceof VisualMarkTemplate) {
      spec = this.specCompiler.getBasicSchema() as any;
      spec.mark = template.type;
    } else if (spec === null) {
      spec = {} as any;
    }

    return (
      <VegaRenderer
        id={ template.visualElements.map(t => t.id).join('_') }
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