import * as React from 'react';

import './IconButton.css';

interface Props {
  icon: string;
  onClick: (event: any) => void;
}

export default class IconButton extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="iconButton">
        <i className="material-icons">{ this.props.icon }</i>
        { this.props.children }
      </div>
    );
  }
}