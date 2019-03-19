import * as React from 'react';
import { Scale } from 'vega';

import ScaleBuildingBlock from '../../../BuildingBlocks/ScaleBuildingBlock';
import Pattern from '../../../Model/Pattern/Pattern';
import Utils from '../../../UtilityFunctions';
import { isScaledFieldRef } from '../../../VegaTypeChecker';

import './CustomScales.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}
interface State {
  isCustomBlockListVisible: boolean;
}

export default class CustomScales extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCustomBlockListVisible: false
    };
  }

  private addUniqueCustomScaleToPattern(scale: Scale) {
    // add an 'instance' of the custom scale, so that it can be added mulitple times and is not
    // the same across patterns
    const customScaleName = `${scale.name}${this.props.selectedPattern.id}${Utils.getRandomID()}`;
    const uniqueScale = { ...scale };

    uniqueScale.name = customScaleName;

    this.props.selectedPattern.customScales.push(uniqueScale);
    this.props.updatePatternGraph();
    this.setState({ isCustomBlockListVisible: false });
  }

  private onScaleDomainChanged() {
    this.props.updatePatternGraph();
  }

  private onDeleteCustomScale(scale: Scale) {
    if (this.props.selectedPattern.visualElement === null) { return; }

    const indexInCustomScales = this.props.selectedPattern.customScales.indexOf(scale);

    if (indexInCustomScales === -1) { return; }

    this.props.selectedPattern.visualElement.bindings.forEach((value, key) => {
      if (isScaledFieldRef(value) && value.scale === scale.name) {
        this.props.selectedPattern.visualElement.bindings.set(key, null);
      }
    });

    this.props.selectedPattern.customScales.splice(indexInCustomScales, 1);
    this.props.updatePatternGraph();
  }

  private renderCustomScaleInList(scale: Scale) {
    return (
      <li
        key={ scale.name }
        className="customBlock"
        onClick={ () => this.addUniqueCustomScaleToPattern(scale) }>

        { scale.name }
      </li>
    );
  }

  private renderActiveCustomScale(scale: Scale) {
    return (
      <ScaleBuildingBlock
        id={`${this.props.selectedPattern.id}CustomScale${scale.name}`}
        key={`${this.props.selectedPattern.id}CustomScale${scale.name}`}
        scale={ scale }
        onFieldChanged={ this.onScaleDomainChanged.bind(this) }
        onDelete={ () => this.onDeleteCustomScale(scale) }
      />
    );
  }

  private renderActiveCustomScales() {
    if (this.props.selectedPattern.customScales.length === 0) {
      return <div className="unboundPropertyNotice">No custom scales</div>;
    }

    return (
      <div className="customOptionList">
        { this.props.selectedPattern.customScales.map(this.renderActiveCustomScale.bind(this)) }
      </div>
    );
  }

  private renderCustomScaleList() {
    if (!this.state.isCustomBlockListVisible) { return false; }

    return (
      <ul className="customBlockList">
        { this.props.selectedPattern.graph.globalScales.map(this.renderCustomScaleInList.bind(this)) }
      </ul>
    );
  }

  public render() {
    return (
      <div id="patternSidebarCustomScales" >
        { this.renderActiveCustomScales() }
        <button
          id="showCustomScales"
          onClick={ () => this.setState({
                    isCustomBlockListVisible: !this.state.isCustomBlockListVisible
                  }) }>

          Scales
        </button>
        { this.renderCustomScaleList() }
      </div>
    );
  }
}