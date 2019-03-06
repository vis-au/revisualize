import * as React from 'react';
import { Scale, SignalRef } from 'vega';

import { plumbingProvider } from '../PlumbingProvider';
import BuildingBlock from './BuildingBlock';
import DropArea from './DropArea';
import FieldBuildingBlock from './FieldBuildingBlock';
import SignalBuildingBlock from './SignalBuildingBlock';

import './ScaleBuildingBlock.css';
import './ScaleRefBuildingBlock.css';

interface Props {
  id: string,
  scale: Scale,
  field?: string,
  signal?: string,
  className?: string,
  disablePlumbing?: boolean,
  onFieldDeleted: () => void,
  onFieldSet: (field: string, data: string) => void,
  onSignalDeleted: () => void,
  onSignalSet: (scaledSignal: {signal: SignalRef, scale: string}) => void,
  onDelete?: (event: any) => void,
}
interface State {
  isSignalInputVisible: boolean
}

export default class ScaleRefBuildingBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { isSignalInputVisible: false };
  }

  private onFieldDropped(event: any) {
    const fieldName = event.drag.el.children[1].dataset.fieldname;
    const datasetName = event.drag.el.children[1].dataset.datasetname;

    this.props.onFieldSet(fieldName, datasetName);
  }

  private onSignalInputChanged(event: any) {
    if (event.key === 'Enter') {
      const newSignalRef = {
        scale: this.props.scale.name,
        signal: event.target.value
      }

      this.props.onSignalSet(newSignalRef);
      this.setState({ isSignalInputVisible: false });
    }
  }

  private renderScaleIcon() {
    let icon: string;
    let title: string;

    if (this.props.scale.type === 'linear') {
      icon = 'settings_ethernet';
      title = 'linear scale';
    } else if (this.props.scale.type === 'point') {
      icon = 'drag_indicator';
      title = 'point scale';
    } else if (this.props.scale.type === 'band') {
      icon = 'drag_indicator';
      title = 'band scale';
    } else if (this.props.scale.type === 'ordinal') {
      icon = 'drag_indicator';
      title = 'ordinal scale';
    }

    return <i className="material-icons icon" title={ title }>{ icon }</i>;
  }

  private renderField() {
    if (this.props.field === null || this.props.field === undefined) { return false; }
    if (this.props.scale.domain === undefined) { return false; }

    return (
      <FieldBuildingBlock
        id={ `ScaleRef${this.props.id}Field` }
        datasetName={ (this.props.scale.domain as any).data }
        field={ this.props.field }
        disablePlumbing={ this.props.disablePlumbing }
        onDelete={ this.props.onFieldDeleted } />
    );
  }

  private renderSignal() {
    if (this.props.signal === undefined || this.props.signal === null) { return false; }

    return (
      <SignalBuildingBlock
        id={ `ScaleRef${this.props.id}Signal` }
        signal={ {name: this.props.signal, value: this.props.signal} }
        onDelete={ this.props.onSignalDeleted }
      />
    );
  }

  private renderNotBoundNotice() {
    if (this.props.field !== undefined && this.props.field !== null) { return false; }
    if (this.props.signal !== undefined && this.props.signal !== null) { return false; }

    return (
      <div
        onClick={(e: any) => { this.setState({ isSignalInputVisible: true }); e.stopPropagation() }}
        className="noScaledDomainNotice">

        no domain
      </div>
    );
  }

  private renderSignalInput() {
    if (this.props.field !== undefined && this.props.field !== null) { return false; }
    if (!this.state.isSignalInputVisible) { return false; }

    return (
      <input
        id={`${this.props.id}SignalInput`}
        autoFocus={ true }
        onBlur={ () => this.setState({ isSignalInputVisible: false }) }
        placeholder="Enter value"
        onKeyPress={ this.onSignalInputChanged.bind(this) } />
    );
  }

  private renderFieldDropArea() {
    if (this.props.onFieldDeleted === undefined || this.props.field != null) {
      return false;
    }

    return (
      <DropArea
        id={ `${this.props.id}DropArea` }
        className="scaledDomainDropArea"
        onDrop={ this.onFieldDropped.bind(this) }
        plumbing={ plumbingProvider.fieldPlumbing }
      />
    );
  }

  public render() {
    const plumbingDisabled = !(this.props.disablePlumbing !== undefined && this.props.disablePlumbing)
    const field = this.props.field;
    const noField = field === undefined || field === null;
    const signal = this.props.signal;
    const noSignal = signal === undefined || field === undefined;

    const hasNoValue = plumbingDisabled || (noField && noSignal);

    let name: string = this.props.scale.name;
    if (name.length > 20) { name = `${name.substr(0, 20)}...`; }

    return (
      <BuildingBlock
        id={ this.props.id }
        className={ `${this.props.className} scale ref` }
        disablePlumbing={ hasNoValue }
        plumbing={ plumbingProvider.scalePlumbing }
        onDelete={ this.props.onDelete }>

        { this.renderScaleIcon() }

        <span data-fieldname={ this.props.field } data-scalename={ this.props.scale.name }>
          { name }
        </span>

        { this.renderField() }
        { this.renderSignal() }
        { this.renderSignalInput() }
        { this.renderFieldDropArea() }
        { this.renderNotBoundNotice() }
      </BuildingBlock>
    );
  }
}