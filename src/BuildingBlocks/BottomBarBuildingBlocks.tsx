import * as React from 'react';

import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../Model/DataFlowGraph/TransformNode';
import UtilityFunctions from '../UtilityFunctions';
import DatasetBuildingBlock from './DatasetBuildingBlock';
import ScaleBuildingBlock from './ScaleBuildingBlock';
import SignalBuildingBlock from './SignalBuildingBlock';

import './BottomBarBuildingBlocks.css';

interface Props {
  dataGraph: DataflowGraph;
  scales: any[];
  signals: any[];
  focusedBlock?: string;
}
interface State {
  focusedBlock: string;
}

export default class BottomBarBuildingBlocks extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      focusedBlock: null
    };
  }

  private focusBlock(blockName: string) {
    if (this.state.focusedBlock === blockName) {
      this.setState({ focusedBlock: null });
    } else {
      this.setState({ focusedBlock: blockName });
    }
  }

  private isHidden(blockName: string) {
    return this.state.focusedBlock === blockName ? '' : 'hidden';
  }

  private isFocused(blockName: string) {
    return this.state.focusedBlock === blockName ? 'focus' : '';
  }

  private renderDatasetNode(node: DatasetNode) {
    return (
      <DatasetBuildingBlock
        key={ node.id }
        id={ node.id }
        className="reusableBlockList"
        node={ node }
      />
    );
  }

  private renderLeafNode(node: TransformNode) {
    return (
      <DatasetBuildingBlock
        key={ node.id }
        className="reusableBlockList node leaf"
        id={ node.id }
        node={ node }
      />
    );
  }

  private renderCustomLabelNode(node: TransformNode) {
    return (
      <DatasetBuildingBlock
        key={ node.id }
        className="reusableBlockList node custom"
        id={ node.id }
        node={ node }
      />
    );
  }

  private renderReusableNodesFromDataGraph() {
    const validNodes = this.props.dataGraph.getFunctionalNodesConnectedToAnyDataset();
    const leafNodes = this.props.dataGraph.getLeafNodes();

    const validLeafNodes = validNodes.filter(node => leafNodes.indexOf(node) > -1);
    const validLabelledNodes = validNodes.filter(node => node.name !== null);
    const datasetNodes = this.props.dataGraph.nodes.filter(node => node.type === 'dataset');

    return (
      <div key="reusableNodes" id="reusableNodes">
        <h2
          className={ this.isFocused('nodes') }
          onClick={ () => this.focusBlock('nodes') }>
          Data
        </h2>
        <div className={ 'buildingBlockList ' + this.isHidden('nodes') } >
          { datasetNodes.map(this.renderDatasetNode.bind(this)) }
          {/* { validLabelledNodes.map(this.renderCustomLabelNode.bind(this)) } */}
          { validLeafNodes.map(this.renderLeafNode.bind(this)) }
        </div>
      </div>
    );
  }

  private renderScale(scale: any) {
    return (
      <ScaleBuildingBlock
        key={ scale.name }
        id={ scale.name.split(' ').join('') }
        className="reusableBlockList"
        scale={ scale }
      />
    );
  }

  private renderScales() {
    return (
      <div key="reusableScales" id="reusableScales">
        <h2
          className={ this.isFocused('scales') }
          onClick={ () => this.focusBlock('scales') }>
          Scales
        </h2>
        <div className={ 'buildingBlockList ' + this.isHidden('scales') } >
          { this.props.scales.map(this.renderScale.bind(this)) }
        </div>
      </div>
    );
  }

  private renderSignal(signal: any) {
    return (
      <SignalBuildingBlock
        key={ signal.name }
        id={ UtilityFunctions.getRandomID() }
        className="reusableBlockList signal"
        signal={ signal }
      />
    );
  }

  private renderSignals() {
    return (
      <div key="reusableSignals" id="reusableSignals">
        <h2
          className={ this.isFocused('signals') }
          onClick={ () => this.focusBlock('signals') }>
          Signals
        </h2>
        <div className={ 'buildingBlockList ' + this.isHidden('signals') } >
          { this.props.signals.map(this.renderSignal.bind(this)) }
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div id="reusableBlocks">
        {/* { this.renderSignals() } */}
        { this.renderReusableNodesFromDataGraph() }
        {/* { this.renderScales() } */}
      </div>
    );
  }
}