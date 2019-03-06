import * as React from 'react';

import './Toolbar.css';

interface Props {
  id: string;
}

export default class Toolbar extends React.Component<Props, {}> {
  public render() {
    return (
      <nav id={ this.props.id } className="toolbar">
        { this.props.children }
      </nav>
    );
  }
}