import * as React from 'react';

import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import Pattern from '../Model/Pattern/Pattern';
import PatternGraph from '../Model/Pattern/PatternGraph';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import PatternDiagram from './Diagram/PatternDiagram';
import PatternSidebar from './Sidebar/PatternSidebar';
import PatternToolbar from './Toolbar/PatternToolbar';

import './PatternConfigurationView.css';
import ReusableBlocksComponent from './ReusableBlocks/ReusableBlocksComponent';


interface Props {
  activeTab: Tab;
  minimized?: boolean;
  patternGraph: PatternGraph;
  datasetGraph: DataflowGraph;
  onPatternGraphChanged: (patternGraph: PatternGraph) => void;
}
interface State {
  selectedPattern: Pattern;
}

export default class PatternConfigurationView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedPattern: null
    };
  }

  private selectPattern(pattern: Pattern) {
    if (this.state.selectedPattern === pattern) { return; }

    this.setState({
      selectedPattern: pattern
    });
  }

  private addPattern() {
    const newPattern = new Pattern(this.props.patternGraph);
    const patterns = this.props.patternGraph.patterns;

    patterns.push(newPattern);

    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private removePattern(pattern: Pattern) {
    if (this.state.selectedPattern === pattern) {
      this.setState({ selectedPattern: null });
    }

    // only delete pattern nodes here, links are deleted through dragPlumbing.deleteConnection
    // on click in the pattern block, which triggers the 'detachedconnection' events
    const patterns = this.props.patternGraph.patterns;
    const indexInPattern = patterns.indexOf(pattern);
    patterns.splice(indexInPattern, 1);

    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private updatePatternGraph() {
    this.props.patternGraph.patterns.forEach(pattern => pattern.update());
    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  public render() {
    return (
      <ViewContainer
        id="patternConfiguration"
        className={ this.props.minimized ? 'minimized' : '' }
        name="Patterns"
        activeContainerName={ this.props.activeTab.name }>

        <PatternToolbar />

        <div id="patternConfigurationBody">
          <PatternDiagram
            patternGraph={ this.props.patternGraph }
            selectedPattern={ this.state.selectedPattern }
            datasetGraph={ this.props.datasetGraph }
            selectPattern={ this.selectPattern.bind(this) }
            removePattern={ this.removePattern.bind(this) }
            updatePatternGraph={ this.updatePatternGraph.bind(this) }
          />
          <PatternSidebar
            selectedPattern={ this.state.selectedPattern }
            patternGraph={ this.props.patternGraph }
            datasetGraph={ this.props.datasetGraph }
            updatePatternGraph={ this.updatePatternGraph.bind(this) }
          />

          <button
            className="floatingAddButton"
            id="addNewPattern"
            onClick={ this.addPattern.bind(this) }>

            +
          </button>

          <ReusableBlocksComponent
            dataGraph={ this.props.datasetGraph }
            patternGraph={ this.props.patternGraph } />

        </div>
      </ViewContainer>
    );
  }
}