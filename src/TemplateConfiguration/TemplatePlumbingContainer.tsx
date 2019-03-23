import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb';
import * as React from 'react';

import LayeredDiagramEditor from './LayeredDiagramEditor/LayeredDiagramEditor';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';

interface Props {
  templates: Template[],
  onTemplatesChanged: () => void,
  addTemplate: (template: Template) => void,
  deleteTemplate: (template: Template) => void
}
interface State {
  connectionTemplateMap: Map<string, Template[]>
}

const templateEditorPlumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' },
  overlays: [
    'Arrow', [ 'Label', { label:'foo', location:0.25, id:'myLabel' } ]
  ],
};

export default class TemplatePlumbingContainer extends React.Component<Props, State> {
  private dragPlumbing: jsPlumbInstance;
  private templateConnectionsMap: Map<string, Connection[]>;

  constructor(props: Props) {
    super(props);

    this.onNewConnection = this.onNewConnection.bind(this);
    this.onConnectionMoved = this.onConnectionMoved.bind(this);
    this.onDetachedConnection = this.onDetachedConnection.bind(this);
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this);
    this.render = this.render.bind(this);
    this.renderTemplateLinks = this.renderTemplateLinks.bind(this);
    this.deleteConnectionFromMaps = this.deleteConnectionFromMaps.bind(this);

    this.dragPlumbing = jsPlumb.getInstance();
    this.templateConnectionsMap = new Map();

    this.state = {
      connectionTemplateMap: new Map()
    }

    window.addEventListener('resize', () => this.dragPlumbing.repaintEverything());
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

  private saveConnectionToMaps(source: Template, target: Template, connection: Connection) {
    const templateMap = this.templateConnectionsMap;
    const connectionMap = this.state.connectionTemplateMap;

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
    const connectionMap = this.state.connectionTemplateMap;

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

  private findTemplateInDomParents(domElement: HTMLElement) {
    let exploredLevels = 0;
    let workingNode = domElement;

    while (!workingNode.classList.contains('template') && exploredLevels < 10) {
      workingNode = workingNode.parentNode as HTMLElement;
      exploredLevels++;
    }

    return workingNode;
  }

  private onNewConnection(info: any, originalEvent?: any) {
    if (info.source.parentNode.id === info.target) {
      return false;
    }

    let sourceHtmlNode = this.findTemplateInDomParents(info.source);
    let targetHtmlNode = this.findTemplateInDomParents(info.target);

    let sourceTemplate = this.props.templates
      .find(template => template.id === sourceHtmlNode.id);

    let targetTemplate = this.props.templates
      .find(template => template.id === targetHtmlNode.id);

    if (sourceTemplate !== undefined) {
      if (originalEvent !== undefined && sourceTemplate.visualElements.indexOf(targetTemplate) === -1) {
        sourceTemplate.visualElements.push(targetTemplate);
        targetTemplate.parent = sourceTemplate;

        sourceTemplate.getFlatHierarchy().forEach(t => t.hierarchyLevel = -1);
        targetTemplate.getFlatHierarchy().forEach(t => t.hierarchyLevel = -1);
      }

      this.saveConnectionToMaps(sourceTemplate, targetTemplate, info.connection);
    }

    this.dragPlumbing.repaintEverything();

    // jsplumb original event undefined --> conenctions was created programmatically and not by the
    // user, which means that a preset was added, therefore the state must not be updated
    if (originalEvent !== undefined) {
      this.props.onTemplatesChanged();
    }
  }

  private onConnectionMoved(info: any, originalEvent?: any) {
    const connection: any = info.connection;
    const templates = this.state.connectionTemplateMap.get(connection.id);

    const targetIndexInSource = templates[0].visualElements.indexOf(templates[1]);

    if (targetIndexInSource === -1) {
      return;
    }

    templates[0].visualElements.splice(targetIndexInSource, 1);
    templates[1].parent = null;

    this.deleteConnectionFromMaps(connection);
  }

  private onDetachedConnection(info: any, originalEvent?: any) {
    const connection: Connection = info.connection;

    const templates = this.state.connectionTemplateMap.get(connection.id);
    const sourceTemplate = templates[0];
    const targetTemplate = templates[1];

    const indexInSource = sourceTemplate.visualElements.indexOf(targetTemplate);
    sourceTemplate.visualElements.splice(indexInSource, 1);

    targetTemplate.parent = null;

    this.deleteConnectionFromMaps(info.connection);

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
  }

  private renderTemplateLinks(template: Template) {
    if (!(template instanceof CompositeTemplate)) {
      return;
    }

    template.visualElements.forEach(visualElement => {
      // FIXME: endpoint positions
      const sourceSelector = document.querySelector(`#ve${visualElement.id}`);
      const targetSelector = document.querySelector(`#${visualElement.id} .body`);

      (this.dragPlumbing as any).connect({
        source: sourceSelector,
        target: targetSelector,
        endpointStyle: { fill: 'teal', radius: 5 }
      });
    });
  }

  public render() {
    return (
      <LayeredDiagramEditor
        id={ 'layeredTemplateDiagramEditor' }
        templates={ this.props.templates }
        addTemplate={ this.props.addTemplate }
        deleteTemplate={ this.onDeleteTemplate }
        onConnectionMoved={ this.onConnectionMoved }
        onDetachedConnection={ this.onDetachedConnection }
        onNewConnection={ this.onNewConnection }
        dragPlumbing={ this.dragPlumbing } />
    );
  }

  public componentDidMount() {
    this.props.templates
      .filter(t => t.parent === null)
      .forEach(this.renderTemplateLinks);

    window.setTimeout(() => this.dragPlumbing.repaintEverything(), 1000);
  }

  public componentDidUpdate() {
    this.props.templates
      .filter(template => {
        let connectionsInData = template.visualElements.length;

        if (template.parent !== null) {
          connectionsInData += 1;
        }

        const mapEntry = this.templateConnectionsMap.get(template.id);

        if (mapEntry === undefined) {
          return true;
        }

        const connectionsInView = mapEntry.length;

        return connectionsInData > connectionsInView;
      })
      .forEach(this.renderTemplateLinks);

    this.dragPlumbing.repaintEverything();
  }
}