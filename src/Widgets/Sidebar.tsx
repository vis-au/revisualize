import * as React from 'react';

import './Sidebar.css';

interface Props {
  id: string;
  hidden: boolean;
  height?: number;
  positionLeft?: boolean;
}
interface State {
  hidden: boolean;
}

export default class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hidden: false
    };
  }

  private toggleSidebar(event: MouseEvent) {
    this.setState({ hidden: !this.state.hidden });
    event.stopPropagation();
  }

  private getSidebarClassName() {
    const position = this.props.positionLeft ? 'left' : 'right';

    // hidden by the toggle button
    const isMinimized = this.state.hidden ? 'hidden' : '';
    // hidden by the parent component, because nothing is displayed
    const isHidden = this.props.hidden ? 'hidden' : '';

    return `sidebar ${position} ${isHidden} ${isMinimized}`;
  }

  private getButtonDirection() {
    const direction = this.state.hidden || this.props.hidden ? 'right' : 'left';
    return `${direction}`;
  }

  public render() {
    return (
      <div
        id={ this.props.id }
        className={ this.getSidebarClassName() }
        style={ { height: this.props.height } }>
        <div className="sidebarBody">
          { this.props.children }
        </div>
        <div
          className={ `toggleButtonWrapper ${this.props.hidden ? 'disabled' : ''}` }
          onClick={ this.toggleSidebar.bind(this) }>
          <button className={ 'show ' + this.getButtonDirection() }>

            ^
          </button>
        </div>
      </div>
    );
  }
}