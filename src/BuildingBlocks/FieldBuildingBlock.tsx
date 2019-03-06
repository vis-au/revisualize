import * as React from 'react';

import { plumbingProvider } from '../PlumbingProvider';
import BuildingBlock from './BuildingBlock';

import './FieldBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  field: string;
  datasetName: string;
  disablePlumbing?: boolean;
  onDelete?: (event: any) => void;
}

export default class FieldBuildingBlock extends React.Component<Props, {}> {
  public render() {
    return <BuildingBlock
      id={ this.props.id }
      className={ `${this.props.className} field` }
      disablePlumbing={ this.props.disablePlumbing }
      plumbing={ plumbingProvider.fieldPlumbing }
      onDelete={ this.props.onDelete }>

      <i className="material-icons icon">bookmark_border</i>
      <span
        data-datasetname={ this.props.datasetName }
        data-fieldname={ this.props.field }>

        { this.props.field }
      </span>
    </BuildingBlock>;
  }
}