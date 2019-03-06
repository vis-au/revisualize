import * as React from 'react';

import InteractionBuildingBlock from '../../BuildingBlocks/InteractionBuildingBlock';
import { DEFAULT_INTERACTION_ICONS, IconInteractionBlock } from '../../PatternConfiguration/PatternPresetValues';
import Toolbar from '../../Widgets/Toolbar';

import './InteractionToolbar.css';


interface State {
  activeOptionGroupType: string;
}

export default class InteractionToolbar extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeOptionGroupType: null
    };
  }

  private renderInteractionBlock(block: IconInteractionBlock) {
    return (
      <InteractionBuildingBlock
        id={ block.name }
        key={ block.name }
        className="interactionToolbarInteractionOption"
        interaction={ block.interaction }/>
    );
  }

  public render() {
    return (
      <Toolbar id="interactionToolbar">
        {/* { this.renderOptionsGroups('data') }
        { this.renderOptionsGroups('view') } */}

        { DEFAULT_INTERACTION_ICONS.map(this.renderInteractionBlock.bind(this)) }
      </Toolbar>
    );
  }
}