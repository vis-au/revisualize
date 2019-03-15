import * as React from 'react';

import VisualMarkTemplate from './TemplateModel/VisualMark';

import './VisualElementMarkBlock.css';

interface Props {
  visualElement: VisualMarkTemplate;
}
interface State {

}

export default class VisualElementMarkBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div className="visualElement mark">{ this.props.visualElement.type }</div>
    );
  }
}