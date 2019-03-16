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
      <div className="layout">{ this.props.layout.type }</div>
    );
  }
}