import * as React from 'react';
import { Template } from 'toolkitmodel';

import './SizeConfiguration.css';

interface Props {
  template: Template;
  onTemplateChanged: () => void;
}
interface State {
  temporaryWidth: string;
  temporaryHeight: string;
}

export default class SizeConfiguration extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onWidthConfigChanged = this.onWidthConfigChanged.bind(this);
    this.onHeightConfigChanged = this.onHeightConfigChanged.bind(this);
    this.onSaveSizeConfigButtonClicked = this.onSaveSizeConfigButtonClicked.bind(this);

    this.state = {
      temporaryWidth: '',
      temporaryHeight: ''
    };
  }

  private onWidthConfigChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const width = event.target.value;
    this.setState({ temporaryWidth: width });
  }

  private onHeightConfigChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const height = event.target.value;
    this.setState({ temporaryHeight: height });
  }

  private onSaveSizeConfigButtonClicked() {
    this.props.template.width = parseInt(this.state.temporaryWidth, 10);
    this.props.template.height = parseInt(this.state.temporaryHeight, 10);
    this.props.onTemplateChanged();
  }

  public render() {
    return (
      <div className="sizeConfiguration">
        <div className="row">
          <label htmlFor="widthConfig" className="config">width</label>
          <input
            type="text"
            name="widthConfig"
            id="widthConfig"
            value={ this.state.temporaryWidth }
            onChange={ this.onWidthConfigChanged }
          />
        </div>

        <div className="row">
          <label htmlFor="heightConfig" className="config">height</label>
          <input
            type="text"
            name="heightConfig"
            id="heightConfig"
            value={ this.state.temporaryHeight }
            onChange={ this.onHeightConfigChanged }
          />
        </div>

        <button className="saveSizeConfig" onClick={ this.onSaveSizeConfigButtonClicked }>save</button>
      </div>
    );
  }

  public componentDidUpdate(oldProps: Props) {
    if (!this.props.template) {
      return;
    }

    if (oldProps.template !== this.props.template) {
      let newWidth = '';
      let newHeight = '';

      if (!!this.props.template.width) {
        newWidth = `${this.props.template.width}`;
      }
      if (!!this.props.template.height) {
        newHeight = `${this.props.template.height}`;
      }

      this.setState({
        temporaryHeight: newHeight,
        temporaryWidth: newWidth
      });
    }
  }
}