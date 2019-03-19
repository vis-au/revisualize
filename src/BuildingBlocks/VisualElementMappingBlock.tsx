import * as React from 'react';
import { ArbitraryValueRef, NewSignal, ProductionRule, Scale, Signal, SignalRef } from 'vega';

import { ArbitraryVisualVariableName, VisualElement } from '../Model/Elements/VisualElement';
import { DynamicValue } from '../Model/Interactions/DynamicValue';
import { plumbingProvider } from '../PlumbingProvider';
import { isField, isScale, isScaledFieldRef, isScaledSignalRef, isSignalRef } from '../VegaTypeChecker';
import DropArea from './DropArea';
import DynamicValueBuildingBlock from './DynamicValueBuildingBlock';
import FieldBuildingBlock from './FieldBuildingBlock';
import SignalBuildingBlock from './SignalBuildingBlock';

import ScaleRefBuildingBlock from './ScaleRefBuildingBlock';
import './VisualElementMappingBlock.css';

interface Props {
  id: string;
  className?: string;
  visualElement: VisualElement;
  visualVariable: ArbitraryVisualVariableName;
  boundValue: { data: string, field: string } | Scale | Signal | Array<ProductionRule<ArbitraryValueRef>>;
  isBlocked: boolean;
  updateVisualElement: () => any;
  addSignal: (signal: Signal) => void;
  getScaleByName: (name: string) => Scale;
  getSignalByName: (name: string) => NewSignal;
  getDynamicValueByID: (id: string) => DynamicValue;
  onDelete: () => void;
}
interface State {
  isValueInputActive: boolean;
}

export default class VisualElementMappingBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { isValueInputActive: false };
  }

  private onMappingDeleted() {
    this.props.visualElement.bindings.set(this.props.visualVariable, null);
    this.props.updateVisualElement();

    // TODO: mapping is deleted from pattern, but vega preview does not update
  }

  private onScaleRefValueDeleted() {
    if (!isScaledFieldRef(this.props.boundValue) && !isScaledSignalRef(this.props.boundValue)) {
      return;
    }

    if (isScaledFieldRef(this.props.boundValue)) {
      this.props.boundValue.field = null;
    } else if (isScaledSignalRef(this.props.boundValue)) {
      this.props.boundValue.signal = null;
    }

    this.props.visualElement.bindings.set(this.props.visualVariable, this.props.boundValue as any);
    this.props.updateVisualElement();
  }

  private onScaleRefFieldSet(field: string, dataset: string) {
    if (!isScaledFieldRef(this.props.boundValue) && !isScaledSignalRef(this.props.boundValue)) {
      return false;
    }

    this.props.visualElement.bindings.set(this.props.visualVariable, {
      scale: this.props.boundValue.scale,
      field
    });

    this.props.updateVisualElement();
  }

  private onScaleRefSignalSet(scaledSignal: { scale: string, signal: string}) {
    if (!isScaledFieldRef(this.props.boundValue) && !isScaledSignalRef(this.props.boundValue)) {
      return false;
    }

    this.props.addSignal({
      name: `${this.props.id}Signal`,
      value: scaledSignal.signal
    });

    this.props.visualElement.bindings.set(this.props.visualVariable, scaledSignal);

    this.props.updateVisualElement();
  }

  private onScaleDropped(event: any) {
    // span with data properties is second in child nodes, position 0 is icon
    const scaleName = event.drag.el.children[1].dataset.scalename;
    const fieldName = event.drag.el.children[1].dataset.fieldname;

    const droppedScaleRef = {
      field: fieldName,
      scale: scaleName,
    };

    this.props.visualElement.bindings.set(this.props.visualVariable, droppedScaleRef);
    this.props.updateVisualElement();
  }

  private onFieldDropped(event: any) {

    // dataset and fieldname are stored in the dataset property of the dragged field
    const datasetName = event.drag.el.children[1].dataset.datasetname;
    const fieldName = event.drag.el.children[1].dataset.fieldname;

    const fieldRef = {
      field: fieldName
    };

    this.props.visualElement.bindings.set(this.props.visualVariable, fieldRef);
    this.props.updateVisualElement();
  }

  private onSignalDropped(event: any) {
    const signalName = event.drag.el.children[0].dataset.signalname;

    const signalRef = {
      signal: signalName
    };

    this.props.visualElement.bindings.set(this.props.visualVariable, signalRef);
    this.props.updateVisualElement();
  }

  private onDynamicValueDropped(event: any) {
    const dynamicValueName = event.drag.el.children[0].dataset.dynamicvaluename;

    const dynamicValue = this.props.getDynamicValueByID(dynamicValueName);

    this.props.visualElement.bindings.set(this.props.visualVariable, dynamicValue);
    this.props.updateVisualElement();
  }

  private onCustomInputChanged(event: any) {
    if (event.key !== 'Enter') { return; }

    // do not accept empty signals
    if (event.target.value === '') {
      this.setState({ isValueInputActive: false });
      return;
    }

    const variableValue = event.target.value;
    const variableName = `${variableValue}`;

    // signal is stored in schema
    const signal: NewSignal = {
      name: variableName,
      value: variableValue
    };

    this.props.addSignal(signal);

    // signal is referenced in visual element
    const signalRef: SignalRef = {
      signal: variableName
    };

    this.props.visualElement.bindings.set(this.props.visualVariable, signalRef);
    this.setState({ isValueInputActive: false });
    this.props.updateVisualElement();
  }

  private renderScaleDropArea() {
    if (this.props.isBlocked) { return false; }
    if (this.props.boundValue !== null) { return false; }

    return <DropArea
      id={ `${this.props.id}ScaleDropArea` }
      className="visualMappingDropArea"
      onDrop={ this.onScaleDropped.bind(this) }
      plumbing={ plumbingProvider.scalePlumbing } />;
  }

  private renderFieldDropArea() {
    if (this.props.isBlocked) { return false; }
    if (this.props.boundValue !== null) { return false; }

    return <DropArea
      id={ `${this.props.id}FieldDropArea` }
      className="visualMappingDropArea"
      onDrop={ this.onFieldDropped.bind(this) }
      plumbing={ plumbingProvider.fieldPlumbing } />;
  }

  private renderSignalDropArea() {
    if (this.props.isBlocked) { return false; }
    if (this.props.boundValue !== null) { return false; }

    return <DropArea
      id={ `${this.props.id}SignalDropArea` }
      className="visualMappingDropArea"
      onDrop={ this.onSignalDropped.bind(this) }
      plumbing={ plumbingProvider.signalPlumbing } />;
  }

  private renderCustomInput() {
    if (!this.state.isValueInputActive) { return false; }

    return (
      <input
        id={`${this.props.id}SignalInput`}
        autoFocus={ true }
        onBlur={ () => this.setState({ isValueInputActive: false }) }
        placeholder="Enter value"
        onKeyPress={ this.onCustomInputChanged.bind(this) } />
    );
  }

  private renderDynamicValueDropArea() {
    if (this.props.isBlocked) { return false; }
    if (this.props.boundValue !== null) { return false; }

    return <DropArea
      id={ `${this.props.id}DynamicValueDropArea` }
      className="visualMappingDropArea"
      onDrop={ this.onDynamicValueDropped.bind(this) }
      plumbing={ plumbingProvider.dynamicValuePlumbing } />;
  }

  private renderUnboundVariableLabel() {
    if (this.props.boundValue !== null || this.state.isValueInputActive) { return false; }

    if (this.props.isBlocked) {
      return (
        <div className="notBoundNotice blocked">
          bound by layout
        </div>
      );
    }

    return (
      <div
        className="notBoundNotice"
        onClick={() => this.setState({ isValueInputActive: true })}>

        Not bound
      </div>
    );
  }

  private renderBoundScale() {
    if (this.props.boundValue === null) {
      return false;
    }
    if (!isScaledFieldRef(this.props.boundValue) && !isScaledSignalRef(this.props.boundValue)) {
      return false;
    }

    const boundScale = this.props.getScaleByName(this.props.boundValue.scale);

    let boundField;
    let boundSignal;

    if (isScaledFieldRef(this.props.boundValue)) {
      boundField = this.props.boundValue.field;
    } else if (isScaledSignalRef(this.props.boundValue)) {
      boundSignal = this.props.boundValue.signal;
    }

    return (
      <ScaleRefBuildingBlock
        id={ `${this.props.id}${boundScale.name}BoundScaleRef`}
        scale={ boundScale }
        field={ boundField as string}
        signal={ boundSignal as string }
        onFieldSet={ this.onScaleRefFieldSet.bind(this) }
        onFieldDeleted={ this.onScaleRefValueDeleted.bind(this) }
        onSignalSet={ this.onScaleRefSignalSet.bind(this) }
        onSignalDeleted={ this.onScaleRefValueDeleted.bind(this) }
        onDelete={ this.onMappingDeleted.bind(this) } />
    );

    // return (
    //   <ScaleBuildingBlock
    //     scale={ boundScale }
    //     id={ `${this.props.id}${boundScale.name}BoundScale`}
    //     onDelete={ this.onMappingDeleted.bind(this) } />
    // );
  }

  private renderBoundField() {
    if (this.props.boundValue === null || !isField(this.props.boundValue)) { return false; }

    return (
      <FieldBuildingBlock
        datasetName={ this.props.boundValue.data }
        field={ this.props.boundValue.field }
        id={ `${this.props.id}${this.props.boundValue.field}BoundField`}
        onDelete={ this.onMappingDeleted.bind(this) } />
    );
  }

  private renderBoundSignal() {
    if (this.props.boundValue === null || !isSignalRef(this.props.boundValue)) { return false; }

    const boundSignal = this.props.getSignalByName(this.props.boundValue.signal);

    return (
      <SignalBuildingBlock
        id={ `${this.props.id}BoundSignal`}
        signal={ boundSignal }
        onDelete={ this.onMappingDeleted.bind(this )}
      />
    );
  }

  private renderBoundDynamicValue() {
    if (this.props.boundValue === null || !(this.props.boundValue instanceof DynamicValue)) {
      return false;
    }

    return (
      <DynamicValueBuildingBlock
        id={ `${this.props.id}BoundDynamicValue` }
        dynamicValue={ this.props.boundValue }
        onDelete={ this.onMappingDeleted.bind(this) }
      />
    );
  }

  private renderMapping() {
    return (
      <div className="visualVariableMapping">
        { this.renderBoundField() }
        { this.renderBoundScale() }
        { this.renderBoundSignal() }
        { this.renderBoundDynamicValue() }
        { this.renderFieldDropArea() }
        { this.renderScaleDropArea() }
        { this.renderSignalDropArea() }
        { this.renderDynamicValueDropArea() }
        { this.renderCustomInput() }
        { this.renderUnboundVariableLabel() }
      </div>
    );
  }

  public render() {
    return (
      <div
        id={ this.props.id }
        className={ this.props.className + ' visualVariableMappingBlock' }>

        <span className="visualVariableName">{ this.props.visualVariable }</span>
        { this.renderMapping() }
        <span className="delete" onClick={ this.props.onDelete }></span>
      </div>
    );
  }
}