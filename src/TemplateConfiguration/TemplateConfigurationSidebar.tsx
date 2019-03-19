import * as React from 'react';
import Sidebar from '../Widgets/Sidebar';

import './TemplateConfigurationSidebar.css';

interface Props {
}
interface State {
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  public render() {
    return (
      <Sidebar
        id="templateConfigurationSidebar"
        height={ window.innerHeight - 75 }
        hidden={ true }
        positionLeft={ false }
      />
    );
  }
}