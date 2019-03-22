import * as React from 'react';

import { facetChannelEncodings, geographicPositionEncodings, hyperLinkChannelEncodings, keyChannelEncodings, loDChannelEncodings, MarkEncoding, MarkEncodingGroup, markPropertiesChannelEncodings, orderChannelEncodings, positionEncodings, textTooltipChannelEncodings } from '../TemplateModel/MarkEncoding';
import Template from '../TemplateModel/Template';

import './EncodingGroupBlock.css';

interface Props {
  template: Template;
  groupType: MarkEncodingGroup;
  onTemplateChanged: () => void;
}
interface State {
  areEncodingsHidden: boolean;
  emptyEncoding: MarkEncoding;
  temporaryValue: any;
}

export default class EncodingGroupBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onEncodingChange = this.onEncodingChange.bind(this);
    this.onEncodingKeyPress = this.onEncodingKeyPress.bind(this);
    this.getEncodingsForGroup = this.getEncodingsForGroup.bind(this);
    this.showEncodingInput = this.showEncodingInput.bind(this);
    this.hideEncodingInput = this.hideEncodingInput.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderAddEncodingWidget = this.renderAddEncodingWidget.bind(this);
    this.renderUnsetEncodings = this.renderUnsetEncodings.bind(this);
    this.renderUnsetEncoding = this.renderUnsetEncoding.bind(this);
    this.toggleEncodingsHidden = this.toggleEncodingsHidden.bind(this);

    this.state = {
      areEncodingsHidden: true,
      emptyEncoding: null,
      temporaryValue: ''
    };
  }

  private getEncodingsForGroup(): MarkEncoding[] {
    let encodings: MarkEncoding[] = [];

    if (this.props.groupType === 'position') {
      encodings = positionEncodings;
    } else if (this.props.groupType === 'geographic') {
      encodings = geographicPositionEncodings;
    } else if (this.props.groupType === 'mark property') {
      encodings = markPropertiesChannelEncodings;
    } else if (this.props.groupType === 'text tooltip') {
      encodings = textTooltipChannelEncodings;
    } else if (this.props.groupType === 'hyperlink') {
      encodings = hyperLinkChannelEncodings;
    } else if (this.props.groupType === 'key channel') {
      encodings = keyChannelEncodings;
    } else if (this.props.groupType === 'order channel') {
      encodings = orderChannelEncodings;
    } else if (this.props.groupType === 'lod channel') {
      encodings = loDChannelEncodings;
    } else if (this.props.groupType === 'facet channel') {
      encodings = facetChannelEncodings;
    }

    return encodings;
  }

  private toggleEncodingsHidden() {
    this.setState({ areEncodingsHidden: !this.state.areEncodingsHidden });
  }

  private showEncodingInput(newEncoding: MarkEncoding) {
    this.setState({
      emptyEncoding: newEncoding
    });
  }

  private hideEncodingInput() {
    this.setState({ emptyEncoding: null });
  }

  private onEncodingChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      temporaryValue: event.target.value
    });
  }

  private onEncodingKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    this.props.template.setEncodedValue(this.state.emptyEncoding, this.state.temporaryValue);

    this.setState({
      emptyEncoding: null,
      temporaryValue: ''
    });

    this.props.onTemplateChanged();
  }

  private renderEncoding(encoding: MarkEncoding) {
    const value = this.props.template.getEncodedValue(encoding);

    if (value === undefined || value === null) {
      return null;
    }

    return (
      <div key={ encoding } className="encoding">
        <span>{ encoding }</span>
        <span>{ JSON.stringify(value) }</span>
      </div>
    );
  }

  private renderEncodings() {
    const encodings = this.getEncodingsForGroup();
    return (
      <div className="encoding">
        { encodings.map(this.renderEncoding) }
      </div>
    );
  }

  private renderUnsetEncoding(unsetEncoding: MarkEncoding) {
    return (
      <li key={ `unset${unsetEncoding}` } className="unsetEncoding">
        <button onClick={ () => this.showEncodingInput(unsetEncoding) }>
          { unsetEncoding }
        </button>
      </li>
    );
  }

  private renderUnsetEncodings() {
    if (this.state.areEncodingsHidden) {
      return null;
    }

    const unsetEncodings = this.getEncodingsForGroup()
      .filter(encoding => {
        const value = this.props.template.getEncodedValue(encoding);
        return value === null || value === undefined;
      });

    return (
      <ul className="encodings">
        { unsetEncodings.map(this.renderUnsetEncoding) }
      </ul>
    );
  }

  private renderEmptyEncoding() {
    if (this.state.emptyEncoding === null) {
      return false;
    }

    return (
      <div className="newEncoding">
        <input
          type="text"
          value={ this.state.temporaryValue || '' }
          onChange={ this.onEncodingChange }
          onKeyPress={ this.onEncodingKeyPress }
          onBlur={ this.hideEncodingInput } />
      </div>
    );
  }

  private renderAddEncodingWidget() {
    return (
      <div className="addEncodingWidget">
        <button onClick={ this.toggleEncodingsHidden }>add new ...</button>
        { this.renderUnsetEncodings() }
      </div>
    );
  }

  public render() {
    return (
      <div className="encodingGroup">
        <h2>{ this.props.groupType }</h2>
        { this.renderEncodings() }
        { this.renderEmptyEncoding() }
        { this.renderAddEncodingWidget() }
      </div>
    );
  }
}