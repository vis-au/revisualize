import * as React from 'react';

import Template from './TemplateModel/Template';

import './TemplateBlock.css';
import VisualElementMarkBlock from './VisualElementMarkBlock';
import { VisualElementType } from './TemplateModel/VisualElementType';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import VisualMark from './TemplateModel/VisualMark';
import CompositeVisualElementBlock from './CompositeVisualElementBlock';
import LayoutBlock from './LayoutBlock';

interface Props {
  key: string;
  dragPlumbing: any;
  template: Template
}
interface State {

}

export default class TemplateBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this);
    this.renderVisualElement = this.renderVisualElement.bind(this);
  }

  private onClick() {
    // find something that makes sense
  }

  private onDeleteTemplate() {
    return;
  }

  private renderLayout() {
    return (
      <div className="layoutStructureContainer">
        <LayoutBlock layout={ this.props.template.layout } />
      </div>
    );
  }

  private renderVisualElement(visualElement: VisualElementType) {
    if (visualElement instanceof CompositeTemplate) {
      return (
        <CompositeVisualElementBlock key={ visualElement.id } visualElement={ visualElement }/>
      );
    } else if (visualElement instanceof VisualMark) {
      return (
        <VisualElementMarkBlock key={ visualElement.id } visualElement={ visualElement }/>
      );
    }
  }

  private renderVisualElements() {
    return (
      <div className="visualElementContainer">
        { this.props.template.visualElements.map(this.renderVisualElement) }
      </div>
    );
  }

  public render() {
    return (
      <div
        id={ this.props.template.id }
        className={ 'template' }
        onClick={ this.onClick }>

        <div className="templateHeader">
          <h2>{ this.props.template.id }</h2>
          <div className="delete" onClick={ this.onDeleteTemplate } />
        </div>
        <div className="body">
          { this.renderLayout() }
          { this.renderVisualElements() }
        </div>

      </div>
    );
  }

  private addPlumbing() {
    const bodySelector = document.querySelector(`#${this.props.template.id} .body`);
    const visualElementSelector = document.querySelector(`#${this.props.template.id} .body .visualElementContainer`);

    const plumbingConfig = {
      paintStyle: { fill: 'teal', radius: 5 },
      foldBack: 1,
    };

    // make sure clicking/dragging delete buttons of buildings block are not creating links
    const sourceConfig = {
      filter: (event: any) => {
        const clickedDeleteButton = event.target.classList.contains('delete');
        const clickedResizable = event.target.classList.contains('ui-resizable-handle');
        const clickedPaddingButton = event.target.classList.contains('padding');

        return !clickedDeleteButton && !clickedResizable && !clickedPaddingButton;
      }
    };

    this.props.dragPlumbing.makeTarget(bodySelector, plumbingConfig);
    this.props.dragPlumbing.makeSource(visualElementSelector, plumbingConfig, sourceConfig);

    this.props.dragPlumbing.draggable(this.props.template.id, {
      filter: '.body,.body *'
    });
  }

  public componentDidMount() {
    this.addPlumbing();
  }
}
