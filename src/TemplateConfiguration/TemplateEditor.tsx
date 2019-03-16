import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb';
import * as React from 'react';
import DiagramEditor from '../Widgets/DiagramEditor';
import TemplateBlock from './TemplateBlock';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';

interface Props {
  templates: Template[],
  onTemplatesChanged: () => void,
  deleteTemplate: (template: Template) => void
}
interface State {
  hiddenTemplatesMap: Map<string, boolean>,
}

const templateEditorPlumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' }
};

export default class TemplateEditor extends React.Component<Props, State> {
  private dragPlumbing: jsPlumbInstance;
  private templateConnectionsMap: Map<string, Connection[]>;
  private connectionTemplateMap: Map<string, Template[]>;

  constructor(props: Props) {
    super(props);

    this.renderTemplateBlocks = this.renderTemplateBlocks.bind(this);
    this.onDiagramClicked = this.onDiagramClicked.bind(this);
    this.onNewConnection = this.onNewConnection.bind(this);
    this.onDetachedConnection = this.onDetachedConnection.bind(this);
    this.render = this.render.bind(this);
    this.renderTemplateBlock = this.renderTemplateBlock.bind(this);
    this.renderTemplateLinks = this.renderTemplateLinks.bind(this);
    this.toggleTemplateBlockVisibility = this.toggleTemplateBlockVisibility.bind(this);
    this.deleteConnectionFromMaps = this.deleteConnectionFromMaps.bind(this);

    this.dragPlumbing = jsPlumb.getInstance();
    this.templateConnectionsMap = new Map();
    this.connectionTemplateMap = new Map();

    this.state = {
      hiddenTemplatesMap: new Map()
    }

    this.hideAllChildTemplates();
  }

  private hideAllChildTemplates() {
    const hiddenTemplatesMap = this.state.hiddenTemplatesMap;
    this.props.templates
      .forEach(template => hiddenTemplatesMap.set(template.id, false));

    // const childTemplates = this.props.templates.filter(template => {
    //   let isRoot = false;

    //   this.props.templates.forEach(temp => {
    //     isRoot = isRoot || temp.visualElements.indexOf(template) > -1;
    //   });

    //   return !isRoot;
    // });

    // childTemplates.forEach(template => hiddenTemplatesMap.set(template.id, true));
  }

  private toggleTemplateBlockVisibility(template: Template) {
    const hiddenTemplatesMap = this.state.hiddenTemplatesMap;

    if (hiddenTemplatesMap.get(template.id)) {
      hiddenTemplatesMap.set(template.id, false);
    } else {
      const exploredSubtree = [];
      let nextTemplate = template;
      let workingSet: Template[] = [];

      while (nextTemplate !== undefined) {
        exploredSubtree.push(nextTemplate);
        workingSet = workingSet.concat(nextTemplate.visualElements);
        nextTemplate = workingSet.pop();
      }

      exploredSubtree.forEach(t => hiddenTemplatesMap.set(t.id, true));
    }

    this.setState({ hiddenTemplatesMap });
  }

  private onDiagramClicked() {
    return;
  }

  private onDeleteTemplate(template: Template) {
    const connections = this.templateConnectionsMap.get(template.id);

    if (connections !== undefined) {
      // use copy of connections array, as elements are deleted in the following
      connections
        .map(d => d)
        .forEach(connection => {
          this.dragPlumbing.deleteConnection(connection);
          this.deleteConnectionFromMaps(connection);
        });
    }

    this.props.deleteTemplate(template);
  }

  private renderTemplateBlock(template: Template) {
    if (this.state.hiddenTemplatesMap.get(template.id)) {
      return null;
    }

    return (
      <TemplateBlock
        key={ template.id }
        dragPlumbing={ this.dragPlumbing }
        template={ template }
        toggleChildTemplate={ this.toggleTemplateBlockVisibility }
        delete={ () => this.onDeleteTemplate(template) }/>
    );
  }

  private renderTemplateBlocks(templates: Template[]) {
    return templates.map(this.renderTemplateBlock);
  }

  private saveConnectionToMaps(source: Template, target: Template, connection: Connection) {
    const templateMap = this.templateConnectionsMap;
    const connectionMap = this.connectionTemplateMap;

    if (templateMap.get(source.id) === undefined) {
      templateMap.set(source.id, [])
    }
    if (templateMap.get(target.id) === undefined) {
      templateMap.set(target.id, [])
    }
    if (connectionMap.get(connection.id) === undefined) {
      connectionMap.set(connection.id, []);
    }

    templateMap.get(source.id).push(connection);
    templateMap.get(target.id).push(connection);

    connectionMap.get(connection.id).push(source, target);
  }

  private deleteConnectionFromMaps(connection: Connection) {
    const templateMap = this.templateConnectionsMap;
    const connectionMap = this.connectionTemplateMap;

    // FIXME: connections drawn when mounting the component are not saved yet
    if (connectionMap.get(connection.id) === undefined) {
      return;
    }

    const source = connectionMap.get(connection.id)[0];
    const target = connectionMap.get(connection.id)[1];

    const sourceConnections = templateMap.get(source.id);
    const targetConnections = templateMap.get(target.id);
    const sourceIndex = sourceConnections.indexOf(connection);
    const targetIndex = targetConnections.indexOf(connection);
    sourceConnections.splice(sourceIndex, 1);
    targetConnections.splice(targetIndex, 1);

    connectionMap.delete(connection.id);
  }

  private onNewConnection(event: any) {
    if (event.source.parentNode.id === event.target) {
      return false;
    }

    const sourceTemplate = this.props.templates
      .find(template => template.id === event.source.parentNode.parentNode.id);

    const targetTemplate = this.props.templates
      .find(template => template.id === event.target.parentNode.id);

    if (sourceTemplate !== undefined && sourceTemplate.visualElements.indexOf(targetTemplate) === -1) {
      sourceTemplate.visualElements.push(targetTemplate);
      targetTemplate.parent = sourceTemplate;

      this.saveConnectionToMaps(sourceTemplate, targetTemplate, event.connection);
    }

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
  }

  private onDetachedConnection(event: any) {
    const connection: Connection = event.connection;

    const templates = this.connectionTemplateMap.get(connection.id);
    const sourceTemplate = templates[0];
    const targetTemplate = templates[1];

    const indexInSource = sourceTemplate.visualElements.indexOf(targetTemplate);
    sourceTemplate.visualElements.splice(indexInSource, 1);

    targetTemplate.parent = null;

    this.deleteConnectionFromMaps(event.connection);

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
  }

  private renderTemplateLinks(template: Template) {
    if (!(template instanceof CompositeTemplate)) {
      return;
    }

    template.visualElements.forEach(visualElement => {
      this.renderTemplateLinks(visualElement);

      // FIXME: endpoint positions
      const sourceSelector = document.querySelector(`#${template.id}`);
      const targetSelector = document.querySelector(`#${visualElement.id}`);

      const connection = this.dragPlumbing.connect({
        source: sourceSelector,
        target: targetSelector,
      });

      this.saveConnectionToMaps(template, visualElement, connection);
    });
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
        renderBlocks={ () => this.renderTemplateBlocks(this.props.templates) } />
    );
  }

  public componentDidMount() {
    this.props.templates.forEach(this.renderTemplateLinks.bind(this));
    window.setTimeout(() => this.dragPlumbing.repaintEverything(), 1000);
  }
}