import * as React from 'react';

import InteractionProvider from '../Model/Interactions/InteractionProvider';
import InteractionBuildingBlock from './InteractionBuildingBlock';

import './InteractionSelection.css';

interface Props {
  providers: InteractionProvider[];
}

export default class InteractionProviderSelection extends React.Component<Props, {}> {
  private renderInteractionProvider(provider: InteractionProvider) {
    if (provider.interaction === null) { return false; }

    return (
      <InteractionBuildingBlock
        id={ `${provider.id}Selection` }
        key={ `${provider.id}Selection` }
        provider={ provider.interaction.provider }
      />
    );
  }

  private renderNoInteractionsNotice() {
    if (this.props.providers.length > 0) { return false; }

    return (
      <div id="noInteractionsNotice">no interactions</div>
    );
  }

  public render() {
    return (
      <div id="interactionSelectionComponent">
        <h2>Interactions</h2>
        <div id="interactionSelectionList" >
          { this.props.providers.map(this.renderInteractionProvider.bind(this)) }
        </div>
        { this.renderNoInteractionsNotice() }
      </div>
    );
  }
}