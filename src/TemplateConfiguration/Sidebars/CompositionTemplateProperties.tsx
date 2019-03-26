import * as React from 'react';
import Template from '../TemplateModel/Template';

interface Props {
  template: Template;
  onTemplateChanged: () => void;
}
interface State {
}

export default class CompositionTemplateProperties extends React.Component<Props, State> {
  public render() {
    return (
      <div className="compositionTemplateProperties"></div>
    );
  }
}