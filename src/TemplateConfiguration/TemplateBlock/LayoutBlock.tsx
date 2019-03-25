import * as React from 'react';

import { LayoutType } from '../TemplateModel/LayoutType';

import './LayoutBlock.css';

interface Props {
  layout: LayoutType;
  minimized: boolean;
}
interface State {

}

export default class LayoutBlock extends React.Component<Props, State> {
  public render() {
    return (
      <div
        title={ this.props.layout === null ? 'no layout' : this.props.layout }
        className={ `layout ${this.props.layout === null ? 'null' : ''}`}>
        { this.props.layout === null ? 'X' : this.props.layout }
      </div>
    );
  }
}