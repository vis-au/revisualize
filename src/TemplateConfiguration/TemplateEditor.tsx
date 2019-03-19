import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb';
import * as React from 'react';

import LayeredDiagramEditor from './LayeredDiagramEditor/LayeredDiagramEditor';
import TemplateBlock from './TemplateBlock';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';

interface Props {
  templates: Template[],
  onTemplatesChanged: () => void,
  addTemplate: (template: Template) => void,
  deleteTemplate: (template: Template) => void
}
interface State {
  hiddenTemplatesMap: Map<string, boolean>,
  connectionTemplateMap: Map<string, Template[]>
}

const templateEditorPlumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' }
};

export default class TemplateEditor extends React.Component<Props, State> {
  private dragPlumbing: jsPlumbInstance;
  private templateConnectionsMap: Map<string, Connection[]>;

  constructor(props: Props) {
    super(props);

    this.renderTemplateBlocks = this.renderTemplateBlocks.bind(this);
    this.onDiagramClicked = this.onDiagramClicked.bind(this);
    this.onNewConnection = this.onNewConnection.bind(this);
    this.onConnectionMoved = this.onConnectionMoved.bind(this);
    this.onDetachedConnection = this.onDetachedConnection.bind(this);
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this);
    this.render = this.render.bind(this);
    this.renderTemplateBlock = this.renderTemplateBlock.bind(this);
    this.renderTemplateLinks = this.renderTemplateLinks.bind(this);
    this.toggleTemplateBlockVisibility = this.toggleTemplateBlockVisibility.bind(this);
    this.deleteConnectionFromMaps = this.deleteConnectionFromMaps.bind(this);
    this.renderTemplateLinks = this.renderTemplateLinks.bind(this)

    this.dragPlumbing = jsPlumb.getInstance();
    this.templateConnectionsMap = new Map();

    this.state = {
      hiddenTemplatesMap: new Map(),
      connectionTemplateMap: new Map()
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
          console.log('found one')
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
        level={ 0 }
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

      sourceTemplate.getFlatHierarchy().forEach(t => t.hierarchyLevel = -1);

      this.saveConnectionToMaps(sourceTemplate, targetTemplate, event.connection);
    }

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
  }

  private onConnectionMoved(event: any) {
    const connection: any = event.connection;
    const templates = this.state.connectionTemplateMap.get(connection.id);
    const connectionTemplateMap = this.state.connectionTemplateMap;

    const targetIndexInSource = templates[0].visualElements.indexOf(templates[1]);
    templates[0].visualElements.splice(targetIndexInSource, 1);
    templates[1].parent = null;

    this.deleteConnectionFromMaps(connection);

    const source = this.props.templates
      .find(template => template.id === connection.source.parentNode.parentNode.id);

    const target = this.props.templates
      .find(template => template.id === connection.target.parentNode.id);

    connectionTemplateMap.set(connection.id, [source, target]);

    this.dragPlumbing.repaintEverything();
    this.props.onTemplatesChanged();
    this.setState({ connectionTemplateMap });
  }

  private onDetachedConnection(event: any) {
    const connection: Connection = event.connection;

    const templates = this.state.connectionTemplateMap.get(connection.id);
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

  public shouldComponentUpdate() {
    return true;
  }

  public componentDidUpdate() {
    // this.props.templates
    //   .filter(template => {
    //     let connectionsInData = template.visualElements.length;

    //     if (template.parent !== null) {
    //       connectionsInData += 1;
    //     }

    //     const mapEntry = this.templateConnectionsMap.get(template.id);

    //     if (mapEntry === undefined) {
    //       return true;
    //     }

    //     const connectionsInView = mapEntry.length;

    //     return connectionsInData !== connectionsInView;
    //   })
    //   .forEach(this.renderTemplateLinks);
  }
}