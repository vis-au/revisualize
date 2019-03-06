import * as React from 'react';

import LayoutStructureBuildingBlock from '../../BuildingBlocks/LayoutStructureBuildingBlock';
import VisualElementBuildingBlock from '../../BuildingBlocks/VisualElementBuildingBlock';
import Toolbar from '../../Widgets/Toolbar';
import { DEFAULT_LAYOUT_ICONS, DEFAULT_MARK_ICONS, IconLayoutBlock, IconVisualElementBlock } from '../PatternPresetValues';

import './PatternToolbar.css';

export default class PatternToolbar extends React.Component<{}, {}> {
  private renderMarkBlock(block: IconVisualElementBlock) {
    // FIXME: visual element may not be defined
    if (block.visualElement === null) { return false; }

    return (
      <VisualElementBuildingBlock
        id={ block.name }
        key={ block.name }
        visualElement={ block.visualElement }
        className="patternToolbarMarkOption" />
    );
  }

  private renderLayoutBlock(block: IconLayoutBlock) {
    return (
      <LayoutStructureBuildingBlock
        id={ block.name }
        key={ block.name }
        layout={ block.layout }
        className="patternToolbarLayoutOption" />
    );
  }

  public render() {
    return (
      <Toolbar id="patternToolbar">
        <div id="patternToolbarVisualElements">
          <h2>Visual Elements</h2>
          { DEFAULT_MARK_ICONS.map(this.renderMarkBlock.bind(this)) }
        </div>
        <div id="patternToolbarLayouts">
          <h2>Layouts</h2>
          { DEFAULT_LAYOUT_ICONS.map(this.renderLayoutBlock.bind(this)) }
        </div>
      </Toolbar>
    );
  }
}