import * as React from 'react';

import { VisualElement } from '../Model/Elements/VisualElement';
import { DEFAULT_MARK_ICONS, IconVisualElementBlock } from '../PatternConfiguration/PatternPresetValues';
import { plumbingProvider } from '../PlumbingProvider';
import IconButton from '../Widgets/IconButton';
import BuildingBlock from './BuildingBlock';

import './VisualElementBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  visualElement: VisualElement;
  onDelete?: (event: any) => void;
}

export default class VisualElementBuildingBlock extends React.Component<Props, {}> {
  public render() {

    let block: IconVisualElementBlock;

    // FIXME: for now, pattern toolbar contains building blocks with no visualelement implementation
    // and the visualelement property is null in those cases
    if (this.props.visualElement !== null) {
      block = DEFAULT_MARK_ICONS
        .find((icon: IconVisualElementBlock) => icon.name === this.props.visualElement.mark.name);
    } else {
      block = DEFAULT_MARK_ICONS
        .find((icon: IconVisualElementBlock) => icon.name === this.props.id);
    }

    if (block === undefined) { throw new Error('Visual element name has no icon set'); }

    const type = this.props.visualElement === null
      ? this.props.id
      : this.props.visualElement.mark.name;

    return (
      <BuildingBlock
        id={ this.props.id }
        className={ this.props.className }
        plumbing={ plumbingProvider.visualElementPlumbing }
        onDelete={ this.props.onDelete }>
        <span data-visualelementtype={ type } />

        <IconButton
          onClick={ (): any => null }
          icon={ block.icon }>

          { block.name }
        </IconButton>
      </BuildingBlock>
    );
  }
}