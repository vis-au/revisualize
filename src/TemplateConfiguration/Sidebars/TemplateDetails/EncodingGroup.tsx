import * as React from 'react';
import { facetChannelEncodings, geographicPositionEncodings, hyperLinkChannelEncodings, keyChannelEncodings, loDChannelEncodings, MarkEncoding, MarkEncodingGroup, markPropertiesChannelEncodings, orderChannelEncodings, PlotTemplate, positionEncodings, textTooltipChannelEncodings } from 'toolkitmodel';

import EncodingBlock from './EncodingBlock';

import './EncodingGroup.css';

interface Props {
  template: PlotTemplate;
  groupType: MarkEncodingGroup;
  onTemplateChanged: () => void;
}
interface State {
  areEncodingsHidden: boolean;
  emptyEncoding: MarkEncoding;
  temporaryValue: string;
  temporaryField: string;
}

export default class EncodingGroupBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onTemporaryFieldChange = this.onTemporaryFieldChange.bind(this);
    this.onTemporaryFieldEnterKeyPress = this.onTemporaryFieldEnterKeyPress.bind(this);
    this.onTemporaryValueChange = this.onTemporaryValueChange.bind(this);
    this.onTemporaryValueEnterKeyPress = this.onTemporaryValueEnterKeyPress.bind(this);
    this.getEncodingsForGroup = this.getEncodingsForGroup.bind(this);
    this.showEncodingInput = this.showEncodingInput.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderAddEncodingWidget = this.renderAddEncodingWidget.bind(this);
    this.renderUnsetEncodings = this.renderUnsetEncodings.bind(this);
    this.renderUnsetEncoding = this.renderUnsetEncoding.bind(this);
    this.toggleEncodingsHidden = this.toggleEncodingsHidden.bind(this);

    this.state = {
      areEncodingsHidden: true,
      emptyEncoding: null,
      temporaryValue: '',
      temporaryField: ''
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

  private isGroupHiddenInMarkType(): boolean {
    let isGroupHiddenInMarkType = false;
    const markType = this.props.template.type;

    if (this.props.groupType === 'geographic') {
      if (markType !== 'geoshape') {
        isGroupHiddenInMarkType = true;
      }
    } else if (this.props.groupType === 'facet channel') {
      isGroupHiddenInMarkType = true;
    }


    return isGroupHiddenInMarkType;
  }

  private toggleEncodingsHidden() {
    this.setState({ areEncodingsHidden: !this.state.areEncodingsHidden });
  }

  private showEncodingInput(newEncoding: MarkEncoding) {
    if (this.state.emptyEncoding === newEncoding) {
      this.setState({ emptyEncoding: null });
    } else {
      this.setState({ emptyEncoding: newEncoding });
    }
  }

  private onTemporaryValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      temporaryValue: event.target.value
    });
  }

  private onTemporaryFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      temporaryField: event.target.value
    });
  }

  private onTemporaryFieldEnterKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    const newField = {
      field: this.state.temporaryField,
      type: 'ordinal'
    };

    this.props.template.setEncodedValue(this.state.emptyEncoding, newField as any);

    this.setState({
      emptyEncoding: null,
      temporaryField: ''
    });

    this.props.onTemplateChanged();
  }

  private onTemporaryValueEnterKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    const newValue = {
      value: this.state.temporaryValue
    };

    this.props.template.setEncodedValue(this.state.emptyEncoding, newValue as any);

    this.setState({
      emptyEncoding: null,
      temporaryValue: ''
    });

    this.props.onTemplateChanged();
  }

  private onDeleteEncoding(encoding: MarkEncoding) {
    if (this.props.template.overwrittenEncodings.get(encoding) !== undefined) {
      this.props.template.overwrittenEncodings.delete(encoding);
    } else {
      this.props.template.deleteEncodedValue(encoding);
    }
    this.props.onTemplateChanged();
  }

  private renderEncoding(encoding: MarkEncoding) {
    let value = this.props.template.getEncodedValue(encoding);
    const overwrittenValue = this.props.template.overwrittenEncodings.get(encoding);

    if (overwrittenValue !== undefined && overwrittenValue !== null) {
      value = overwrittenValue;
    }
    if (value === undefined || value === null) {
      return null;
    }

    return (
      <EncodingBlock
        key={ `encoding${encoding}` }
        encoding={ encoding }
        isInferred={ overwrittenValue !== undefined && overwrittenValue !== null }
        value={ value as any }
        delete={ () => this.onDeleteEncoding(encoding)}
      />
    );
  }

  private renderEncodings() {
    const encodings = this.getEncodingsForGroup();

    return (
      <div className="encodings">
        { encodings.map(this.renderEncoding) }
      </div>
    );
  }

  private renderUnsetEncoding(unsetEncoding: MarkEncoding) {
    const isTemporary = this.state.emptyEncoding === unsetEncoding ? 'temporary' : '';

    return (
      <li key={ `unset${unsetEncoding}` } className={ `unsetEncoding ${isTemporary}` }>
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
      <div className="unsetEncodings">
        <div className="addUnsetEncodingsWidget">
          { this.renderEmptyEncodingValueInput() }
          { this.renderEmptyEncodingFieldInput() }
        </div>
        <ul>
          { unsetEncodings.map(this.renderUnsetEncoding) }
        </ul>
      </div>
    );
  }

  private renderEmptyEncodingFieldInput() {
    if (this.state.emptyEncoding === null || this.state.areEncodingsHidden) {
      return false;
    }

    return (
      <div className="newFieldEncoding">
        <input
          type="text"
          value={ this.state.temporaryField || '' }
          onChange={ this.onTemporaryFieldChange }
          onKeyPress={ this.onTemporaryFieldEnterKeyPress }
          placeholder="enter field" />
      </div>
    );
  }

  private renderEmptyEncodingValueInput() {
    if (this.state.emptyEncoding === null || this.state.areEncodingsHidden) {
      return false;
    }

    return (
      <div className="newValueEncoding">
        <input
          type="text"
          value={ this.state.temporaryValue || '' }
          onChange={ this.onTemporaryValueChange }
          onKeyPress={ this.onTemporaryValueEnterKeyPress }
          placeholder="enter value" />
      </div>
    );
  }

  private renderAddEncodingWidget() {
    return (
      <div className="addEncodingWidget">
        { this.renderUnsetEncodings() }
      </div>
    );
  }

  public render() {
    const isHidden = this.isGroupHiddenInMarkType() ? 'hidden' : '';

    return (
      <div className={`encodingGroup ${isHidden}`}>
        <div className="row">
          <h2>{ this.props.groupType }</h2>
          <button className="addNewEncoding" onClick={ this.toggleEncodingsHidden }>
            { this.state.areEncodingsHidden ? 'show more' : 'show less'}
          </button>
        </div>
        { this.renderEncodings() }
        { this.renderAddEncodingWidget() }
      </div>
    );
  }
}