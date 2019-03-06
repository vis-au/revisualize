import * as React from 'react';

import DataflowGraph from '../../Model/DataFlowGraph/DataflowGraph';
import Pattern from '../../Model/Pattern/Pattern';
import PatternGraph from '../../Model/Pattern/PatternGraph';
import Sidebar from '../../Widgets/Sidebar';
import PatternSidebarBody from './PatternSidebarBody';
import PatternSidebarTitle from './PatternSidebarTitle';

import './PatternSidebar.css';

interface Props {
  datasetGraph: DataflowGraph;
  selectedPattern: Pattern;
  patternGraph: PatternGraph;
  updatePatternGraph: () => void;
}

export default class PatternSidebar extends React.Component<Props, {}> {
  public render() {
    return (
      <Sidebar
        hidden={ this.props.selectedPattern === null }
        id="patternSidebar"
        height={ window.innerHeight - 110 }>

        <PatternSidebarTitle
          selectedPattern={ this.props.selectedPattern }
          updatePatternGraph={ this.props.updatePatternGraph }
        />

        <PatternSidebarBody
          selectedPattern={ this.props.selectedPattern }
          updatePatternGraph={ this.props.updatePatternGraph }
        />
      </Sidebar>
    );
  }
}