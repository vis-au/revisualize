import * as React from 'react';
import { Scale, Signal } from 'vega';

import BottomBarBuildingBlocks from '../BuildingBlocks/BottomBarBuildingBlocks';
import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import MiniPreview from './MiniPreview';

import './BottomBar.css';

interface Props {
  dataGraph: DataflowGraph;
  scales: Scale[];
  signals: Signal[];
  schema: any;
}

export default class BottomBar extends React.Component<Props, {}> {
  public render() {
    return (
      <footer id="bottomBar">
        <BottomBarBuildingBlocks
          dataGraph={ this.props.dataGraph }
          scales={ this.props.scales }
          signals={ this.props.signals }
        />
        <MiniPreview schema={ this.props.schema } />
      </footer>
    );
  }
}