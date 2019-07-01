import * as React from 'react';
import { SpecCompiler, Template } from 'remodel-vis';

import VegaRenderer from '../../Widgets/Renderer/VegaRenderer';

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

    const schema: any = this.specCompiler.getVegaSpecification(this.props.template, true, true);

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