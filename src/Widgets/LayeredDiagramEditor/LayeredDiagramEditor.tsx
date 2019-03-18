import * as React from 'react';

import Template from '../../TemplateConfiguration/TemplateModel/Template';
import TemplateBlock from '../../TemplateConfiguration/TemplateBlock';

import './LayeredDiagramEditor.css';

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

    // this.addZoomBehavior();
  }

  private getTemplatesPerLayer(): Map<number, Template[]> {
    const templatePerLayerMap = new Map<number, Template[]>();

    this.props.templates.forEach(template => {
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

  private renderLayer(layerNumber: number, templatesOnLayer: Template[]) {
    const even = layerNumber % 2 === 0 ? 'even' : 'uneven';

    return (
      <div key={ layerNumber } className={ `layer ${even}` }>
        <h2>{ layerNumber }</h2>
        <div className="templateContainer">
          { templatesOnLayer.map(this.renderTemplate) }
        </div>
      </div>
    );
  }

  private renderLayers() {
    const layerMap = this.getTemplatesPerLayer();
    // to ensure the order in which the layers appear
    const layers: any[][] = [];

    layerMap.forEach((value, key) => {
      const nextLayer = this.renderLayer(key, value);
      layers.push([key, nextLayer]);
    });

    layers.sort((layerA, layerB) => {
      return layerB[0] - layerA[0];
    });

    const emptyLayer = this.renderLayer(layers.length, []);
    layers.unshift([layers.length, emptyLayer]);

    return layers.map(l => l[1]);
  }

  public render() {
    return (
      <div id={ this.props.id } className="layeredDiagramContainer" style={{ height: window.innerHeight - 75 }}>
        <div className="layeredDiagramEditor">
          { this.renderLayers() }
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.configurePlumbing();
  }
}