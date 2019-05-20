import * as React from 'react';

import Toolbar from '../../Widgets/Toolbar';

  import './TemplateConfigurationToolbar.css';

interface Props {
  plumbingVisible: boolean;
  togglePlumbingVisible: (visible?: boolean) => void;
  toggleExampleOverlayVisible: (visible?: boolean) => void;
  toggleVegaLiteInput: (visible?: boolean) => void;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.onPlumbingToggleClicked = this.onPlumbingToggleClicked.bind(this);
    this.onExampleToggleClicked = this.onExampleToggleClicked.bind(this);
    this.onVegaLiteInputToggleClicked = this.onVegaLiteInputToggleClicked.bind(this);
  }

  private onPlumbingToggleClicked(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.togglePlumbingVisible(event.target.checked);
  }

  private onExampleToggleClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.props.toggleExampleOverlayVisible();
  }

  private onVegaLiteInputToggleClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.props.toggleVegaLiteInput();
  }

  private renderPlumbingToggle() {
    return (
      <div className="plumbingToggleContainer">
        <input
          type="checkbox"
          id="plumbingToggle"
          checked={ this.props.plumbingVisible }
          onChange={ this.onPlumbingToggleClicked } />
        <label htmlFor="plumbingToggle">Show Connections</label>
      </div>
    );
  }

  public render() {
    return (
      <Toolbar id="templateToolbar">
        <div className="column logo">
          <h2>ReVis</h2>
        </div>
        <div className="column" id="templateImport">
          <button className="toggleExampleOverlay" onClick={ this.onExampleToggleClicked }>
            Examples
          </button>
          <button className="toggleExampleOverlay" onClick={ this.onVegaLiteInputToggleClicked }>
            Vega-Lite
          </button>
          { this.renderPlumbingToggle() }
        </div>
      </Toolbar>
    );
  }
}