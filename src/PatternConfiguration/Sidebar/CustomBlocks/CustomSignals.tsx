import * as React from 'react';
import { Signal } from 'vega';

import SignalBuildingBlock from '../../../BuildingBlocks/SignalBuildingBlock';
import Pattern from '../../../Model/Pattern/Pattern';
import { isSignalRef } from '../../../VegaTypeChecker';

import './CustomSignals.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}
interface State {
  isCustomBlockListVisible: boolean;
}

export default class CustomSignals extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCustomBlockListVisible: false
    };
  }

  private addCustomSignalToPattern(signal: Signal) {
    this.props.selectedPattern.customSignals.push(signal);
    this.props.updatePatternGraph();
    this.setState({ isCustomBlockListVisible: false });
  }

  private onDeleteCustomSignal(signal: Signal) {
    if (this.props.selectedPattern.visualElement === null) { return; }

    const indexInCustomSignals = this.props.selectedPattern.customSignals.indexOf(signal);

    if (indexInCustomSignals === -1) { return; }

    this.props.selectedPattern.visualElement.bindings.forEach((value, key) => {
      if (isSignalRef(value) && value.signal === signal.name) {
        this.props.selectedPattern.visualElement.bindings.set(key, null);
      }
    });

    this.props.selectedPattern.customSignals.splice(indexInCustomSignals, 1);
    this.props.updatePatternGraph();
  }

  private renderCustomSignalInList(signal: Signal) {
    return (
      <li
        key={ signal.name }
        className="customBlock"
        onClick={ () => this.addCustomSignalToPattern(signal) }>

        { signal.name }
      </li>
    );
  }

  private renderActiveCustomSignal(signal: Signal) {
    return (
      <SignalBuildingBlock
        id={`${this.props.selectedPattern.id}CustomSignal${signal.name}`}
        key={`${this.props.selectedPattern.id}CustomSignal${signal.name}`}
        signal={ signal }
        onDelete={ () => this.onDeleteCustomSignal(signal) }
      />
    );
  }

  private renderActiveCustomSignals() {
    if (this.props.selectedPattern.customSignals.length === 0) {
      return <div className="unboundPropertyNotice">No custom signals</div>;
    }

    return (
      <div className="customOptionList">
        { this.props.selectedPattern.customSignals.map(this.renderActiveCustomSignal.bind(this)) }
      </div>
    );
  }

  private renderCustomSignalList() {
    if (!this.state.isCustomBlockListVisible) { return false; }

    const unusedSignals = this.props.selectedPattern.graph.globalSignals
      .filter(signal => this.props.selectedPattern.customSignals.indexOf(signal) === -1);

    return (
      <ul className="customBlockList">
        { unusedSignals.map(this.renderCustomSignalInList.bind(this)) }
      </ul>
    );
  }

  public render() {
    return (
      <div id="patternSidebarCustomSignals" >
        { this.renderActiveCustomSignals() }
        <button
          id="showCustomSignals"
          onClick={ () => this.setState({
                    isCustomBlockListVisible: !this.state.isCustomBlockListVisible
                  }) }>

          Variables
        </button>
        { this.renderCustomSignalList() }
      </div>
    );
  }
}