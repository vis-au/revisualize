import * as React from 'react';

import LayoutBlock from './LayoutBlock';
import Template from '../TemplateModel/Template';
import TemplatePreview from './TemplatePreview';
import VisualElementBlock from './VisualElementBlock';
import VisualMarkTemplate from '../TemplateModel/VisualMark';
import CompositeTemplate from '../TemplateModel/CompositeTemplate';

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
  minimized: boolean;
}

export default class TemplateBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.toggleChildTemplates = this.toggleChildTemplates.bind(this);
    this.togglePreviewMinimized = this.togglePreviewMinimized.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.renderVisualElements = this.renderVisualElements.bind(this);
    this.renderVisualElement = this.renderVisualElement.bind(this);

    this.state = {
      minimized: false
    };
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

  private togglePreviewMinimized() {
    this.setState({ minimized: !this.state.minimized });
  }

  private renderHeader() {
    const label = this.props.template instanceof VisualMarkTemplate
      ? this.props.template.type
      : this.props.template.id;

    return (
      <div className="templateHeader">
        <h2>{ label }</h2>
        <div className="delete" onClick={ this.onDelete } />
      </div>
    );
  }

  private renderLayout() {
    return (
      <div className="layoutStructureContainer">
        <LayoutBlock layout={ this.props.template.layout } minimized={ this.state.minimized } />
      </div>
    );
  }

  public renderPreview() {
    if (this.state.minimized) {
      return null;
    }

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
      <div key={ visualElement.id } id={ `ve${visualElement.id}`} className="visualElementContainer">
        <VisualElementBlock visualElement={ visualElement } minimized={ this.state.minimized }/>
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

  private renderConfiguration() {
    if (this.props.template instanceof VisualMarkTemplate) {
      return null;
    }

    return (
      <div className="configuration">
        { this.renderLayout() }
        { this.renderVisualElements() }
      </div>
    );
  }

  private renderBody() {
    return (
      <div className="body">
        { this.renderConfiguration() }
        { this.renderPreview() }
      </div>
    );
  }

  private renderFooter() {
    if (this.props.template instanceof VisualMarkTemplate) {
      return (
        <div className="footer">
          <button className="expand" onClick={ this.togglePreviewMinimized }>
            <i className="material-icons icon">aspect_ratio</i>
            <span>preview</span>
          </button>
        </div>
      );
    } else {
      return (
        <div className="footer">
          <button className="expand" onClick={ this.togglePreviewMinimized }>
            <i className="material-icons icon">aspect_ratio</i>
            <span>preview</span>
          </button>
          <button className="expand" onClick={ () => null }>
            <i className="material-icons icon">timeline</i>
            <span>child nodes</span>
          </button>
        </div>
      );
    }
  }

  public render() {
    const type = this.props.template instanceof VisualMarkTemplate
      ? 'mark'
      : 'composite';

    return (
      <div
        id={ this.props.template.id }
        className={ `${type} template` }
        onClick={ this.onClick }>

        { this.renderHeader()}
        { this.renderBody() }
        { this.renderFooter() }
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

    if (this.props.template instanceof CompositeTemplate) {
      this.props.dragPlumbing.makeSource(visualElementSelector, plumbingConfig, sourceConfig);
    }
  }

  public componentDidMount() {
    this.addPlumbing();
  }

  public componentDidUpdate() {
    this.props.dragPlumbing.repaintEverything();
  }
}
