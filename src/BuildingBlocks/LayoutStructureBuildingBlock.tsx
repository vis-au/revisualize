import * as React from 'react';

import { DEFAULT_LAYOUT_ICONS, IconLayoutBlock } from '../PatternConfiguration/PatternPresetValues';
import { plumbingProvider } from '../PlumbingProvider';
import { LayoutStructure } from '../Model/Layouts/LayoutStructure';
import IconButton from '../Widgets/IconButton';
import BuildingBlock from './BuildingBlock';

import './LayoutStructureBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  layout: LayoutStructure;
  onDelete?: (event: any) => void;
}

export default class LayoutStructureBuildingBlock extends React.Component<Props, {}> {
  public render() {

    const block = DEFAULT_LAYOUT_ICONS
        .find((icon: IconLayoutBlock) => icon.name === this.props.layout.name);

    if (block === undefined) { throw new Error('Layout name has no icon set'); }

    return (
      <BuildingBlock
        id={ this.props.id }
        className={ this.props.className }
        plumbing={ plumbingProvider.layoutPlumbing }
        onDelete={ this.props.onDelete }>

        <span data-layouttype={ this.props.layout.name } />

        <IconButton
          onClick={ (): any => null }
          icon={ block.icon }>

          { this.props.layout.name }
        </IconButton>
      </BuildingBlock>
    );
  }
}