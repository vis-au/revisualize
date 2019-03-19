import * as React from 'react';

import VisualMarkTemplate from './TemplateModel/VisualMark';
import Template from './TemplateModel/Template';

import './VisualElementBlock.css';

interface Props {
  visualElement: Template;
}
interface State {

}

export default class VisualElementBlock extends React.Component<Props, State> {
  public render() {
    if (this.props.visualElement instanceof VisualMarkTemplate) {
      return (
        <div
          title={ this.props.visualElement.type }
          className="visualElement mark">
          { this.props.visualElement.type }
        </div>
      );
    } else {
      return (
        <div
          title={ 'composite template' }
          className="visualElement composite">
          { 'compo' }
        </div>
      );
    }
  }
}