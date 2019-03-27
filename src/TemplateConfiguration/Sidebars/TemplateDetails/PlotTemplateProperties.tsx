import * as React from 'react';

import { Mark } from 'vega-lite/build/src/mark';
import { MarkEncodingGroup, markEncodingGroups } from '../../TemplateModel/MarkEncoding';
import { MARK_TYPES } from '../../TemplateModel/MarkType';
import PlotTemplate from '../../TemplateModel/PlotTemplate';
import EncodingGroupBlock from './EncodingGroup';

import './PlotTemplateProperties.css';

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
    this.setMarkType = this.setMarkType.bind(this);
  }

  private setMarkType(event: React.ChangeEvent<HTMLSelectElement>) {
    this.props.template.type = event.target.value as Mark;
    this.props.onTemplateChanged();
  }

  private renderMarkOption(mark: Mark) {
    return <option key={ `option${mark}` } value={ mark }>{ mark }</option>;
  }

  private renderMarkConfig() {
    const markType = this.props.template.type;

    return (
      <div className="marks">
        <h2>Mark</h2>
        <select name="markSelection" id="markSelection" value={ markType } onChange={ this.setMarkType }>
          { MARK_TYPES.map(this.renderMarkOption) }
        </select>
      </div>
    );
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
        { this.renderMarkConfig() }
        { this.renderEncodings() }
      </div>
    );
  }
}