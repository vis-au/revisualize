import * as React from 'react';

import DatasetBuildingBlock from '../../BuildingBlocks/DatasetBuildingBlock';
import DropArea from '../../BuildingBlocks/DropArea';
import InteractionBuildingBlock from '../../BuildingBlocks/InteractionBuildingBlock';
import LayoutStructureBuildingBlock from '../../BuildingBlocks/LayoutStructureBuildingBlock';
import VisualElementBuildingBlock from '../../BuildingBlocks/VisualElementBuildingBlock';
import { plumbingProvider } from '../../PlumbingProvider';
import InteractionProvider from '../../Model/Interactions/InteractionProvider';
import Pattern from '../../Model/Pattern/Pattern';
import PatternPreview from './PatternPreview';

import './PatternBlock.css';

interface Props {
  pattern: Pattern;
  dragPlumbing: any;
  selectedPattern: Pattern;
  selectPattern: (pattern: Pattern) => void;
  removePattern: (pattern: Pattern) => void;
  updatePattern: () => void;
  onDatasetDropped: (pattern: Pattern, event: any) => boolean;
  onLayoutDropped: (pattern: Pattern, event: any) => boolean;
  onVisualElementDropped: (pattern: Pattern, event: any) => boolean;
  onInteractionDropped: (pattern: Pattern, event: any) => boolean;
}

export default class PatternBlock extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    setTimeout(this.addPlumbing.bind(this), 0);
  }

  private addPlumbing() {
    const bodySelector = document.querySelector(`#${this.props.pattern.id} .body`);
    const plumbingConfig = {
      paintStyle: { fill: 'teal', radius: 5 },
      foldBack: 1,
      connectorOverlays: [
        ['Arrow', { width: 15, length: 15, location: 1, id: 'arrow' }]
      ]
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
    this.props.dragPlumbing.makeSource(bodySelector, plumbingConfig, sourceConfig);

    this.props.dragPlumbing.draggable(this.props.pattern.id, {
      filter: '.body,.body *'
    });
  }

  private deletePlumbing() {
    // find all connections, since those use different endpoints than the one added on creation
    const connections = this.props.dragPlumbing
      .getAllConnections()
      .filter((c: any) => {
        const e = c.getAttachedElements();
          const isSource = e[0].element.parentNode.id === this.props.pattern.id;
          const isTarget = e[1].element.parentNode.id === this.props.pattern.id;
          return isSource || isTarget;
        });

    connections.forEach((c: any) => this.props.dragPlumbing.deleteConnection(c));
  }

  private onDeletePattern(event: any) {
    event.stopPropagation();
    this.deletePlumbing();
    this.props.removePattern(this.props.pattern);
  }

  private onDeleteVisualElement() {
    this.props.pattern.visualElement = null;
    this.props.updatePattern();
  }

  private onDeleteLayoutStructure() {
    this.props.pattern.layout = null;
    this.props.updatePattern();
  }

  private onDeleteDataset() {
    this.props.pattern.dataset = null;
    this.props.updatePattern();
  }

  private onDeleteInteraction(provider: InteractionProvider) {
    this.props.pattern.removeInteraction(provider);
    this.props.updatePattern();
  }

  private onClickPattern(event: any) {
    event.stopPropagation();
    this.props.selectPattern(this.props.pattern);
  }

  private renderPreview() {
    return (
      <PatternPreview
        pattern={ this.props.pattern }
        onResize={ this.props.dragPlumbing.repaintEverything }
      />
    );
  }

  private renderDatasource() {
    if (this.props.pattern.dataset === null) {
      return (
        <div className="patternNoDataset">
          <DropArea
            className="patternDatasetDropArea"
            id={ `dataDropArea_${this.props.pattern.id}` }
            onDrop={ this.props.onDatasetDropped }
            plumbing={ plumbingProvider.datasetPlumbing }
          />
          <div className="unboundNotice">no data</div>
        </div>
      );
    }

    return (
      <DatasetBuildingBlock
        id={ `patternDatasetBuildingBlock${this.props.pattern.id}` }
        node={ this.props.pattern.dataset }
        onDelete={ this.onDeleteDataset.bind(this) }
      />
    );
  }

  private renderVisualElement() {
    if (this.props.pattern.visualElement === null) {
      return (
        <div className="patternNoVisualElement">
          <DropArea
            className="visualElementDropArea"
            id={ `visualElementDropArea_${this.props.pattern.id}` }
            plumbing={ plumbingProvider.visualElementPlumbing }
            onDrop={ this.props.onVisualElementDropped }
          />
          <div className="unboundNotice">no visual</div>
        </div>
      );
    }

    return (
      <VisualElementBuildingBlock
        id={ `patternVisualElementBuildingBlock${this.props.pattern.id}` }
        className="visualElementBuildingBlock"
        visualElement={ this.props.pattern.visualElement }
        onDelete={ this.onDeleteVisualElement.bind(this) }
      />
    );
  }

  private renderLayoutStructure() {
    if (this.props.pattern.layout === null) {

      return (
        <div className="patternNoLayout">
          <DropArea
            id={ `layoutDropArea_${this.props.pattern.id}` }
            className="layoutDropArea"
            onDrop={ this.props.onLayoutDropped }
            plumbing={ plumbingProvider.layoutPlumbing }
          />
          <div className="unboundNotice">no layout</div>
        </div>
      );
    }

    return (
      <LayoutStructureBuildingBlock
        id={ `patternLayoutBuildingBlock${this.props.pattern.id}` }
        className="patternLayoutBuildingBlock"
        layout={ this.props.pattern.layout}
        onDelete={ this.onDeleteLayoutStructure.bind(this) }
      />
    );
  }

  private renderInteraction(provider: InteractionProvider) {
    return (
      <InteractionBuildingBlock
        id={ `${this.props.pattern.id}Interaction${provider.name}` }
        key={ `${this.props.pattern.id}Interaction${provider.name}` }
        interaction={ provider.interaction }
        onDelete={ () => this.onDeleteInteraction(provider) } />
    );
  }

  private renderInteractions() {
    return (
      <div
        id={ `patternInteractions${this.props.pattern.id}` }>

        <DropArea
          id={ `interactionDropArea_${this.props.pattern.id}` }
          className="interactionDropArea"
          onDrop={ this.props.onInteractionDropped }
          plumbing={ plumbingProvider.interactionPlumbing }/>

        {
          this.props.pattern.interactionProviders.length === 0
            ? <div className="unboundNotice">no interactions</div>
            : false
        }

        { this.props.pattern.interactionProviders.map(this.renderInteraction.bind(this)) }
      </div>
    );
  }

  public render() {
    return (
      <div
        id={ this.props.pattern.id }
        className={ `pattern ${this.props.selectedPattern === this.props.pattern ? ' focus' : '' }` }
        onClick={ this.onClickPattern.bind(this) }>

        <div className="patternHeader">
          <h2 className="draggable">{ this.props.pattern.name }</h2>
          <div className="dataSource">{ this.renderDatasource() }</div>
          <div className="delete" onClick={ this.onDeletePattern.bind(this) } />
        </div>
        <div className="body">
          { this.renderPreview() }
          <div className="patternBuildingBlocks">
            <div className="visualElementContainer">{ this.renderVisualElement() }</div>
            <div className="layoutContainer">{ this.renderLayoutStructure() }</div>
            <div className="interactionContainer">{ this.renderInteractions() }</div>
          </div>
        </div>
      </div>
    );
  }
}