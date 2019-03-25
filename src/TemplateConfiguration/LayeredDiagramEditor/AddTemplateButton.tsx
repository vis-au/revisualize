import * as React from 'react';
import { Mark } from 'vega-lite/build/src/mark';

import { COMPOSITION_TYPES, Plot, Composition } from '../TemplateModel/LayoutType';
import { MARK_TYPES } from '../TemplateModel/MarkType';
import Template from '../TemplateModel/Template';
import AddTemplateButtonObserver from './AddTemplateButtonObserver';
import PlotTemplate from '../TemplateModel/PlotTemplate';
import RepeatTemplate from '../TemplateModel/RepeatTemplate';
import ConcatTemplate from '../TemplateModel/ConcatTemplate';
import FacetTemplate from '../TemplateModel/FacetTemplate';
import LayerTemplate from '../TemplateModel/LayerTemplate';

import './AddTemplateButton.css';

interface Props {
  addTemplate: (template: Template) => void;
  layer: number;
  buttonObserver: AddTemplateButtonObserver;
  right: boolean;
}
interface State {
  isDropdownHidden: boolean
}

export default class AddTemplateButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.renderCompositionBlock = this.renderCompositionBlock.bind(this);
    this.renderPlotBlock = this.renderPlotBlock.bind(this);
    this.renderMarkBlock = this.renderMarkBlock.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);

    this.props.buttonObserver.join(this.hideDropdown);

    this.state = {
      isDropdownHidden: true
    }
  }

  public hideDropdown() {
    this.setState({ isDropdownHidden: true });
  }

  private toggleDropdown() {
    this.props.buttonObserver.notifyAll(this.hideDropdown);

    this.setState({
      isDropdownHidden: !this.state.isDropdownHidden
    });
  }

  private onMarkClicked(mark: Mark) {
    const newVisualMark = new PlotTemplate(null);
    newVisualMark.type = mark;
    newVisualMark.hierarchyLevel = this.props.layer;

    this.props.addTemplate(newVisualMark);
  }

  private onPlotClicked(type: Plot) {
    const newCompositeTemplate = new PlotTemplate(null);
    newCompositeTemplate.hierarchyLevel = this.props.layer;

    this.props.addTemplate(newCompositeTemplate);
  }

  private onCompositionClicked(type: Composition) {
    let templateConstructor: any = RepeatTemplate;

    if (type === 'concatenate') {
      templateConstructor = ConcatTemplate;
    } else if (type === 'repeat') {
      templateConstructor = RepeatTemplate;
    } else if (type === 'facet') {
      templateConstructor = FacetTemplate;
    } else if (type === 'overlay') {
      templateConstructor = LayerTemplate;
    }

    const newCompositeTemplate = new templateConstructor([], null);
    newCompositeTemplate.hierarchyLevel = this.props.layer;

    this.props.addTemplate(newCompositeTemplate);
  }

  private renderMarkBlock(mark: Mark) {
    return (
      <li key={ mark }>
        <button onClick={ () => this.onMarkClicked(mark) }>
          <i className="icon material-icons">stop</i>
          <span>{ mark }</span>
        </button>
      </li>
    );
  }

  private renderPlotBlock(type: Plot) {
    return (
      <li key={ type }>
        <button onClick={ () => this.onPlotClicked(type) }>
          <i className="icon material-icons">equalizer</i>
          <span>{ type }</span>
        </button>
      </li>
    );
  }

  private renderCompositionBlock(type: Composition) {
    return (
      <li key={ type }>
        <button onClick={ () => this.onCompositionClicked(type) }>
          <i className="icon material-icons">equalizer</i>
          <span>{ type }</span>
        </button>
      </li>
    );
  }

  private renderLayoutGroup() {
    if (this.props.layer === 0) {
      return (
        <div className="templateList">
          <h2>Marks</h2>
          <ul onClick={ this.hideDropdown } className="marks">
            { MARK_TYPES.map(this.renderMarkBlock)}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="templateList">
          <h2>Compositions</h2>
          <ul onClick={ this.hideDropdown } className="layouts">
            { COMPOSITION_TYPES.map(this.renderCompositionBlock) }
          </ul>
        </div>
      );
    }
  }

  private renderLayoutGroups() {
    return (
      <div className={ `templateLists ${this.state.isDropdownHidden ? 'hidden' : ''}` }>
        { this.renderLayoutGroup() }
      </div>
    );
  }

  public render() {
    const orientation = this.props.right ? 'right' : 'left';

    return (
      <div className={ `addTemplateWidget ${orientation}` }>
        <button className="floatingAddButton addTemplate" onClick={ this.toggleDropdown }>+</button>

        { this.renderLayoutGroups() }
      </div>
    );
  }
}