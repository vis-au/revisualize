import * as React from 'react';
import DiagramEditor from '../Widgets/DiagramEditor';
import Template from './TemplateModel/Template';
import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import TemplateBlock from './TemplateBlock';

interface Props {
  templates: Template[],
  onTemplatesChanged: () => void
}
interface State {
}

const templateEditorPlumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' }
};

export default class TemplateEditor extends React.Component<Props, State> {
  private dragPlumbing: jsPlumbInstance;

  constructor(props: Props) {
    super(props);

    this.renderTemplateBlocks = this.renderTemplateBlocks.bind(this);
    this.onNewConnection = this.onNewConnection.bind(this);
    this.onDiagramClicked = this.onDiagramClicked.bind(this);
    this.onDetachedConnection = this.onDetachedConnection.bind(this);
    this.render = this.render.bind(this);

    this.dragPlumbing = jsPlumb.getInstance();
  }

  private renderTemplateBlock(template: Template) {
    return (
      <TemplateBlock key={ template.id } dragPlumbing={ this.dragPlumbing } template={ template }/>
    );
  }

  private renderTemplateBlocks() {
    return this.props.templates.map(templ => this.renderTemplateBlock(templ));
  }

  private onNewConnection(event: any) {
    if (event.source.parentNode.id === event.target) {
      return false;
    }

    const sourceTemplate = this.props.templates
      .find(template => template.id === event.source.parentNode.parentNode.id);

    const targetTemplate = this.props.templates
      .find(template => template.id === event.target.parentNode.id);

    sourceTemplate.visualElements.push(targetTemplate);

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
  }

  private onDetachedConnection(event: any) {
    // const link = this.props.patternGraph.links.find(l => l.connection === event.connection);

    // this.props.patternGraph.removeLink(link);
    // this.dragPlumbing.repaintEverything();
    // this.props.updatePatternGraph();
  }

  private onDiagramClicked() {
    return;
  }

  public render() {
    return (
      <DiagramEditor
        id="templateDiagram"
        dragPlumbing={ this.dragPlumbing }
        plumbingConfig={ templateEditorPlumbingConfig }
        onDiagramClicked={ this.onDiagramClicked }
        onDetachedConnection={ this.onDetachedConnection }
        onNewConnection={ this.onNewConnection }
        renderBlocks={ this.renderTemplateBlocks.bind(this) } />
    );
  }
}