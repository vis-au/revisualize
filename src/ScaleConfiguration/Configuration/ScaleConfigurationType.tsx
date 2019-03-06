import * as React from 'react';
import { Scale, ScaleType } from 'vega';

import IconRadioButtonGroup from '../../Widgets/IconRadioButtonGroup';

type ScaleTypeGroup = 'quantitative' | 'discrete' | 'discretizing';

const quantitativeTypes = ['linear', 'pow', 'sqrt', 'log', 'time', 'utc', 'sequential'];
const discreteTypes = ['ordinal', 'band', 'point'];
const discretizingTypes = ['quantile', 'quantize', 'threshold', 'bin-linear', 'bin-ordinal'];

interface Props {
  scale: Scale;
  updateScale: (scale: Scale) => void;
}
interface State {
  activeTypeTab: ScaleTypeGroup;
}

export default class ScaleConfigurationTypeComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      activeTypeTab: 'quantitative'
    };
  }

  private onScaleTypeChanged(value: ScaleType) {
    this.props.scale.type = value;
    this.props.updateScale(this.props.scale);
  }

  private onScaleTypeGroupSelected(typeGroup: ScaleTypeGroup) {
    this.setState({
      activeTypeTab: typeGroup
    });
  }

  private renderScaleTypeList(name: string, list: any[]) {
    const iconList = list.map(type => ({ name: 'build', value: type }));
    const selectedScaleType = this.props.scale.type;

    return (
      <div key={ `${this.props.scale.name}Types${name}` }>
        <IconRadioButtonGroup
          id={ `${this.props.scale.name}Type${name}` }
          updateActiveValue={ (newType: ScaleType) => this.onScaleTypeChanged(newType) }
          icons={ iconList }
          checkedValue={ selectedScaleType }
        />
      </div>
    );
  }

  private renderActiveScaleType() {
    if (this.state.activeTypeTab === 'quantitative') {
      return this.renderScaleTypeList('Quantitative', quantitativeTypes)
    } else if (this.state.activeTypeTab === 'discrete') {
      return this.renderScaleTypeList('Discrete', discreteTypes)
    } else if (this.state.activeTypeTab === 'discretizing') {
      return this.renderScaleTypeList('Discretizing', discretizingTypes)
    }
  }

  private renderTypeGroupSelection() {
    return (
      <div className="typeGroupSelection">
        <button
          className={ this.state.activeTypeTab === 'quantitative' ? 'active' : '' }
          onClick={ () => this.onScaleTypeGroupSelected('quantitative') }>

          Quantitative
        </button>

        <button
          className={ this.state.activeTypeTab === 'discrete' ? 'active' : '' }
          onClick={ () => this.onScaleTypeGroupSelected('discrete') }>

          Discrete
        </button>

        <button
          className={ this.state.activeTypeTab === 'discretizing' ? 'active' : '' }
          onClick={ () => this.onScaleTypeGroupSelected('discretizing') }>

          Discretizing
        </button>
      </div>
    );
  }

  public render() {
    return (
      <div className="scaleConfigType">
        { this.renderTypeGroupSelection() }
        { this.renderActiveScaleType() }
      </div>
    );
  }
}