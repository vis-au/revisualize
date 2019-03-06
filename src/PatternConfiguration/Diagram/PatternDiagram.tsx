import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import * as React from 'react';

import UtilityFunctions from '../../UtilityFunctions';
import DataflowGraph from '../../Model/DataFlowGraph/DataflowGraph';
import { DataflowNode } from '../../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../../Model/DataFlowGraph/TransformNode';
import VisualElementFactory, { VisualElementType } from '../../Model/Elements/VisualElementFactory';
import LayoutFactory, { LayoutType } from '../../Model/Layouts/LayoutFactory';
import Pattern from '../../Model/Pattern/Pattern';
import PatternGraph from '../../Model/Pattern/PatternGraph';
import PatternLink from '../../Model/Pattern/PatternLink';
import DiagramEditor from '../../Widgets/DiagramEditor';
import PatternBlock from './PatternBlock';

import './PatternDiagram.css';

const patternDiagrarmPlumbingConfig = {
  Anchor: ['Left', 'Right'],
  Connector: [ 'Bezier', { stub: 5 } ],
  PaintStyle: { strokeWidth: 2, stroke: 'teal' },
  overlays: [
    'Arrow', [ 'Label', { label:'foo', location:0.25, id:'myLabel' } ]
  ],
};

interface Props {
  selectedPattern: Pattern;
  patternGraph: PatternGraph;
  datasetGraph: DataflowGraph;
  updatePatternGraph: () => void;
  selectPattern: (newPattern: Pattern) => void;
  removePattern: (pattern: Pattern) => void;
}

export default class PatternDiagram extends React.Component<Props, {}> {
  private dragPlumbing: jsPlumbInstance;
  private layoutFactory: LayoutFactory;
  private visualElementFactory: VisualElementFactory;

  constructor(props: Props) {
    super(props);

    this.layoutFactory = new LayoutFactory();
    this.visualElementFactory = new VisualElementFactory();

    this.dragPlumbing = jsPlumb.getInstance();
  }

  private selectPattern(pattern: Pattern, event?: any) {
    if (event !== undefined) { event.stopPropagation(); }
    if (pattern === this.props.selectedPattern) { return; }

    this.props.selectPattern(pattern);
  }

  private onNewConnection(event: any) {
    if (event.source.parentNode.id === event.target) {
      return false;
    }

    const link = new PatternLink();
    link.connection = event.connection;
    link.source = this.props.patternGraph.patterns
      .find(pattern => pattern.id === event.source.parentNode.id);
    link.target = this.props.patternGraph.patterns
      .find(pattern => pattern.id === event.target.parentNode.id);

    this.props.patternGraph.addLink(link);
    this.dragPlumbing.repaintEverything();
    this.props.updatePatternGraph();
  }

  private onDetachedConnection(event: any) {
    const link = this.props.patternGraph.links.find(l => l.connection === event.connection);

    this.props.patternGraph.removeLink(link);
    this.dragPlumbing.repaintEverything();
    this.props.updatePatternGraph();
  }

  private onDatasetDroppedOnPattern(pattern: Pattern, event: any) {
    const datasetID = event.drag.el.children[0].dataset.datasetid;
    const node: DataflowNode = this.props.datasetGraph.nodes.find(n => n.id === datasetID);

    if (node === undefined) {
      // throw new Error('Dropped dataset had unknown id');
      return false;
    }

    if (node instanceof DatasetNode) {
      pattern.dataset = node;
    } else if (node instanceof TransformNode) {
      pattern.dataset = node;
    }

    this.props.updatePatternGraph();
    this.dragPlumbing.repaintEverything();
    this.selectPattern(pattern);
    return true;
  }

  private onLayoutDroppedOnPattern(pattern: Pattern, event: any) {
    let layoutType: LayoutType = event.drag.el.children[0].dataset.layouttype;
    layoutType = UtilityFunctions.getValidDOMSelector(layoutType) as LayoutType;
    const layout = this.layoutFactory.getLayout(layoutType);

    if (layout === undefined) {
      // throw new Error('Dropped layout had unknown name');
      return false;
    }

    pattern.layout = layout;
    layout.pattern = pattern;

    this.props.updatePatternGraph();
    this.dragPlumbing.repaintEverything();
    this.selectPattern(pattern);
    return true;
  }

  private onVisualElementDroppedOnPattern(pattern: Pattern, event: any) {
    const visualElementType: VisualElementType = event.drag.el.children[0].dataset.visualelementtype;
    const visualElement = this.visualElementFactory.getVisualElement(visualElementType);

    if (visualElement === undefined) {
      return false;
    }

    pattern.visualElement = visualElement;
    this.props.updatePatternGraph();
    this.dragPlumbing.repaintEverything();
    this.selectPattern(pattern);
    return true;
  }

  private onInteractionDroppedOnBlock(pattern: Pattern, event: any) {
    // first child of dragged interaction block is span containing dataset with id
    const interactionID: string = event.drag.el.children[0].dataset.interactionid;
    const interactionProvider = this.props.patternGraph.interactions
      .find(i => i.id === interactionID);

    // interaction name was invalid / not found
    if (interactionProvider === undefined) {
      return false;
    }

    pattern.addInteraction(interactionProvider.interaction.provider);
    this.props.updatePatternGraph();
    this.dragPlumbing.repaintEverything();
    this.selectPattern(pattern);
    return true;
  }

  private renderPatternAsBlock(pattern: Pattern) {
    return (
      <PatternBlock
        key={ pattern.id }
        pattern={ pattern }
        dragPlumbing={ this.dragPlumbing }
        removePattern={ this.props.removePattern }
        onDatasetDropped={ event => this.onDatasetDroppedOnPattern(pattern, event) }
        onLayoutDropped={ event => this.onLayoutDroppedOnPattern(pattern, event) }
        onInteractionDropped={ event => this.onInteractionDroppedOnBlock(pattern, event) }
        onVisualElementDropped={ event => this.onVisualElementDroppedOnPattern(pattern, event) }
        selectPattern={ this.props.selectPattern }
        selectedPattern={ this.props.selectedPattern }
        updatePattern={ this.props.updatePatternGraph }
      />
    );
  }

  private renderBlocks() {
    return this.props.patternGraph.patterns.map(this.renderPatternAsBlock.bind(this));
  }

  public render() {
    return (
      <DiagramEditor
        id="patterndiagram"
        onNewConnection={ this.onNewConnection.bind(this) }
        onDetachedConnection={ this.onDetachedConnection.bind(this) }
        renderBlocks={ this.renderBlocks.bind(this) }
        dragPlumbing={ this.dragPlumbing }
        plumbingConfig={ patternDiagrarmPlumbingConfig }
        onDiagramClicked={ () => this.props.selectPattern(null) }>

        <div
          id="noPatternsNotice"
          className={ this.props.patternGraph.patterns.length === 0 ? '' : 'hidden' }
          style={{ height: window.innerHeight-300 }}>
          <span>Add a pattern with the button on the bottom right
            <i className="material-icons">subdirectory_arrow_left</i>
          </span>
        </div>
      </DiagramEditor>
    );
  }
}