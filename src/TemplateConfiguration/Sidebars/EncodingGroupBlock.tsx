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
}

export default class EncodingGroupBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

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
      emptyEncoding: null
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
      <li className="unsetEncoding">
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
      .filter(encoding => this.props.template.getEncodedValue(encoding) === null);

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
        <input type="text" value={ 'test' } onBlur={ this.hideEncodingInput }></input>
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