import * as React from 'react';
import { SpecParser, Template } from 'remodel-vis';

import './VegaInputOverlay.css';

interface Props {
  hidden: boolean,
  addTemplates: (templates: Template[]) => void,
  hide: () => void
}
interface State {
  currentInput: string;
  message: string;
  inputValid: boolean;
}

export default class VegaInputOverlay extends React.Component<Props, State> {
  private schemaParser: SpecParser;

  constructor(props: Props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.loadInputIntoApp = this.loadInputIntoApp.bind(this);

    this.schemaParser = new SpecParser();

    this.state = {
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

  private loadInputIntoApp() {
    let inputAsSpec: any;

    try {
      inputAsSpec = JSON.parse(this.state.currentInput);
    } catch(e) {
      this.setState({
        message: e.message,
        inputValid: false
      });

      return;
    }

    const parsedTemplate = this.schemaParser.parse(inputAsSpec);
    this.props.addTemplates(parsedTemplate.getFlatHierarchy());
    this.props.hide();

    this.setState({
      currentInput: ''
    });
  }

  private renderLoadingWidgets() {
    return (
      <div className="loadingWidgets">
        <button className="load" onClick={ this.loadInputIntoApp }>Load</button>
      </div>
    );
  }

  private renderTextArea() {
    const isHidden = this.props.hidden ? 'hidden' : '';

    return (
      <div className={ `overlayWrapper ${isHidden}` } onClick={ this.props.hide }>
        <div className="inputWrapper" onClick={ (e: any) => e.stopPropagation() }>
          <div className="row">
            <h2>Enter Custom Vega-lite JSON</h2>
            <button onClick={ this.props.hide } className="delete"></button>
          </div>
          <span className="notice">
            When copying example specs from <a target="_blank" rel="noopener noreferrer" href="https://vega.github.io/vega-lite/examples/">the Vega Example page<i className="material-icons icon">open_in_new</i></a>, make sure to point any data urls to "https://vega.github.io/editor/[PATH]", where [PATH] needs to be replaced with the original url.</span>
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
        { this.renderTextArea() }
      </div>
    );
  }
}