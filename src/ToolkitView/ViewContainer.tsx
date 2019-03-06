import * as React from 'react';

interface Props {
  id: string;
  name: string;
  className?: string;
  activeContainerName: string;
}

export default class ViewContainer extends React.Component<Props, {}> {
  private getClassName() {
    const isActive = this.props.name === this.props.activeContainerName;

    return `${this.props.className} view ${isActive ? 'active' : ''}`;
  }

  public render() {
    return (
      <div id={ this.props.id } className={ this.getClassName() }>
        { this.props.children }
      </div>
    );
  }
}