import * as React from 'react';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/draggable';

import Template from '../../TemplateConfiguration/TemplateModel/Template';
import TemplateBlock from '../../TemplateConfiguration/TemplateBlock';

import './LayeredDiagramEditor.css';
import AddTemplateButton from './AddTemplateButton';

interface Props {
  id: string,
  dragPlumbing: any,
  templates: Template[],
  onNewConnection: (event: any) => void,
  onDetachedConnection: (event: any) => void,
  onConnectionMoved: (event: any) => void,
  deleteTemplate: (template: Template) => void
}
interface State {
}

const plumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' }
};

export default class LayeredDiagramEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.renderTemplate = this.renderTemplate.bind(this);
  }

  private configurePlumbing() {
    const plumbing = this.props.dragPlumbing;

    plumbing.bind('connection', (event: any) => this.props.onNewConnection(event));
    plumbing.bind('connectionDetached', (event: any) => this.props.onDetachedConnection(event));
    plumbing.bind('connectionMoved', (event: any) => this.props.onConnectionMoved(event));

    const container = document.querySelector(`#${this.props.id} .diagram`);

    plumbing.setContainer(container);
    plumbing.importDefaults(plumbingConfig);
  }

  private getTemplatesPerLayer(templates: Template[] = this.props.templates): Map<number, Template[]> {
    const templatePerLayerMap = new Map<number, Template[]>();

    templates.forEach(template => {
      const layer = template.getHierarchyLevel();

      if (templatePerLayerMap.get(layer) === undefined) {
        templatePerLayerMap.set(layer, []);
      }

      templatePerLayerMap.get(layer).push(template);
    });

    return templatePerLayerMap;
  }

  private renderTemplate(template: Template, layer: number) {
    return (
      <TemplateBlock
        key={ template.id }
        delete={ () => this.props.deleteTemplate(template) }
        dragPlumbing={ this.props.dragPlumbing }
        template={ template }
        level={ layer }
        toggleChildTemplate={ () => null }
      />
    );
  }

  private renderLayer(layerNumber: number, templatesOnLayer: Template[] = []) {
    const even = layerNumber % 2 === 0 ? 'even' : 'uneven';

    return (
      <div key={ layerNumber } className={ `layer ${even}` }>
        <div className="container">
          { templatesOnLayer.map(this.renderTemplate) }
        </div>
      </div>
    );
  }

  private renderTemplateSubtree(template: Template) {
    const templatesInSubtree = template.getFlatHierarchy();
    const layerMap = this.getTemplatesPerLayer(templatesInSubtree);
    const layers: any[][] = [];

    layerMap.forEach((value, key) => {
      const nextLayer = this.renderLayer(key, value);
      layers.push([key, nextLayer]);
    });

    layers.sort((layerA, layerB) => {
      return layerB[0] - layerA[0];
    });

    layers.sort((a, b) => a[0] - b[0]);

    return (
      <div className="templateGroup">
        { layers.map(l => l[1]) }
      </div>
    );
  }

  private renderTemplateSubtrees() {
    const rootTemplates = this.props.templates.filter(t => t.parent === null);

    return (
      <div className="templateGroups">
        { rootTemplates.map(this.renderTemplateSubtree.bind(this)) }
      </div>
    );
  }

  private renderLayerWidget(index: number) {
    return (
      <div className="layer">
        <h2>{ index }</h2>
        <AddTemplateButton />
      </div>
    );
  }

  private renderLayerWidgets() {
    const layerWidgets: JSX.Element[] = [];
    const layerMap = this.getTemplatesPerLayer();
    let numberOfLayers = 0;

    layerMap.forEach((value, key) => {
      numberOfLayers++;
    });

    for (let i = 0; i < numberOfLayers; i++) {
      layerWidgets.push(this.renderLayerWidget(i))
    }

    return (
      <div className="templateGroup widgets">
        { layerWidgets }
      </div>
    );
  }

  public render() {
    return (
      <div id={ this.props.id } className="layeredDiagramContainer" style={{ height: window.innerHeight - 75 }}>
        <div className="layeredDiagramEditor">
          { this.renderTemplateSubtrees() }
          { this.renderLayerWidgets() }
        </div>
      </div>
    );
  }

  private makeTemplatesSortable() {
    $(`#${this.props.id} .container`).sortable({
      placeholder: 'templatePlaceholder',
      handle: '.templateHeader',
    });

    // $(`#${this.props.id} .container .template`).draggable({
    //   // placeholder: 'templatePlaceholder',
    //   handle: '.templateHeader',
    //   containment: 'parent',
    //   zIndex: 100,
    //   drag: (event, ui) => {
    //     this.props.dragPlumbing.repaintEverything();
    //   },
    // });
  }

  public componentDidMount() {
    this.configurePlumbing();
  }

  public componentDidUpdate() {
    this.makeTemplatesSortable();
  }
}