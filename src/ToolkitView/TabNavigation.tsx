import * as React from 'react';

import Tab from './Tab';
import TabComponent from './TabComponent';

import './TabNavigation.css';

interface Props {
  getActiveTab: any;
  updateActiveTab: any;
  tabs: Tab[];
}

export default class TabNavigation extends React.Component<Props, {}> {

  private renderTab(tab: Tab) {
    return (
      <TabComponent
        key={ tab.name }
        tab={ tab }
        getActiveTab={ this.props.getActiveTab }
        onClick={ () => this.props.updateActiveTab(tab) }
      />
    );
  }

  private renderTabs() {
    return this.props.tabs.map(this.renderTab.bind(this));
  }

  public render() {
    return (
      <nav id="tabNavigation">
        <h1>Toolkit</h1>
        <div id="tabs">{ this.renderTabs() }</div>
      </nav>
    );
  }
}