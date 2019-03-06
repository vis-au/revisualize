import * as React from 'react';
import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../Model/DataFlowGraph/TransformNode';
import DatasetBuildingBlock from './DatasetBuildingBlock';

import './DatasetSelection.css';

interface Props {
  datasetGraph: DataflowGraph;
}

export default class DataflowNodeSelection extends React.Component<Props, {}> {
  private renderDatasetNode(node: DatasetNode) {
    const childNodes = this.props.datasetGraph.getChildNodes(node);

    return (
      <div key={ node.id } className="branch">
        <DatasetBuildingBlock
          id={ `ReusableDataset${node.id}` }
          className="root"
          node={ node }
        />
        <div className="availableDatasetChildNodes">
          { childNodes.map(this.renderTransformNode.bind(this)) }
        </div>
      </div>
    );
  }

  private renderTransformNode(node: TransformNode) {
    const childNodes = this.props.datasetGraph.getChildNodes(node);

    return (
      <div key={ node.id } className="branch">
        <DatasetBuildingBlock
          className="transform"
          id={ node.id }
          node={ node }
        />
        <div className="availableDatasetChildNodes">
          { childNodes.map(this.renderTransformNode.bind(this)) }
        </div>
      </div>
    );
  }

  private renderNoDatasetsNotice() {
    if (this.props.datasetGraph.nodes.length > 0) { return false; }

    return (
      <div id="noDatasetNotice">no datasets</div>
    );
  }

  public render() {
    const datasetNodes = this.props.datasetGraph.getDatasetNodes();

    return (
      <div id="datasetSelectionComponent">
        <h2>Datasets</h2>
        <div id="datasetSelectionList" >
          { datasetNodes.map(this.renderDatasetNode.bind(this)) }
        </div>
        { this.renderNoDatasetsNotice() }
      </div>
    );
  }
}