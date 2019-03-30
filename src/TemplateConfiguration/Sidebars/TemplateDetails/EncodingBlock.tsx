import * as React from 'react';
import { isFieldDef, isValueDef } from 'vega-lite/build/src/fielddef';

import './EncodingBlock.css';

interface Props {
  encoding: string;
  value: any;
  isInferred: boolean;
  delete: () => void;
}
interface State {
}

export default class EncodingBlock extends React.Component<Props, State> {
  private renderValue() {
    let value: any = this.props.value;

    if (isFieldDef(value)) {
      value = value.field;
    } else if (isValueDef) {
      value = value.value;
    }

    const stringValue: string = JSON.stringify(value);

    return (
      <span className="value">{ stringValue }</span>
    );
  }

  private renderEncodedProperty() {
    return (
      <span className="property">{ this.props.encoding }</span>
    );
  }

  private renderIcon() {
    const value: any = this.props.value;
    let icon: string = 'bookmark';

    if (isFieldDef(value)) {
      icon = 'view_headline';
    } else if (isValueDef) {
      icon = 'bar_chart';
    }

    return (
      <i className="icon material-icons">{ icon }</i>
    );
  }

  public render() {
    const isInferred = this.props.isInferred ? 'inferred' : '';
    const title = `${this.props.encoding}: ${JSON.stringify(this.props.value)}`
    const titlePrefix = this.props.isInferred ? 'inferred from parent: ': '';

    return (
      <div className={`encoding ${isInferred}`} title={ `${titlePrefix} ${title}` }>
        { this.renderIcon() }
        { this.renderEncodedProperty() }
        { this.renderValue() }
        <span className="delete" onClick={ this.props.delete }></span>
      </div>
    );
  }
}