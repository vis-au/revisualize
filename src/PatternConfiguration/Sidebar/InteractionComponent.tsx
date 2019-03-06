import * as React from 'react';

import InteractionProviderBlock from '../../BuildingBlocks/InteractionProviderBlock';
import Pattern from '../../Model/Pattern/Pattern';

import './InteractionComponent.css';

interface Props {
  selectedPattern: Pattern;
}

export default class InteractionComponent extends React.Component<Props, {}> {

  private renderInteractionBlocks() {
    if (this.props.selectedPattern.interactionProviders.length === 0) {
      return <div className="unboundPropertyNotice">No interactions</div>;
    }

    return this.props.selectedPattern.interactionProviders.map(provider => {
      return (
        <InteractionProviderBlock
          key={ provider.name }
          interactionProvider={ provider }
        />
      );
    });
  }

  public render() {
    return (
      <div id="patternSidebarInteractions" className="patternSidebarGroup">
        <h3>Interactions</h3>
        { this.renderInteractionBlocks() }
      </div>
    );
  }
}