import * as React from 'react';

import Pattern from '../../Model/Pattern/Pattern';
import CustomBlocks from './CustomBlocks/CustomBlocks';
import DatasetComponent from './DatasetComponent';
import InteractionComponent from './InteractionComponent';
import LayoutComponent from './LayoutComponent';
import VisualElementComponent from './VisualElementComponent';

import './PatternSidebarBody.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}

export default class PatternSidebarBody extends React.Component<Props, {}> {
  public render() {
    if (this.props.selectedPattern === null) { return false; }

    return (
      <div id="patternSidebarBody" style={{maxHeight: window.innerHeight - 200}}>
        <VisualElementComponent
          selectedPattern={ this.props.selectedPattern }
          updatePatternGraph={ this.props.updatePatternGraph } />

        <div id="patternSidebarBuildingBlocks">
          <LayoutComponent
            selectedPattern={ this.props.selectedPattern }
            updatePatternGraph={ this.props.updatePatternGraph } />
          <DatasetComponent selectedPattern={ this.props.selectedPattern } />
          <InteractionComponent selectedPattern={ this.props.selectedPattern } />
          <CustomBlocks
            selectedPattern={ this.props.selectedPattern }
            updatePatternGraph={ this.props.updatePatternGraph } />
        </div>
      </div>
    );
  }
}