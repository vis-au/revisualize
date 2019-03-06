import * as React from 'react';

import Pattern from '../../../Model/Pattern/Pattern';
import CustomScales from './CustomScales';

import './CustomBlocks.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}
interface State {
  isCustomBlockListVisible: boolean;
}

export default class CustomBlocks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCustomBlockListVisible: false
    };
  }

  public render() {
    return (
      <div id="patternSidebarCustomBlocks" className="patternSidebarGroup">
        <h3>Custom Blocks</h3>
        <CustomScales
          selectedPattern={ this.props.selectedPattern }
          updatePatternGraph={ this.props.updatePatternGraph }
        />
        {/* <CustomSignals
          selectedPattern={ this.props.selectedPattern }
          updatePatternGraph={ this.props.updatePatternGraph }
        /> */}
      </div>
    );
  }
}