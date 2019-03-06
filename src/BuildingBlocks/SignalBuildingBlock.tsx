import * as React from 'react';
import { Signal } from 'vega';

import { plumbingProvider } from '../PlumbingProvider';
import BuildingBlock from './BuildingBlock';

import './SignalBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  signal: Signal;
  disablePlumbing?: boolean;
  onDelete?: (event: any) => void;
}

export default class SignalBuildingBlock extends React.Component<Props, {}> {
  public render() {
    return <BuildingBlock
      id={ this.props.id }
      className={ `${this.props.className} signal` }
      disablePlumbing={ this.props.disablePlumbing }
      plumbing={ plumbingProvider.signalPlumbing }
      onDelete={ this.props.onDelete }>

      <span data-signalname={ this.props.signal.name }>{ this.props.signal.name }</span>
    </BuildingBlock>;
  }
}