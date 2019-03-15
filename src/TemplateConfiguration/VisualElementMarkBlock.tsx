import * as React from 'react';

import VisualMark from './TemplateModel/VisualMark';

import './VisualElementBlock.css';

interface Props {
  visualElement: VisualMark;
}
interface State {

}

export default class VisualElementMarkBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div className="visualElement mark"></div>
    );
  }
}