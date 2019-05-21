import * as React from 'react';
import { Template } from 'toolkitmodel';

import './VisualElementBlock.css';

interface Props {
  visualElement: Template;
  minimized: boolean;
}
interface State {

}

export default class VisualElementBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div
        title={ 'composite template' }
        className="visualElement composite">

        Subview
      </div>
    );
  }
}