import * as React from 'react';
import { RangeEnum, Scale } from 'vega';

import { isSignalRef } from '../../VegaTypeChecker';
import ScaleConfigurationTypeComponent from './ScaleConfigurationType';

import './ScaleConfiguration.css';

const SCALE_RANGE_PRESETS: RangeEnum[] = ['width', 'height', 'symbol', 'category', 'diverging',
  'ordinal', 'ramp', 'heatmap'];

interface Props {
  scale: Scale;
  updateScale: (scale: Scale) => void;
  hidden: boolean;
}
interface State {
  rangeCustomInputVisible: boolean;
}

export default class ScaleConfiguration extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rangeCustomInputVisible: false,
    };
  }

  private onRangeOptionChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (this.props.scale.type !== 'identity') {
      this.props.scale.range = value as RangeEnum;
      this.props.updateScale(this.props.scale);
    }
  }

  private onCustomRangeChanged(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.scale.type === 'identity') { return; }

    const value = event.target.value;
    this.props.scale.range = { signal: value };

    this.props.updateScale(this.props.scale);
  }

  private onRoundChanged(active: boolean) {
    this.props.scale.round = active;
    this.props.updateScale(this.props.scale);
  }

  private onReverseChanged(active: boolean) {
    this.props.scale.reverse = active;
    this.props.updateScale(this.props.scale);
  }

  private renderRoundedOption() {
    if (this.props.scale.round === undefined) { this.props.scale.round = false; }

    const isSelectedScaleRounded = this.props.scale.round;

    if (typeof isSelectedScaleRounded !== 'boolean') { return false; }

    return (
      <div className="scaleConfigCheckbox">
        <input
          id={`selectedScaleRounded${this.props.scale.name}`}
          type="checkbox"
          checked={ isSelectedScaleRounded }
          onChange={event => this.onRoundChanged(event.target.checked) }/>
        <label htmlFor={`selectedScaleRounded${this.props.scale.name}`}>round</label>
      </div>
    );
  }

  private renderReverseOption() {
    if (this.props.scale.reverse === undefined) { this.props.scale.reverse = false; }

    const isSelectedScaleReversed = this.props.scale.reverse;

    if (typeof isSelectedScaleReversed !== 'boolean') { return false; }

    return (
      <div className="scaleConfigCheckbox">
        <input
          id={ `selectedScaleReversed${this.props.scale.name}` }
          type="checkbox"
          checked={ isSelectedScaleReversed }
          onChange={event => this.onReverseChanged(event.target.checked) }/>

        <label htmlFor={`selectedScaleReversed${this.props.scale.name}`}>reverse</label>
      </div>
    );
  }

  private renderRangePreset(preset: RangeEnum) {
    // identity scale has no range
    if (this.props.scale.type === 'identity') {
      return false;
    }

    let activeRange: any = this.props.scale.range;

    if (isSignalRef(activeRange)) { activeRange = activeRange.signal; }

    return (
      <div className="radioGroup" key={ `${this.props.scale.name}scaleTooltipRanges${preset}` }>
        <input
          id={ `scaleTooltipRange${preset}${this.props.scale.name}` }
          name={ `scaleTooltipRange${this.props.scale.name}` }
          type="radio"
          value={ preset }
          checked={ activeRange === preset }
          onChange={ this.onRangeOptionChanged.bind(this) } />

        <label htmlFor={ `scaleTooltipRange${preset}${this.props.scale.name}` }>{ preset }</label>
      </div>
    );
  }

  private renderSelectedScaleRange() {
    // identity scale has no range
    if (this.props.scale.type === 'identity') { return; }

    let range: any = this.props.scale.range;

    if (isSignalRef(range)) { range = range.signal; }

    return (
      <div className="scaleTooltipRange configurationGroup">
        <h2>Range</h2>
        <div className="scaleTooltipRangeOptions">
          { SCALE_RANGE_PRESETS.map(this.renderRangePreset.bind(this)) }
        </div>
        <div className="scaleTooltipCustomRange">
          <button
            className="scaleTooltipCustomRangeToggle"
            onClick={ () => this.setState({ rangeCustomInputVisible: !this.state.rangeCustomInputVisible }) }>
            custom ...
          </button>
          <input
            type="text"
            className={ this.state.rangeCustomInputVisible ? '' : 'hidden' }
            value={ range }
            onChange={ this.onCustomRangeChanged.bind(this) } />
        </div>
      </div>
    );
  }

  private renderBody() {
    if (this.props.scale === null) { return false; }

    return (
      <div className="scaleConfigTooltipBody">
        <ul>
          <ScaleConfigurationTypeComponent
            scale={ this.props.scale }
            updateScale={ this.props.updateScale }/>

          { this.renderSelectedScaleRange() }
          <li className="configurationGroup scaleConfigCheckboxes">
            { this.renderRoundedOption() }
            { this.renderReverseOption() }
          </li>
        </ul>
      </div>
    );
  }

  public render() {
    return (
      <div className={`scaleConfig ${this.props.hidden ? 'hidden' : ''}`}>
        { this.renderBody() }
      </div>
    );
  }
}