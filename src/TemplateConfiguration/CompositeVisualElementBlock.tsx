import * as React from 'react';

import CompositeTemplate from './TemplateModel/CompositeTemplate';
import VegaRenderer from '../Model/Renderer/VegaRenderer';
import SpecCompiler from './TemplateModel/SpecCompiler';

import './CompositeVisualElementBlock.css';

interface Props {
  visualElement: CompositeTemplate;
}
interface State {

}

export default class CompositeVisualElementBlock extends React.Component<Props, State> {
  private renderVisualElements() {
    if (this.props.visualElement instanceof CompositeTemplate) {
      return null;
    }

    const specCompiler = new SpecCompiler();
    const spec = specCompiler.getVegaSpecification(this.props.visualElement);

    console.log(spec)

    return (
      <VegaRenderer
        showExportOptions={ true }
        width={ 500 }
        height={ 300 }
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