import * as React from 'react';

import Layout from './TemplateModel/Layout';

import './LayoutBlock.css';

interface Props {
  layout: Layout
}
interface State {

}

export default class LayoutBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div
        title={ this.props.layout === null ? 'no layout' : this.props.layout.type }
        className={ `layout ${this.props.layout === null ? 'null' : ''}`}>
        { this.props.layout === null ? 'X' : this.props.layout.type }
      </div>
    );
  }
}