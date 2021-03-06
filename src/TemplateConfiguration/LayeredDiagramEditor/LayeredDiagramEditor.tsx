import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import * as React from 'react';
import { Template } from 'remodel-vis';

import TemplateBlock from '../TemplateBlock/TemplateBlock';
import AddTemplateButton from './AddTemplateButton';
import AddTemplateButtonObserver from './AddTemplateButtonObserver';
import FullscreenTemplatePreview from './FullscreenTemplatePreview';

import './LayeredDiagramEditor.css';

interface Props {
  id: string,
  dragPlumbing: any,
  templates: Template[],
  focusedTemplate: Template,
  onNewConnection: (event: any) => void,
  onDetachedConnection: (event: any) => void,
  onConnectionMoved: (event: any) => void,
  addTemplate: (template: Template) => void,
  deleteTemplate: (template: Template) => void,
  focusTemplate: (template: Template) => void
}
interface State {
  hiddenTemplatesMap: Map<string, boolean>,
  userDefinedLayerNumber: number;
  collapsedLayers: number[];
  fullscreenPreviewTemplate: Template;
}

export default class LayeredDiagramEditor extends React.Component<Props, State> {
  private buttonObserver: AddTemplateButtonObserver;

  constructor(props: Props) {
    super(props);

    this.renderTemplate = this.renderTemplate.bind(this);
    this.toggleCollapseLayer = this.toggleCollapseLayer.bind(this);
    this.toggleFullscreenPreview = this.toggleFullscreenPreview.bind(this);
    this.onLayerClicked = this.onLayerClicked.bind(this);

    this.buttonObserver = new AddTemplateButtonObserver();

    this.state = {
      userDefinedLayerNumber: 0,
      collapsedLayers: [],
      hiddenTemplatesMap: new Map(),
      fullscreenPreviewTemplate: null
    }
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

  private toggleCollapseLayer(layerIndex: number) {
    const collapsedLayers = this.state.collapsedLayers;
    const indexInState = collapsedLayers.indexOf(layerIndex);

    if (indexInState === -1) {
      collapsedLayers.push(layerIndex);
    } else {
      collapsedLayers.splice(indexInState, 1);
    }

    this.setState({ collapsedLayers });
    window.setTimeout(this.props.dragPlumbing.repaintEverything, 500);
  }

  private toggleFullscreenPreview(template: Template) {
    if (this.state.fullscreenPreviewTemplate === template) {
      this.setState({
        fullscreenPreviewTemplate: null
      });
    } else {
      this.setState({
        fullscreenPreviewTemplate: template
      });
    }
  }

  private onLayerClicked() {
    this.props.focusTemplate(null);
  }

  private renderTemplate(template: Template, layer: number) {
    return (
      <TemplateBlock
        key={ template.id }
        dragPlumbing={ this.props.dragPlumbing }
        template={ template }
        level={ layer }
        focused={ template === this.props.focusedTemplate }
        focus={ () => this.props.focusTemplate(template) }
        delete={ () => this.props.deleteTemplate(template) }
        toggleChildTemplate={ () => null }
        toggleTemplateFullscreenPreview={ () => this.toggleFullscreenPreview(template) }
      />
    );
  }

  private renderLayerTopWidget(index: number) {
    return (
      <div className="layerWidgets top" key={ `topWidget${index}` }>
        {/* <h2>{ index }</h2> */}
        <AddTemplateButton
          layer={ index }
          addTemplate={ this.props.addTemplate }
          buttonObserver={ this.buttonObserver }
          right={ index === 0 }
        />
      </div>
    );
  }

  private renderTemplates(layerIndex: number, templatesOnLayer: Template[]) {
    return (
      <div className="templates">
        { templatesOnLayer.map(this.renderTemplate) }
      </div>
    );
  }

  private renderLayerBottomWidget(layerIndex: number) {
    let icon = 'unfold_less';
    let label = 'collapse'

    if (this.state.collapsedLayers.indexOf(layerIndex) > -1) {
      icon = 'unfold_more';
      label = 'expand';
    }

    return (
      <div className="layerWidgets bottom" key={ `bottomWidget${layerIndex}` }>
        <button onClick={ () => this.toggleCollapseLayer(layerIndex) }>
          <i className="icon material-icons">{ icon }</i>
          <span>{ label }</span>
        </button>
      </div>
    );
  }

  private renderLayer(layerIndex: number, templatesOnLayer: Template[] = []) {
    const even = layerIndex % 2 === 0 ? 'even' : 'uneven';
    const isCollapsed = this.state.collapsedLayers.indexOf(layerIndex) > -1 ? 'collapsed' : '';

    return (
      <div
        key={ `layer${layerIndex}` }
        className={ `layer ${even} ${isCollapsed}` }
        onClick={ this.onLayerClicked }>
        { this.renderLayerTopWidget(layerIndex) }
        { this.renderTemplates(layerIndex, templatesOnLayer) }
        { this.renderLayerBottomWidget(layerIndex) }
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

    return (
      <div className="layers">
        { layers }
      </div>
    );
  }

  private renderPlaceholderLayer(numberOfLayers: number) {
    return (
      <div className="layers">
        <div className="layer">
          <div className="layerWidgets top">
            <AddTemplateButton
              layer={ numberOfLayers }
              addTemplate={ this.props.addTemplate }
              buttonObserver={ this.buttonObserver }
              right={ false }
            />
          </div>
          <div className="templates" />
          <div className="layerWidgets bottom" />
        </div>
      </div>
    );
  }

  private renderFullscreenPreview() {
    return (
      <FullscreenTemplatePreview
        template={ this.state.fullscreenPreviewTemplate }
        visible={ this.state.fullscreenPreviewTemplate !== null }
        toggle={ this.toggleFullscreenPreview }
      />
    );
  }

  public render() {
    let numberOfLayers = 0;
    const layerMap = this.getTemplatesPerLayer();

    layerMap.forEach((value, key) => {
      numberOfLayers = Math.max(numberOfLayers, key + 1);
    });

    return (
      <div id={ this.props.id } className="layeredDiagramContainer">
        <div className="layeredDiagramEditor">
          <div className="column">
            { this.renderLayersLazy(numberOfLayers) }
          </div>
          <div className="column placeholder">
            { this.renderPlaceholderLayer(numberOfLayers) }
          </div>
        </div>
        { this.renderFullscreenPreview() }
      </div>
    );
  }

  private makeTemplatesSortable() {
    $(`#${this.props.id} .templates`).sortable({
      placeholder: 'templatePlaceholder',
      handle: '.templateHeader',
      sort: (event, ui) => {
        this.props.dragPlumbing.repaintEverything();
      },
      stop: (event, ui) => {
        this.props.dragPlumbing.repaintEverything();
      },

    });
  }

  public componentDidUpdate() {
    this.makeTemplatesSortable();
  }
}