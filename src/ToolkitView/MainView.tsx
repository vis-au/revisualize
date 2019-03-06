import * as React from 'react';

import './MainView.css';

interface Props {
  height: number;
}

export default class MainView extends React.Component<Props, {}> {
  public render() {
    return (
      <article id="mainViews" style={{ height: this.props.height }}>
        { this.props.children }
      </article>
    );
  }
}