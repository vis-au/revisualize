import * as React from 'react';
import { NewSignal as Signal } from 'vega';

import Sidebar from '../../Widgets/Sidebar';

import './SignalsSidebar.css';

export const SIGNAL_PROPERTIES = ['bind', 'description', 'on', 'update', 'react', 'value'];

interface SidebarProps {
  selectedSignal: Signal;
  updateSignal: (newSignal: Signal) => void;
}
interface SidebarState {
  focusedProperty: string;
}

export default class SignalsSidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);

    this.state = {
      focusedProperty: null
    };
  }

  private focusProperty(property: string) {
    if (property === this.state.focusedProperty) {
      this.setState({ focusedProperty: null });
    } else {
      this.setState({ focusedProperty: property });
    }
  }

  private modifyProperty(event: any) {
    if (event.key === 'Enter' && event.type === 'click' && event.type === 'blur') {
      // this.state.focusedProperty
      this.setState({
        focusedProperty: null
      });

      return;
    }

    const property = this.state.focusedProperty;
    const selectedSignal = this.props.selectedSignal;

    selectedSignal.value = event.target.value;

    this.props.updateSignal(selectedSignal);
  }

  private renderBody() {
    if (this.props.selectedSignal === null) { return; }

    return (
      <div id="signalsSidebarBody">
        <ul id="signalsSidebarPropertyList">
          <li key={ 'value' } className="property">
            <span
              className="key"
              onClick={ () => this.focusProperty('value') }>

              { 'value' }
            </span>
            <span
              className={ this.state.focusedProperty === 'value' ? 'value hidden' : 'value' }>

              { this.props.selectedSignal.value }
            </span>
            <input
              className={ this.state.focusedProperty === 'value' ? 'value' : 'value hidden' }
              type="text"
              // defaultValue={ this.props.selectedSignal.value }
              value={ this.props.selectedSignal.value }
              onChange={ this.modifyProperty.bind(this) }
              onKeyPress={ this.modifyProperty.bind(this) }
            />
          </li>
        </ul>
      </div>
    );
  }

  public render() {
    const name = this.props.selectedSignal === null ? '' : this.props.selectedSignal.name;

    return (
      <Sidebar hidden={ this.props.selectedSignal === null } id="signalsSidebar">
        <h2 id="signalsSidebarHeader">{ name }</h2>
        { this.renderBody() }
      </Sidebar>
    );
  }
}