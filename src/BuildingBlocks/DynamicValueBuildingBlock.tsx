import * as React from 'react';

import { DynamicValue } from '../Model/Interactions/DynamicValue';
import { plumbingProvider } from '../PlumbingProvider';
import BuildingBlock from './BuildingBlock';

import './DynamicValueBuildingBlock.css';

interface Props {
  id: string;
  dynamicValue: DynamicValue;
  onDelete?: (event: any) => void;
}

export default class DynamicValueBuildingBlock extends React.Component<Props, {}> {
  private renderDeleteButton() {
    if (this.props.onDelete === undefined) { return false; }

    return <span className="delete" onClick={ this.props.onDelete } />;
  }
  public render() {
    return (
      <BuildingBlock
        className="dynamicValue"
        id={ this.props.id }
        plumbing={ plumbingProvider.dynamicValuePlumbing }>
        <span data-dynamicvaluename={ this.props.dynamicValue.name } />

        { this.props.dynamicValue.name }
        { this.renderDeleteButton() }
      </BuildingBlock>
    );
  }
}