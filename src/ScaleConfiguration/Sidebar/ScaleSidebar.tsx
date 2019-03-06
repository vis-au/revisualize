import * as React from 'react';
import { RangeEnum, Scale, ScaleType } from 'vega';

import DataflowGraph from '../../Model/DataFlowGraph/DataflowGraph';
import { isSignalRef } from '../../VegaTypeChecker';
import IconRadioButtonGroup from '../../Widgets/IconRadioButtonGroup';
import Sidebar from '../../Widgets/Sidebar';

import './ScaleSidebar.css';


export const SCALE_PROPERTIES = ['type', 'reverse', 'round'];
export const SCALE_RANGE_PRESETS: RangeEnum[] = ['width', 'height', 'symbol', 'category',
  'diverging', 'ordinal', 'ramp', 'heatmap'];

const quantitativeTypes = ['linear', 'pow', 'sqrt', 'log', 'time', 'utc', 'sequential'];
const discreteTypes = ['ordinal', 'band', 'point'];
const discretizingTypes = ['quantile', 'quantize', 'threshold', 'bin-linear', 'bin-ordinal'];

interface Props {
  selectedScale: Scale;
  dataGraph: DataflowGraph;
  updateSelectedScale: (scale: Scale) => void;
}
interface State {
  nameInputVisible: boolean;
  rangeCustomInputVisible: boolean;
}

export default class ScaleSidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      nameInputVisible: false,
      rangeCustomInputVisible: false,
    };
  }

  private onRangeOptionChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (this.props.selectedScale.type !== 'identity') {
      this.props.selectedScale.range = value as RangeEnum;
      this.props.updateSelectedScale(this.props.selectedScale);
    }
  }

  private onCustomRangeChanged(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.selectedScale.type === 'identity') { return; }

    const value = event.target.value;
    this.props.selectedScale.range = { signal: value };

    this.props.updateSelectedScale(this.props.selectedScale);
  }

  private onRoundChanged(active: boolean) {
    this.props.selectedScale.round = active;
    this.props.updateSelectedScale(this.props.selectedScale);
  }

  private onReverseChanged(active: boolean) {
    this.props.selectedScale.reverse = active;
    this.props.updateSelectedScale(this.props.selectedScale);
  }

  private onScaleTypeChanged(value: ScaleType) {
    this.props.selectedScale.type = value;
    this.props.updateSelectedScale(this.props.selectedScale);
  }

  private onScaleNameInputChange(event: any) {
    if (event.key === 'Enter') {
      this.setState({ nameInputVisible: false });
      return;
    }

    this.props.selectedScale.name = event.target.value;
    this.props.updateSelectedScale(this.props.selectedScale);
  }

  private renderHeader() {
    if (this.props.selectedScale === null) { return false; }

    const name = this.props.selectedScale.name;

    return (
      <div id="scaleSidebarHeader">
        <h2
          className={ this.state.nameInputVisible ? 'hidden' : ''}
          onClick={ () => this.setState({ nameInputVisible: !this.state.nameInputVisible }) }>

          { name }
        </h2>
        <div className={ this.state.nameInputVisible ? '' : 'hidden' }>
          <input
            type="text"
            value={ this.props.selectedScale.name }
            onChange={ this.onScaleNameInputChange.bind(this) }
            onKeyDown={ this.onScaleNameInputChange.bind(this) }
            onBlur={ () => this.setState({ nameInputVisible: false }) } />
        </div>
      </div>
    );
  }

  private renderRoundedOption() {
    if (this.props.selectedScale.round === undefined) { this.props.selectedScale.round = false; }

    const isSelectedScaleRounded = this.props.selectedScale.round;

    if (typeof isSelectedScaleRounded !== 'boolean') { return false; }

    return (
      <div>
        <input
          id="selectedScaleRounded"
          type="checkbox"
          checked={ isSelectedScaleRounded }
          onChange={event => this.onRoundChanged(event.target.checked) }/>
        <label htmlFor="selectedScaleRounded">round</label>
      </div>
    );
  }

  private renderReverseOption() {
    if (this.props.selectedScale.reverse === undefined) { this.props.selectedScale.reverse = false; }

    const isSelectedScaleReversed = this.props.selectedScale.reverse;

    if (typeof isSelectedScaleReversed !== 'boolean') { return false; }

    return (
      <div>
        <input
          id="selectedScaleReversed"
          type="checkbox"
          checked={ isSelectedScaleReversed }
          onChange={event => this.onReverseChanged(event.target.checked) }/>
        <label htmlFor="selectedScaleReversed">reverse</label>
      </div>
    );
  }

  private renderScaleType(type: string) {
    return (
      <li key={ type } className="scaleType">{ type }</li>
    );
  }

  private renderScaleTypeList(name: string, list: any[]) {

    const iconList = list.map(type => ({ name: 'build', value: type }));
    const selectedScaleType = this.props.selectedScale.type;

    return (
      <div key={ name }>
        <h3>{ name }</h3>
        <IconRadioButtonGroup
          id={ name }
          updateActiveValue={ (newType: ScaleType) => this.onScaleTypeChanged(newType) }
          icons={ iconList }
          checkedValue={ selectedScaleType }
        />
      </div>
    );
  }

  private renderSelectedScaleType() {
    return (
      <div id="selectedScaleType">
        <h2>Type</h2>
        { this.renderScaleTypeList('Quantitative', quantitativeTypes) }
        { this.renderScaleTypeList('Discrete', discreteTypes) }
        { this.renderScaleTypeList('Discretizing', discretizingTypes) }
      </div>
    );
  }

  private renderRangePreset(preset: RangeEnum) {
    // identity scale has no range
    if (this.props.selectedScale.type === 'identity') { return false; }

    let activeRange: any = this.props.selectedScale.range;
    if (isSignalRef(activeRange)) { activeRange = activeRange.signal; }

    return (
      <div className="radioGroup" key={ `selectedScaleRange${preset}` }>
        <input
          id={ `selectedScaleRange${preset}` }
          name="selectedScaleRange"
          type="radio"
          value={ preset }
          checked={ activeRange === preset }
          onChange={ this.onRangeOptionChanged.bind(this) } />
        <label htmlFor={ `selectedScaleRange${preset}` }>{ preset }</label>
      </div>
    );
  }

  private renderSelectedScaleRange() {
    // identity scale has no range
    if (this.props.selectedScale.type === 'identity') { return; }

    let range: any = this.props.selectedScale.range;

    if (isSignalRef(range)) { range = range.signal; }

    return (
      <div id="selectedScaleRange">
        <h2>Range</h2>
        <div id="selectedScaleRangeOptions">
          { SCALE_RANGE_PRESETS.map(this.renderRangePreset.bind(this)) }
        </div>
        <div id="selectedScaleCustomRange">
          <button
            id="selectedScaleCustomRangeToggle"
            onClick={ () => this.setState({ rangeCustomInputVisible: !this.state.rangeCustomInputVisible }) }>
            custom ...
          </button>
          <input
            type="text"
            id="selectedScaleCustomRangeInput"
            className={ this.state.rangeCustomInputVisible ? '' : 'hidden' }
            value={ range }
            onChange={ this.onCustomRangeChanged.bind(this) } />
        </div>
      </div>
    );
  }

  private renderBody() {
    if (this.props.selectedScale === null) { return false; }

    return (
      <div id="scaleSidebarBody">
        <ul>
          { this.renderSelectedScaleType() }
          { this.renderSelectedScaleRange() }
          { this.renderRoundedOption() }
          { this.renderReverseOption() }
        </ul>
      </div>
    );
  }

  public render() {
    return (
      <Sidebar hidden={ this.props.selectedScale === null } id="scaleSidebar">
        { this.renderHeader() }
        { this.renderBody() }
      </Sidebar>
    );
  }
}