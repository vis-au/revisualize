import * as React from 'react';
import ConcatTemplate from '../../TemplateModel/ConcatTemplate';
import FacetTemplate from '../../TemplateModel/FacetTemplate';
import LayerTemplate from '../../TemplateModel/LayerTemplate';
import RepeatTemplate from '../../TemplateModel/RepeatTemplate';
import Template from '../../TemplateModel/Template';
import './CompositionTemplateProperties.css';

interface Props {
  template: Template;
  onTemplateChanged: () => void;
}
interface State {
}

export default class CompositionTemplateProperties extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onDeleteRepeatedField = this.onDeleteRepeatedField.bind(this);
  }

  private onDeleteRepeatedField(fromColumn: boolean, field: string) {
    const template = this.props.template as RepeatTemplate;

    const repeatedFields = fromColumn ? template.repeat.column : template.repeat.row;
    const indexInRepeatedFields = repeatedFields.indexOf(field);

    if (indexInRepeatedFields === -1) {
      return;
    }

    repeatedFields.splice(indexInRepeatedFields, 1);

    if (fromColumn) {
      template.repeat.column = repeatedFields;
    } else {
      template.repeat.row = repeatedFields;
    }

    this.props.onTemplateChanged();
  }

  private renderRepeatedField(isColumnField: boolean, field: string) {
    return (
      <div key={ field } className="repeatedField">
        <span>{ field }</span>
        <div
          className="delete"
          onClick={ () => this.onDeleteRepeatedField(isColumnField, field) } />

      </div>
    );
  }

  private renderRepeatProperties() {
    const template = this.props.template as RepeatTemplate;
    const repeat = template.repeat;

    return (
      <div className="properties repeat">
        <div className="repeatedFields">
          <h2>Column</h2>
          <div className="column">
            { repeat.column.map(d => this.renderRepeatedField(true, d)) }
          </div>
          <h2>Row</h2>
          <div className="row">
            { repeat.row.map(d => this.renderRepeatedField(false, d)) }
          </div>
        </div>
      </div>
    );
  }

  private renderFacetProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderLayerProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private setConcatDirection(direction: 'vertical' | 'horizontal') {
    (this.props.template as ConcatTemplate).isVertical = direction === 'vertical';
    this.props.onTemplateChanged();
  }

  private renderConcatProperties() {
    const template = this.props.template as ConcatTemplate;
    const isVerticalConcat = template.isVertical;

    return (
      <div className="properties">
        <input
          id="verticalConcat"
          name="concatDirection"
          type="radio"
          onChange={ () => this.setConcatDirection('vertical') }
          checked={ isVerticalConcat }/>
        <label htmlFor="verticalConcat">Vertical</label>

        <input
          id="horizontalConcat"
          name="concatDirection"
          type="radio"
          onChange={ () => this.setConcatDirection('horizontal') }
          checked={ !isVerticalConcat }/>
        <label htmlFor="horizontalConcat">Horizontal</label>
      </div>
    );
  }

  private renderProperties() {
    let properties: JSX.Element = null;

    if (this.props.template instanceof RepeatTemplate) {
      properties = this.renderRepeatProperties();
    } else if (this.props.template instanceof FacetTemplate) {
      properties = this.renderFacetProperties();
    } else if (this.props.template instanceof LayerTemplate) {
      properties = this.renderLayerProperties();
    } else if (this.props.template instanceof ConcatTemplate) {
      properties = this.renderConcatProperties();
    }

    return properties;
  }

  public render() {
    return (
      <div className="compositionTemplateProperties">
        { this.renderProperties() }
      </div>
    );
  }
}