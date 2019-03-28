import * as React from 'react';
import { BaseSpec } from 'vega-lite/build/src/spec';

import './VegaJSONInput.css';

interface Props {
  loadSpec: (spec: BaseSpec) => void
}
interface State {
  hidden: boolean,
  currentInput: string;
  message: string;
  inputValid: boolean;
}

export default class VegaJSONInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.loadInputIntoApp = this.loadInputIntoApp.bind(this);

    this.state = {
      hidden: true,
      currentInput: '',
      message: null,
      inputValid: null
    };
  }

  private onInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      currentInput: event.target.value,
      message: null,
      inputValid: null
    });
  }

  private toggleHidden() {
    this.setState({
      hidden: !this.state.hidden
    });
  }

  private loadInputIntoApp() {
    let inputAsSpec: any;

    try {
      inputAsSpec = JSON.parse(this.state.currentInput);
    } catch(e) {
      this.setState({
        message: e.message,
        inputValid: false,
        currentInput: ''
      });

      return;
    }

    this.props.loadSpec(inputAsSpec)
    this.setState({ hidden: true });
  }

  private renderInlineToggleButton() {
    return (
      <button className="toggleInputVisible" onClick={ this.toggleHidden }>toggle</button>
    );
  }

  private renderLoadingWidgets() {
    return (
      <div className="loadingWidgets">
        <button className="load" onClick={ this.loadInputIntoApp }>Load</button>
      </div>
    );
  }

  private renderTextArea() {
    const isHidden = this.state.hidden ? 'hidden' : '';

    return (
      <div className={ `overlayWrapper ${isHidden}` }>
        <div className="inputWrapper">
          <div className="row">
            <h2>Enter Custom Vega-lite JSON</h2>
            <button onClick={ () => this.setState({ hidden: true })} className="delete"></button>
          </div>
          <span className="notice">When copying example specs from vega.github.io, make sure to point any data urls to "https://vega.github.io/editor/[PATH]", where [PATH] needs to be replaced with the original url.</span>
          <textarea value={ this.state.currentInput } onChange={ this.onInputChange }></textarea>
          <span className="message">{ this.state.message }</span>
          { this.renderLoadingWidgets() }
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className="vegaJSONinput">
        { this.renderInlineToggleButton() }
        { this.renderTextArea() }
      </div>
    );
  }
}