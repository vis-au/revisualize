import * as React from 'react';

import { facetChannelEncodings, geographicPositionEncodings, hyperLinkChannelEncodings, keyChannelEncodings, loDChannelEncodings, MarkEncoding, MarkEncodingGroup, markPropertiesChannelEncodings, orderChannelEncodings, positionEncodings, textTooltipChannelEncodings } from '../TemplateModel/MarkEncoding';
import VisualMarkTemplate from '../TemplateModel/VisualMark';

import './EncodingGroupBlock.css';

interface Props {
  template: VisualMarkTemplate;
  groupType: MarkEncodingGroup;
  onTemplateChanged: () => void;
}
interface State {
  areEncodingsHidden: boolean;
}

export default class EncodingGroupBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.getEncodingsForGroup = this.getEncodingsForGroup.bind(this);
    this.addNewEncodingToTemplate = this.addNewEncodingToTemplate.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderAddEncodingWidget = this.renderAddEncodingWidget.bind(this);
    this.renderUnsetEncodings = this.renderUnsetEncodings.bind(this);
    this.renderUnsetEncoding = this.renderUnsetEncoding.bind(this);
    this.toggleEncodingsHidden = this.toggleEncodingsHidden.bind(this);

    this.state = {
      areEncodingsHidden: true
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

  private addNewEncodingToTemplate(newEncoding: MarkEncoding) {
    this.props.template.setEncodedValue(newEncoding, null);

    // TODO: instead of updating the template everywhere, just update in here and propagate changes
    // only if a valid value is set
    this.props.onTemplateChanged();

    this.setState({
      areEncodingsHidden: true
    });
  }

  private renderEncoding(encoding: MarkEncoding) {
    const value = this.props.template.getEncodedValue(encoding);

    if (value === undefined) {
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
        <button onClick={ () => this.addNewEncodingToTemplate(unsetEncoding) }>
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
      .filter(encoding => this.props.template.getEncodedValue(encoding) === undefined);

    return (
      <ul className="encodings">
        { unsetEncodings.map(this.renderUnsetEncoding) }
      </ul>
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
        { this.renderAddEncodingWidget() }
      </div>
    );
  }
}