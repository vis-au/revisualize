import * as React from 'react';
import { Scale } from 'vega';

import ScaleBuildingBlock from '../BuildingBlocks/ScaleBuildingBlock';
import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import PatternGraph from '../Model/Pattern/PatternGraph';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import ScaleSidebar from './Sidebar/ScaleSidebar';

import './ScaleConfigurationView.css';

interface Props {
  activeTab: Tab;
  dataGraph: DataflowGraph;
  patternGraph: PatternGraph;
  onPatternGraphChanged: (patternGraph: PatternGraph) => void;
}
interface State {
  customScales: number;
  selectedScale: Scale;
}

export default class ScaleConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      customScales: 0,
      selectedScale: null
    };
  }

  private addScale() {
    const scales = this.props.patternGraph.globalScales;
    const newScale: Scale = {
      name: `unnamed${this.state.customScales}`
    };

    scales.push(newScale);

    this.setState({ customScales: this.state.customScales + 1 });
    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private updateScales() {
    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private deleteScale(scale: Scale) {
    const scales = this.props.patternGraph.globalScales;
    const indexInScales = scales.indexOf(scale);
    scales.splice(indexInScales, 1);

    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private selectScale(event: any, scale: Scale) {
    event.stopPropagation();

    if (scale === this.state.selectedScale) {
      this.setState({ selectedScale: null });
    } else {
      this.setState({ selectedScale: scale });
    }
  }

  private renderScale(scale: Scale) {
    return (
      <div
        key={ scale.name }
        className="scaleWrapper"
        onClick={e => this.selectScale(e, scale) }>

        <ScaleBuildingBlock
          id={ `scaleConfigurationScale${scale.name}` }
          className={ scale === this.state.selectedScale ? 'selected' : '' }
          scale={ scale }
          disablePlumbing={ true }
          onDelete={ () => this.deleteScale(scale) } />
      </div>
    );
  }

  private renderScales() {
    return this.props.patternGraph.globalScales.map(this.renderScale.bind(this));
  }

  public render() {
    return (
      <ViewContainer
        id="scalesContainer"
        name="Scales"
        activeContainerName={ this.props.activeTab.name }>

        <div id="scales" onClick={ () => this.setState({ selectedScale: null }) }>
          { this.renderScales() }
          <button
            id="addNewScale"
            onClick={ this.addScale.bind(this) }
            className="floatingAddButton">

            +
          </button>
        </div>
        <ScaleSidebar
          dataGraph={ this.props.dataGraph }
          selectedScale={ this.state.selectedScale }
          updateSelectedScale={ this.updateScales.bind(this) }
        />
      </ViewContainer>
    );
  }
}