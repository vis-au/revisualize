import * as React from 'react';

import Layout from './TemplateModel/Layout';

import './LayoutBlock.css';

interface Props {
  layout: Layout
}
interface State {

}

export default class LayoutBlock extends React.Component<Props, State> {
  private getClassName() {
    const isNull = this.props.layout === null ? 'null' : '';

    return `layout ${isNull}`;
  }

  public render() {
    return (
      <div className={ this.getClassName() }></div>
    );
  }
}