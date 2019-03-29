import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
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

const LAYER_PREFIX = 'sidebarLayer';

export default class CompositionTemplateProperties extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onDeleteRepeatedField = this.onDeleteRepeatedField.bind(this);
    this.renderTemplateAsLayer = this.renderTemplateAsLayer.bind(this);
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

  private renderAddRepeatedFieldButton(rowOrColumn: 'row'|'column') {
    return (
      <button className="floatingAddButton">+</button>
    );
  }

  private renderAvailableFieldForRepeat(field: string) {
    return (
      <div key={ `availableField${field}` }className="availableField">{ field }</div>
    );
  }

  private renderAvailableFieldsForRepeat(rowOrColumn: 'row'|'column') {
    // FIXME: relate to actual data source here
    const availableFields = ['asdf', 'sdfg', 'dfgh'];

    return (
      <div className="availableFields">
        { availableFields.map(this.renderAvailableFieldForRepeat) }
      </div>
    );
  }

  private renderRepeatProperties() {
    const template = this.props.template as RepeatTemplate;
    const repeat = template.repeat;

    const columnRepeatedFields = template.repeat.column !== undefined
      ? repeat.column.map(d => this.renderRepeatedField(true, d))
      : null;

    const rowRepeatedFields = template.repeat.row !== undefined
      ? repeat.row.map(d => this.renderRepeatedField(false, d))
      : null;

    return (
      <div className="properties repeat">
        <h2>Repeated Fields</h2>
        <div className="repeatedFields">
          <h3>Column</h3>
          <div className="column">
            { columnRepeatedFields }
            { this.renderAddRepeatedFieldButton('column') }
          </div>
          { this.renderAvailableFieldsForRepeat('column') }
          <h3>Row</h3>
          <div className="row">
            { rowRepeatedFields }
            { this.renderAddRepeatedFieldButton('row') }
          </div>
          { this.renderAvailableFieldsForRepeat('row') }
        </div>
      </div>
    );
  }

  private renderFacetProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderTemplateAsLayer(layer: Template) {
    const identifier =  `${LAYER_PREFIX}${layer.id}`;
    return (
      <div key={ identifier } id={ identifier } className="compositionLayer">{ layer.id }</div>
    );
  }

  private renderSortableLayers() {
    const layers: Template[] = this.props.template.visualElements;

    return (
      <div className="compositionLayers">
        { layers.map(this.renderTemplateAsLayer) }
      </div>
    );
  }

  private renderLayerProperties() {
    return (
      <div className="properties">
        <h2>Layers</h2>
        { this.renderSortableLayers() }
      </div>
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

        { this.renderSortableLayers() }
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

  private makeLayersSortable() {
    $(`.compositionTemplateProperties .compositionLayers`).sortable({
      placeholder: 'compositionLayerPlaceholder',
      start: (event, ui) => {
        (ui.item as any).indexAtStart = ui.item.index();
      },
      sort: (event, ui) => {
      },
      change: (event, ui) => {},
      stop: (event, ui) => {
        const newIndex = ui.item.index();
        const oldIndex = (ui.item as any).indexAtStart;

        if (newIndex >= this.props.template.visualElements.length) {
          return;
        }

        const templateID = ui.item[0].id.split(LAYER_PREFIX)[1];
        const template = this.props.template.visualElements[oldIndex];
        const swapTemplate = this.props.template.visualElements[newIndex];

        this.props.template.visualElements.splice(oldIndex, 0, template);
        this.props.template.visualElements.splice(newIndex, 0, swapTemplate);

        this.props.template.visualElements.splice(oldIndex, 1);
        this.props.template.visualElements.splice(newIndex + 1, 1);

        this.props.onTemplateChanged();
      },
    });
  }

  public componentDidMount() {
    this.makeLayersSortable();
  }

  public componentDidUpdate() {
    this.makeLayersSortable();
  }
}