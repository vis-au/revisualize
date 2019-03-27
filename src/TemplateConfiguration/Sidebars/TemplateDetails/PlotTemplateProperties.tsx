import * as React from 'react';
import { markEncodingGroups, MarkEncodingGroup } from '../../TemplateModel/MarkEncoding';
import EncodingGroupBlock from './EncodingGroup';
import PlotTemplate from '../../TemplateModel/PlotTemplate';

interface Props {
  template: PlotTemplate;
  onTemplateChanged: () => void;
}
interface State {
}

export default class PlotTemplateProperties extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.renderEncoding = this.renderEncoding.bind(this);
  }

  private renderEncoding(encoding: MarkEncodingGroup) {
    if (this.props.template === null) {
      return null;
    }

    return (
      <EncodingGroupBlock
        key={ encoding }
        groupType={ encoding }
        template={ this.props.template }
        onTemplateChanged={ this.props.onTemplateChanged }
      />
    );
  }

  private renderEncodings() {
    return (
      <div className="encodings">
        { markEncodingGroups.map(this.renderEncoding)}
      </div>
    );
  }

  public render() {
    return (
      <div className="plotTemplateProperties">
        { this.renderEncodings() }
      </div>
    );
  }
}