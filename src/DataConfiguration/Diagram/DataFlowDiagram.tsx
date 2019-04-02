import {jsPlumb, jsPlumbInstance} from 'jsplumb';
import * as React from 'react';

import DatasetNode from '../../Model/DataModel/Datasets/DatasetNode';
import GraphNode from '../../Model/DataModel/GraphNode';
import TransformNode from '../../Model/DataModel/Transforms/TranformNode';
import DiagramEditor from '../../Widgets/DiagramEditor';
import DatasetBlock from './Blocks/DatasetBlock';
import TransformBlock from './Blocks/TransformBlock';

import './DataFlowDiagram.css';


const dataflowDiagramPlumbingConfig = {
  Anchor: ['Left'],
  Connector: [ 'Flowchart', { stub: 25, cornerRadius: 1 } ],
  Endpoint: [ 'Dot', {'fill': 'steelblue', radius: 5} ],
  EndpointStyle: { fill: 'steelblue' },
  PaintStyle: {
    stroke: 'steelblue',
    strokeWidth: 2,
  },
};

interface Props {
  datasets: GraphNode[];
  focusedNode: GraphNode;
  selectFocusedNode: (newNode: GraphNode) => void;
  deselectFocusedNode: () => void;
  updateGraph: () => void;
}

export default class DataFlowDiagram extends React.Component<Props, {}> {
  private dragPlumbing: jsPlumbInstance;

  constructor(props: Props) {
    super(props);

    this.dragPlumbing = jsPlumb.getInstance();
  }

  private onNewConnection(event: any) {
    // const newLink = new DatasetLink();
    // newLink.connection = event.connection;

    // // source can either be a dataset or transform node, so id is stored in different elements
    // const sourceNode = this.props.datasets.find(node => {
    //   return node.id === event.source.parentNode.id || node.id === event.source.id;
    // });

    // this.props.updateGraph();
  }

  private onConnectionMoved(event: any) {
    this.props.updateGraph();
  }

  private onDetachedConnection(event: any) {
    this.props.updateGraph();
  }

  private onNodeChanged() {
    // flowsplumging is not set up on element creation, therefore check if undefined here
    if (this.dragPlumbing !== undefined) {
      this.dragPlumbing.repaintEverything();
    }

    this.props.updateGraph();
  }

  private renderTransformBlock(node: TransformNode) {
    return (
      <TransformBlock
        node={ node }
        key={ node.id }
        dragPlumbing={ this.dragPlumbing }
        focusedNode={ this.props.focusedNode }
        updateGraph={ this.props.updateGraph }
        onClick={ this.props.selectFocusedNode.bind(this) }
        onNodeChanged={ this.onNodeChanged.bind(this) } />
    );
  }

  private renderDatasetBlock(node: DatasetNode) {
    return (
      <DatasetBlock
        node={ node }
        key={ node.id }
        dragPlumbing={ this.dragPlumbing }
        focusedNode={ this.props.focusedNode }
        updateGraph={ this.props.updateGraph }
        onClick={ this.props.selectFocusedNode.bind(this) } />
    );
  }

  private renderNodesAsBlocks() {
    return this.props.datasets.map(node => {
      if (node instanceof TransformNode) {
        return this.renderTransformBlock(node);
      } else if (node instanceof DatasetNode) {
        return this.renderDatasetBlock(node);
      }
    });
  }

  public render() {
    return (
      <DiagramEditor
        id="data_flow"
        dragPlumbing={ this.dragPlumbing }
        plumbingConfig={ dataflowDiagramPlumbingConfig }
        onNewConnection={ this.onNewConnection.bind(this) }
        onConnectionMoved={ this.onConnectionMoved.bind(this) }
        onDetachedConnection={ this.onDetachedConnection.bind(this) }
        onDiagramClicked={ this.props.deselectFocusedNode.bind(this) }
        renderBlocks={ this.renderNodesAsBlocks.bind(this) }
      />
    );
  }
}
