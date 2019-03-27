import * as React from 'react';
import { ValueDef, FieldDef, isValueDef, isFieldDef } from 'vega-lite/build/src/fielddef';

import './EncodingBlock.css';

interface Props {
  encoding: string;
  value: FieldDef<any> | ValueDef;
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

  public render() {
    return (
      <div className="encoding">
        { this.renderEncodedProperty() }
        { this.renderValue() }
        <span className="delete" onClick={ this.props.delete }></span>
      </div>
    );
  }
}