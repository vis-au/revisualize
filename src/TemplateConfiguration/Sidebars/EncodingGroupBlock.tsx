import * as React from 'react';
import { MarkEncodingGroup, MarkEncoding, positionEncodings, geographicPositionEncodings, markPropertiesChannelEncodings, textTooltipChannelEncodings, hyperLinkChannelEncodings, keyChannelEncodings, orderChannelEncodings, loDChannelEncodings, facetChannelEncodings } from '../TemplateModel/MarkEncoding';
import VisualMarkTemplate from '../TemplateModel/VisualMark';

interface Props {
  template: VisualMarkTemplate;
  groupType: MarkEncodingGroup;
}
interface State {
}

export default class EncodingGroupBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.getEncodingsForGroup = this.getEncodingsForGroup.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
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
        <h2>{ this.props.groupType }</h2>
        { encodings.map(this.renderEncoding) }
      </div>
    );
  }

  public render() {
    return (
      <div className="encodingGroup">
        { this.renderEncodings() }
      </div>
    );
  }
}