import * as React from 'react';

import Tab from './Tab';

import './TabComponent.css';

interface Props {
  onClick: any;
  getActiveTab: any;
  tab: Tab;
}


export default class TabComponent extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private onClick() {
    this.props.onClick();
  }

  public render() {
    return (
      <div
        className={ this.props.getActiveTab() === this.props.tab ? 'active tab' : 'tab' }
        onClick={ this.onClick.bind(this) }
      >
        <h2>{ this.props.tab.name }</h2>
      </div>
    );
  }
}