import * as React from 'react';
import Sidebar from '../Widgets/Sidebar';

import './DataflowSidebar.css';

interface Props {
}
interface State {
}

export default class DataflowSidebar extends React.Component<Props, State> {
  public render() {
    return (
      <Sidebar
        id="templateDataflowSidebar"
        height={ window.innerHeight - 10 }
        width={ window.innerWidth - 75 }
        hidden={ false }
        positionLeft={ true }>

        { this.props.children }
      </Sidebar>
    );
  }
}