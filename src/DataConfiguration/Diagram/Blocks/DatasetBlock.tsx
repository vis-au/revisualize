import { jsPlumbInstance } from 'jsplumb';
import * as React from 'react';

import FieldBuildingBlock from '../../../BuildingBlocks/FieldBuildingBlock';
import DatasetNode from '../../../Model/DataModel/Datasets/DatasetNode';
import URLDatasetNode from '../../../Model/DataModel/Datasets/URLDatasetNode';
import GraphNode from '../../../Model/DataModel/GraphNode';
import Block from './Block';

import './DatasetBlock.css';

interface Props {
  node: DatasetNode;
  focusedNode: GraphNode;
  dragPlumbing: jsPlumbInstance;
  onClick: (event: any) => void;
  updateGraph: () => void;
}

export default class DatasetBlock extends React.Component<Props, {}> {

  private renderField(field: string) {
    return (
      <FieldBuildingBlock
        id={ field }
        key={ field }
        className="field"
        datasetName={ this.props.node.name || this.props.node.id }
        field={ field }
      />
    );
  }

  private renderBody() {
    return (
      <div className="fields">
        { this.props.node.fields.map(this.renderField.bind(this)) }
      </div>
    );
  }

  private renderFooter() {
    if (!(this.props.node instanceof URLDatasetNode)) {
      return null;
    }

    return (
      <div className="url">
        <span>{ this.props.node.url }</span>
      </div>
    );
  }

  public render() {
    return (
      <Block
        node={ this.props.node }
        focusedNode={ this.props.focusedNode }
        name={ this.props.node.name }
        body={ this.renderBody() }
        footer={ this.renderFooter() }
        onClick={ this.props.onClick }
        plumbing={ this.props.dragPlumbing }
        updateGraph={ this.props.updateGraph }
      />
    );
  }
}
