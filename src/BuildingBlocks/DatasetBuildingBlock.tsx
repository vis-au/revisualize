import * as React from 'react';

import { plumbingProvider } from '../PlumbingProvider';
import { DataflowNode } from '../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import BuildingBlock from './BuildingBlock';

import './DatasetBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  node: DataflowNode;
  onDelete?: (event: any) => void;
}

export default class DatasetBuildingBlock extends React.Component<Props, {}> {
  public render() {
    const icon = this.props.node instanceof DatasetNode ? 'storage' : 'merge_type';

    return <BuildingBlock
      id={ this.props.id }
      className={ `${this.props.className} dataset` }
      plumbing={ plumbingProvider.datasetPlumbing }
      onDelete={ this.props.onDelete }>

      <span data-datasetid={ this.props.node.id } />

      <i className="material-icons icon">{ icon }</i>
      { this.props.node.name }
    </BuildingBlock>;
  }
}