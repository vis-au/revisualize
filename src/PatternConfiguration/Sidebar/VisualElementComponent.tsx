import * as React from 'react';
import { Signal } from 'vega';

import VisualElementMappingBlock from '../../BuildingBlocks/VisualElementMappingBlock';
import { ArbitraryVisualVariableName } from '../../Model/Elements/VisualElement';
import Pattern from '../../Model/Pattern/Pattern';

import './VisualElementComponent.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}
interface State {
  isHiddenVariablesListActive: boolean;
}

export default class VisualElementComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isHiddenVariablesListActive: false
    };
  }

  private onDeleteVisualMapping(mappingKey: ArbitraryVisualVariableName) {
    this.props.selectedPattern.visualElement.bindings.set(mappingKey, null);

    const visibleVisualVariables = this.props.selectedPattern.visibleVisualVariables;
    const entryInList = visibleVisualVariables.find(variable => variable === mappingKey);
    const indexInList = visibleVisualVariables.indexOf(entryInList);

    if (indexInList === -1) { return; }

    this.props.selectedPattern.visibleVisualVariables.splice(indexInList, 1);
    this.props.updatePatternGraph();
  }

  private renderVisualMapping(visualVariable: ArbitraryVisualVariableName, binding: any) {
    let isBlocked = false;

    if (this.props.selectedPattern.layout !== null) {
      const blockedVariables = this.props.selectedPattern.layout.blockedVisualVariables;
      isBlocked = blockedVariables.indexOf(visualVariable) > -1;
    }

    return (
      <VisualElementMappingBlock
        visualVariable={ visualVariable }
        id={ `${ visualVariable }VisualVariable` }
        className="patternSidebarBuildingBlock"
        key={ `${ visualVariable }VisualVariable` }
        boundValue={ binding }
        isBlocked={ isBlocked }
        visualElement={ this.props.selectedPattern.visualElement }
        addSignal={ (signal: Signal) => this.props.selectedPattern.graph.addSignal(signal) }
        getScaleByName={ (scale: string) => this.props.selectedPattern.getScaleByName(scale) }
        getSignalByName={ (signal: string) => this.props.selectedPattern.getSignalByName(signal) }
        getDynamicValueByID={ (id: string) => this.props.selectedPattern.getDynamicValueByName(id) }
        updateVisualElement={ this.props.updatePatternGraph }
        onDelete={ () => this.onDeleteVisualMapping(visualVariable) } />
    );
  }

  private renderHiddenVisualVariable(variable: ArbitraryVisualVariableName) {
    return (
      <li
        key={ variable }
        onClick={() => {
          this.props.selectedPattern.visibleVisualVariables.push(variable);
          this.props.updatePatternGraph();
          this.setState({ isHiddenVariablesListActive: false });
        }}
        className="hiddenVisualVariable">

        { variable }
      </li>
    );
  }

  private renderHiddenVisualVariables() {
    if (!this.state.isHiddenVariablesListActive) { return false; }

    if (this.props.selectedPattern.visualElement === undefined
      || this.props.selectedPattern.visualElement === null) {
      return false;
    }

    const variables: ArbitraryVisualVariableName[] = [];

    // all possible variable names are the keys of the bindings in the visual variable of the
    // selected pattern
    this.props.selectedPattern.visualElement.bindings.forEach((value, key) => {
      variables.push(key);
    });

    return variables
      .filter(v => this.props.selectedPattern.visibleVisualVariables.indexOf(v) === -1)
      .map(this.renderHiddenVisualVariable.bind(this));
  }

  private renderVisualElementBlocks() {
    if (this.props.selectedPattern.visualElement === undefined
        || this.props.selectedPattern.visualElement === null) {

      return <div className="unboundPropertyNotice">No visual element</div>;
    }

    const visualElement = this.props.selectedPattern.visualElement;
    const mappings: JSX.Element[] = [];

    this.props.selectedPattern.visibleVisualVariables.forEach(variable => {
      mappings.push(this.renderVisualMapping(variable, visualElement.bindings.get(variable)));
    });

    return (
      <div id="patternSidebarVisualMappings" className="patternSidebarBuildingBlockRow">
        { mappings }
      </div>
    );
  }

  private renderAddVisualVariableButton() {
    if (this.props.selectedPattern.visualElement === undefined
        || this.props.selectedPattern.visualElement === null) {
      return false;
    }

    return (
      <button
        id="patternSidebarAddVisualMapping"
        onClick={ () => this.setState({
          isHiddenVariablesListActive: !this.state.isHiddenVariablesListActive
        }) }>

        more ...
      </button>
    );
  }

  public render() {
    return (
      <div id="patternSidebarVisualElement" className="patternSidebarGroup">
        <h3>Visual Element</h3>
        { this.renderVisualElementBlocks() }
        { this.renderAddVisualVariableButton() }
        <ul id="patternSidebarAllBindingsList">
          { this.renderHiddenVisualVariables() }
        </ul>
      </div>
    );
  }
}