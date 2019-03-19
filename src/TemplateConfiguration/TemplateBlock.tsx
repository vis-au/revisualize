import * as React from 'react';

import TemplatePreview from './TemplatePreview';
import LayoutBlock from './LayoutBlock';
import Template from './TemplateModel/Template';
import VisualElementBlock from './VisualElementBlock';

import './TemplateBlock.css';

interface Props {
  key: string;
  dragPlumbing: any;
  template: Template;
  level: number;
  toggleChildTemplate: (template: Template) => void;
  delete: () => void
}
interface State {

}

export default class TemplateBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.toggleChildTemplates = this.toggleChildTemplates.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.renderVisualElements = this.renderVisualElements.bind(this);
    this.renderVisualElement = this.renderVisualElement.bind(this);
  }

  private onClick() {
    // find something that makes sense
  }

  private onDelete() {
    this.props.delete();
  }

  private toggleChildTemplates() {
    this.props.template.visualElements.forEach((template) => {
      this.props.toggleChildTemplate(template);
    });
  }

  private renderLayout() {
    return (
      <div className="layoutStructureContainer">
        <LayoutBlock layout={ this.props.template.layout } />
      </div>
    );
  }

  renderPreview() {
    return (
      <div className="previewContainer">
        <TemplatePreview
          key={ this.props.template.visualElements.map(v => v.id).join('_') }
          template={ this.props.template }/>
      </div>
    );
  }

  private renderVisualElement(visualElement: Template) {
    return (
      <div key={ visualElement.id } className="visualElementContainer">
        <VisualElementBlock visualElement={ visualElement }/>
      </div>
    );
  }

  private renderVisualElements() {
    return (
      <div className="visualElementsContainer">
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
          <button className="expand" onClick={ this.toggleChildTemplates }>subtree</button>
          <div className="delete" onClick={ this.onDelete } />
        </div>
        <div className="body">
          <div className="configuration">
            { this.renderLayout() }
            { this.renderVisualElements() }
          </div>
          { this.renderPreview() }
        </div>
      </div>
    );
  }

  private addPlumbing() {
    const bodySelector =
      document.querySelector(`#${this.props.template.id} .body`);
    const visualElementSelector =
      document.querySelector(`#${this.props.template.id} .body .visualElementsContainer`);

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

    // this.props.dragPlumbing.draggable(this.props.template.id, {
    //   filter: '.body,.body *'
    // });
  }

  public componentDidMount() {
    this.addPlumbing();
  }
}
