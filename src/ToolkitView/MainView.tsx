import * as React from 'react';

import './MainView.css';

interface Props {
}

export default class MainView extends React.Component<Props, {}> {
  public render() {
    return (
      <article id="mainViews">
        { this.props.children }
      </article>
    );
  }
}