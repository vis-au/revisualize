import * as React from 'react';
import { Scale } from 'vega';

import ScaleBuildingBlock from '../../BuildingBlocks/ScaleBuildingBlock';
import Pattern from '../../Model/Pattern/Pattern';

import './LayoutComponent.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}

export default class LayoutComponent extends React.Component<Props, {}> {

  private onScaleDomainChanged() {
    this.props.updatePatternGraph();
  }

  private renderLayoutScale(scale: Scale) {
    return <ScaleBuildingBlock
      key={`sidebarScale${scale.name}`}
      id={`sidebarScale${scale.name}`}
      className="patternSidebarBuildingBlock scale"
      scale={ scale }
      onFieldChanged={ this.onScaleDomainChanged.bind(this) }
    />;
  }

  private renderLayoutBlocks() {
    if (this.props.selectedPattern.layout === undefined
        || this.props.selectedPattern.layout === null) {

      return <div className="unboundPropertyNotice">No layout structure</div>;
    }

    const layout = this.props.selectedPattern.layout;

    if (layout.scales.length === 0) {
      return <div className="noChildNodesNotice">Layout has no bindings</div>;
    }

    return (
      <div id="patternSidebarLayoutBlocks" className="patternSidebarBuildingBlockColumn">
        <div id="patternSidebarLayoutScales" className="patternSidebarBuildingBlockRow">
          { layout.scales.map(this.renderLayoutScale.bind(this)) }
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div id="patternSidebarLayout" className="patternSidebarGroup">
        <h3>Layout</h3>
        { this.renderLayoutBlocks() }
      </div>
    );
  }
}