import * as React from 'react';
import Sidebar from '../../Widgets/Sidebar';

import './TemplateConfigurationSidebar.css';

interface Props {
}
interface State {
  hidden: boolean;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);

    this.state = { hidden: true };
  }

  onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  public render() {
    return (
      <Sidebar
        id="templateConfigurationSidebar"
        height={ window.innerHeight - 75 }
        hidden={ this.state.hidden }
        positionLeft={ false }
        toggle={ this.onToggle }
      />
    );
  }
}