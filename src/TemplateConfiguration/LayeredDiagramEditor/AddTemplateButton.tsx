import * as React from 'react';
import { Mark } from 'vega-lite/build/src/mark';

import CompositeTemplate from '../TemplateModel/CompositeTemplate';
import Layout from '../TemplateModel/Layout';
import { LayoutType, LAYOUT_TYPES } from '../TemplateModel/LayoutType';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMark';
import AddTemplateButtonObserver from './AddTemplateButtonObserver';
import { MARK_TYPES } from '../TemplateModel/MarkType';

import './AddTemplateButton.css';

interface Props {
  addTemplate: (template: Template) => void;
  layer: number;
  buttonObserver: AddTemplateButtonObserver
}
interface State {
  isDropdownHidden: boolean
}

export default class AddTemplateButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.renderLayoutBlock = this.renderLayoutBlock.bind(this);
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
    const newVisualMark = new VisualMarkTemplate(mark, null);
    newVisualMark.hierarchyLevel = this.props.layer;

    this.props.addTemplate(newVisualMark);
  }

  private onLayoutClicked(type: LayoutType) {
    const newLayout = new Layout(type);
    const newCompositeTemplate = new CompositeTemplate(newLayout, [], null);
    newCompositeTemplate.hierarchyLevel = this.props.layer;

    this.props.addTemplate(newCompositeTemplate);
  }

  private renderMarkBlock(mark: Mark) {
    return (
      <li key={ mark }>
        <button onClick={ () => this.onMarkClicked(mark) }>{ mark }</button>
      </li>
    );
  }

  private renderLayoutBlock(type: LayoutType) {
    return (
      <li key={ type }>
        <button onClick={ () => this.onLayoutClicked(type) }>{ type }</button>
      </li>
    );
  }

  public render() {
    return (
      <div className="addTemplateWidget">
        <button className="floatingAddButton addTemplate" onClick={ this.toggleDropdown }>+</button>
        <div className={ `templateLists ${this.state.isDropdownHidden ? 'hidden' : ''}` }>
          <h2>Layouts</h2>
          <ul onClick={ this.hideDropdown } className="layouts">
            { LAYOUT_TYPES.map(this.renderLayoutBlock) }
          </ul>
          <h2>Marks</h2>
          <ul onClick={ this.hideDropdown } className="marks">
            { MARK_TYPES.map(this.renderMarkBlock)}
          </ul>
        </div>
      </div>
      );
  }
}