import * as React from 'react';
import Sidebar from '../../Widgets/Sidebar';

import './DataflowPanel.css';

interface Props {
  hidden: boolean;
  onToggle: () => void;
}
interface State {
}

export default class DataflowSidepanel extends React.Component<Props, State> {
  public render() {
    return (
      <Sidebar
        id="templateDataflowSidebar"
        height={ window.innerHeight - 10 }
        width={ window.innerWidth - 75 }
        hidden={ this.props.hidden }
        positionLeft={ true }
        toggle={ this.props.onToggle }>

        { this.props.children }
      </Sidebar>
    );
  }
}