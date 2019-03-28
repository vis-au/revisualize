import * as React from 'react';
import VegaRenderer from '../../Model/Renderer/VegaRenderer';
import SpecCompiler from '../TemplateModel/SpecCompiler';
import Template from '../TemplateModel/Template';
import './FullscreenTemplatePreview.css';

interface Props {
  template: Template;
  visible: boolean;
  toggle: (template: Template) => void;
}
interface State {
}

export default class FullscreenTemplatePreview extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();
  }

  private renderPreview() {
    if (!this.props.visible) {
      return null;
    }

    const schema: any = this.specCompiler.getVegaSpecification(this.props.template);

    return (
      <div className="fullscreenPreviewContainer">
        <VegaRenderer
          schema={ schema }
          width={ window.innerWidth - 200 }
          height={ window.innerHeight - 200 }
        />
      </div>
    );
  }

  public render() {
    const isHidden = this.props.visible ? '' : 'hidden';

    return (
      <div className={ `fullscreenPreviewOverlay ${isHidden}` }>
        { this.renderPreview() }
        <div className="delete" onClick={ () => this.props.toggle(null) }></div>
      </div>
    );
  }
}