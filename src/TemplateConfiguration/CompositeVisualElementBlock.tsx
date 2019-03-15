import * as React from 'react';

import CompositeTemplate from './TemplateModel/CompositeTemplate';

import './VisualElementBlock.css';

interface Props {
  visualElement: CompositeTemplate;
}
interface State {

}

export default class CompositeVisualElementBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div className="composite visualElement"></div>
    );
  }
}