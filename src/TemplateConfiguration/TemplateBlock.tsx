import * as React from 'react';

import CompositeVisualElementBlock from './CompositeVisualElementBlock';
import LayoutBlock from './LayoutBlock';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';
import VisualMarkTemplate from './TemplateModel/VisualMark';
import VisualElementMarkBlock from './VisualElementMarkBlock';

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
    if (this.props.template.layout === null) {
      return <span>no layout</span>
    }

    return (
      <div className="layoutStructureContainer">
        <LayoutBlock layout={ this.props.template.layout } />
      </div>
    );
  }

  private renderVisualElements() {
    if (this.props.template instanceof CompositeTemplate) {
      return (
        <div className="visualElementContainer">
          <CompositeVisualElementBlock
            key={ this.props.template.visualElements.map(v => v.id).join('_') }
            layout={ this.props.template.layout }
            templates={ this.props.template.visualElements }/>
        </div>
      );
    } else if (this.props.template instanceof VisualMarkTemplate) {
      return (
        <div className="visualElementContainer">
          <VisualElementMarkBlock
            visualElement={ this.props.template }/>
        </div>
      );
    }
  }

  public render() {
    const label = this.props.template.layout === null
     ? this.props.template.id
     : this.props.template.layout.type.charAt(0).toUpperCase() + this.props.template.layout.type.slice(1);

    return (
      <div
        id={ this.props.template.id }
        className={ 'template' }
        onClick={ this.onClick }>

        <div className="templateHeader">
          <h2>{ label }</h2>
          <button className="expand" onClick={ this.toggleChildTemplates }>subtree</button>
          <div className="delete" onClick={ this.onDelete } />
        </div>
        <div className="body">
          { this.renderLayout() }
          { this.renderVisualElements() }
        </div>
      </div>
    );
  }

  private addPlumbing() {
    const bodySelector =
      document.querySelector(`#${this.props.template.id} .body`);
    const visualElementSelector =
      document.querySelector(`#${this.props.template.id} .body .visualElementContainer`);

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
