import * as React from 'react';

import { DEFAULT_INTERACTION_ICONS, IconInteractionBlock } from '../PatternConfiguration/PatternPresetValues';
import { plumbingProvider } from '../PlumbingProvider';
import { Interaction } from '../Model/Interactions/Interaction';
import InteractionProvider from '../Model/Interactions/InteractionProvider';
import IconButton from '../Widgets/IconButton';
import BuildingBlock from './BuildingBlock';

import './InteractionBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  interaction?: Interaction;
  provider?: InteractionProvider;
  onDelete?: (event: any) => void;
}

export default class InteractionBuildingBlock extends React.Component<Props, {}> {
  public render() {
    const name = this.props.provider === undefined
      ? this.props.interaction.name
      : this.props.provider.name;

    const block = DEFAULT_INTERACTION_ICONS
        .find((icon: IconInteractionBlock) => icon.name === name);

    if (block === undefined) { throw new Error('Layout name has no icon set'); }

    return (
      <BuildingBlock
        className={ `${this.props.className} interaction` }
        id={ this.props.id }
        plumbing={ plumbingProvider.interactionPlumbing }
        onDelete={ this.props.onDelete }>
        <span
          data-interactionid={ this.props.provider !== undefined ? this.props.provider.id: '' } />

        <IconButton
          onClick={ (): any => null }
          icon={ block.icon }>

          { this.props.provider !== undefined ? this.props.provider.interaction.name: '' }
          { this.props.interaction !== undefined ? this.props.interaction.name: '' }
        </IconButton>
      </BuildingBlock>
    );
  }
}