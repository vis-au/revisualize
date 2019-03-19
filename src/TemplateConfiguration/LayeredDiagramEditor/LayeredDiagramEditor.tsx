import * as React from 'react';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/draggable';

import AddTemplateButton from './AddTemplateButton';
import AddTemplateButtonObserver from './AddTemplateButtonObserver';
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
  addTemplate: (template: Template) => void,
  deleteTemplate: (template: Template) => void
}
interface State {
  userDefinedLayerNumber: number;
}

const plumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' }
};

export default class LayeredDiagramEditor extends React.Component<Props, State> {
  private buttonObserver: AddTemplateButtonObserver;

  constructor(props: Props) {
    super(props);

    this.renderTemplate = this.renderTemplate.bind(this);

    this.buttonObserver = new AddTemplateButtonObserver();

    this.state = {
      userDefinedLayerNumber: 0
    }
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

  private renderLayerWidget(index: number) {
    return (
      <div className="layer">
        {/* <h2>{ index }</h2> */}
        <AddTemplateButton
          layer={ index }
          addTemplate={ this.props.addTemplate }
          buttonObserver={ this.buttonObserver }
        />
      </div>
    );
  }

  private renderLayerWidgets(numberOfLayers: number) {
    const layerWidgets: JSX.Element[] = [];

    for (let i = 0; i < numberOfLayers; i++) {
      layerWidgets.push(this.renderLayerWidget(i))
    }

    return (
      <div className="widgets">
        { layerWidgets }
      </div>
    );
  }

  private renderLayersLazy(numberOfLayers: number) {
    const layerMap = this.getTemplatesPerLayer();
    // to ensure the order in which the layers appear
    const layers: any[] = [];

    for (let i = 0; i < numberOfLayers; i++) {
      let templatesOnThatLayer = layerMap.get(i);
      if (templatesOnThatLayer === undefined) {
        templatesOnThatLayer = [];
      }
      layers.push(this.renderLayer(i, templatesOnThatLayer));
    }

    // layerMap.forEach((value, key) => {
    //   const nextLayer = this.renderLayer(key, value);
    //   layers.push([key, nextLayer]);
    // });

    // layers.sort((layerA, layerB) => {
    //   return layerA[0] - layerB[0];
    // });

    return (
      <div className="layers">
        { layers }
      </div>
    );
  }

  private renderLayersEager() {
    const layerMap = this.getTemplatesPerLayer();
    // to ensure the order in which the layers appear
    const layers: any[] = [];

    for (let i=3; i >= 0; i--) {
      const nextLayer = this.renderLayer(i, layerMap.get(i));
      layers.push(nextLayer);
    }

    return (
      <div className="layers">
        { layers }
      </div>
    );
  }

  private renderPlaceholderLayer(numberOfLayers: number) {
    return (
      <div className="layer">
        <AddTemplateButton
          layer={ numberOfLayers }
          addTemplate={ this.props.addTemplate }
          buttonObserver={ this.buttonObserver }
        />
      </div>
    );
  }

  public render() {
    let numberOfLayers = 0;
    const layerMap = this.getTemplatesPerLayer();

    layerMap.forEach((value, key) => {
      numberOfLayers++;
    });

    return (
      <div id={ this.props.id } className="layeredDiagramContainer" style={{ height: window.innerHeight - 75 }}>
        <div className="layeredDiagramEditor">
          <div className="column">
            { this.renderLayerWidgets(numberOfLayers) }
            { this.renderLayersLazy(numberOfLayers) }
          </div>
          <div className="column placeholder" style={{ height: window.innerHeight - 100 }}>
            { this.renderPlaceholderLayer(numberOfLayers) }
          </div>
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