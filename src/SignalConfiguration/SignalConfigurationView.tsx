import * as React from 'react';
import { Signal } from 'vega';

import SignalBuildingBlock from '../BuildingBlocks/SignalBuildingBlock';
import PatternGraph from '../Model/Pattern/PatternGraph';
import SignalsSidebar from './Sidebar/SignalsSidebar';

import './SignalConfigurationView.css';

interface Props {
  patternGraph: PatternGraph;
  udpatePatternGraph: () => void;
}
interface State {
  selectedSignal: Signal;
}

export default class SignalConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedSignal: null
    };
  }

  private addSignal() {
    const newSignal: Signal = {
      name: 'new signal' + (Math.random() * 100 | 0)
    };

    const signals = this.props.patternGraph.globalSignals;

    signals.push(newSignal);
    this.props.udpatePatternGraph();
  }

  private deleteSignal(signal: any) {
    const signals = this.props.patternGraph.globalSignals;
    const indexInSignals = signals.indexOf(signal);
    signals.splice(indexInSignals, 1);

    this.props.udpatePatternGraph();
  }

  private updateSignal() {
    this.props.udpatePatternGraph();
  }

  private selectSignal(signal: any) {
    this.setState({ selectedSignal: signal });
  }

  private renderSignal(signal: any) {
    const className = `signalWrapper ${this.state.selectedSignal === signal ? 'selected' : ''}`;
    return (
      <div className={ className } onClick={ () => this.selectSignal(signal) }>
        <SignalBuildingBlock
          id={ `SignalConfiguration${signal.name}` }
          key={ signal.name }
          signal={ signal }
          disablePlumbing={ true }
          onDelete={ () => this.deleteSignal(signal) }
        />
      </div>
    );
  }

  private renderSignalsBody() {
    return (
      <article id="signalsBody">
        <div id="signalsList">
          { this.props.patternGraph.globalSignals.map(this.renderSignal.bind(this)) }

          <button
            className="floatingAddButton"
            id="newSignal"
            onClick={ this.addSignal.bind(this) }>
            +
          </button>
        </div>
      </article>
    );
  }

  public render() {
    return (
      <div id="signalComponent">
        <div id="signalComponentBody">
          <div id="signalCenterView">
            { this.renderSignalsBody() }
          </div>

          <SignalsSidebar
            selectedSignal={ this.state.selectedSignal }
            updateSignal={ this.updateSignal.bind(this) } />
        </div>
      </div>
    );
  }
}