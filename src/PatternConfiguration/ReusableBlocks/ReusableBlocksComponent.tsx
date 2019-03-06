import * as React from 'react';

import DatasetSelection from '../../BuildingBlocks/DatasetSelection';
import InteractionProviderSelection from '../../BuildingBlocks/InteractionSelection';
import DataflowGraph from '../../Model/DataFlowGraph/DataflowGraph';
import PatternGraph from '../../Model/Pattern/PatternGraph';

import './ReusableBlocksComponent.css';


interface Props {
  dataGraph: DataflowGraph,
  patternGraph: PatternGraph
}
interface State {
  minimized: boolean
}

export default class ReusableBlocksComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      minimized: false
    };
  }

  private toggleMinimized() {
    this.setState({ minimized: !this.state.minimized });
  }

  public render() {
    return (
      <div id="reusableBlocks" className={ this.state.minimized ? 'minimized' : '' }>

        <div id="reusableBlocksToggle" className="toggleButtonWrapper" onClick={ this.toggleMinimized.bind(this) }>
          <button>^</button>
        </div>

        <div className={ this.state.minimized ? 'hidden' : '' }>
          <DatasetSelection datasetGraph={ this.props.dataGraph } />
          <InteractionProviderSelection providers={ this.props.patternGraph.interactions } />
        </div>
      </div>
    );
  }
}