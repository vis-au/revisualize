import * as React from 'react';
import { Scale, Signal } from 'vega';

import { plumbingProvider } from '../PlumbingProvider';
import { DynamicValue } from '../Model/Interactions/DynamicValue';
import InteractionProvider from '../Model/Interactions/InteractionProvider';
import DropArea from './DropArea';
import DynamicValueBuildingBlock from './DynamicValueBuildingBlock';
import InteractionBuildingBlock from './InteractionBuildingBlock';

import { isScale, isSignal } from '../VegaTypeChecker';
import ScaleBuildingBlock from './ScaleBuildingBlock';
import SignalBuildingBlock from './SignalBuildingBlock';

import './InteractionProviderBlock.css';

interface Props {
  interactionProvider: InteractionProvider;
  onDelete?: (provider: InteractionProvider) => void;
  onInteractionDropped?: (provider: InteractionProvider, event: any) => boolean;
}

export default class InteractionProviderBlock extends React.Component<Props, {}> {

  public renderDeleteButton() {
    if (this.props.onDelete === undefined) { return false; }

    return (
      <span
        className="delete"
        onClick={ () => this.props.onDelete(this.props.interactionProvider) }
      />
    );
  }

  public renderInteraction() {
    if (this.props.interactionProvider.interaction === null) {
      return (
        <div className="noInteraction">
          <DropArea
            id={ `${this.props.interactionProvider.id}InteractionDropArea` }
            className="interactionProvider interaction"
            onDrop={ this.props.onInteractionDropped.bind(this) }
            plumbing={ plumbingProvider.interactionPlumbing }
          />
          <div className="noInteractionNotice unboundNotice">no interaction</div>
        </div>
      );
    }

    return (
      <InteractionBuildingBlock
        id={ `${this.props.interactionProvider.id}Interaction` }
        provider={ this.props.interactionProvider }
      />
    );
  }

  public renderOutputMapping(dynamicValue: DynamicValue) {
    return (
      <DynamicValueBuildingBlock
        id={ `${this.props.interactionProvider.id}${dynamicValue.name}` }
        key={ `${this.props.interactionProvider.id}${dynamicValue.name}` }
        dynamicValue={ dynamicValue }
      />
    );
  }

  public renderOutputMappings() {
    if (this.props.interactionProvider.interaction === null ||
        this.props.interactionProvider.interaction.outputMappings === undefined) {

      return (
        <div className="noOutputMappings">
          <span>select an interaction first</span>
        </div>
      );
    }

    const mappings: JSX.Element[] = this.props.interactionProvider.interaction.outputMappings
      .map(this.renderOutputMapping.bind(this));

    return (
      <div className="outputMappings">
        { mappings }
      </div>
    );
  }

  public renderInputMapping(name: string, mapping: Signal | Scale | string) {
    if (typeof mapping === 'string') {
      return (
        <div key={ name } className="interactionMapping">
          <span className="interactionMappingName">{ name }</span>
          <span>{ mapping }</span>
        </div>
      );
    }

    if (isSignal(mapping)) {
      return (
        <SignalBuildingBlock
          key={ `${this.props.interactionProvider.id}${mapping.name}` }
          id={ `${this.props.interactionProvider.id}${mapping.name}` }
          signal={ mapping }
        />
      );
    }

    if (isScale(mapping)) {
      return (
        <ScaleBuildingBlock
          key={ `${this.props.interactionProvider.id}${mapping.name}` }
          id={ `${this.props.interactionProvider.id}${mapping.name}` }
          scale={ mapping }
        />
      );
    }

    return null;
  }

  public renderInputMappings() {
    if (this.props.interactionProvider.interaction === null
    || this.props.interactionProvider.interaction.inputMappings === undefined) {

      return (
        <div className="noInputMappings">
          <span>select an interaction first</span>
        </div>
      );
    }

    const mappings: JSX.Element[] = [];
    this.props.interactionProvider.interaction.inputMappings.forEach((value, key) => {
      mappings.push(this.renderInputMapping(key, value));
    });


    return (
      <div className="inputMappings">{ mappings }</div>
    );
  }

  public render() {
    return (
      <div id={ this.props.interactionProvider.id } className="interactionBlock">
        <div className="title">
          <h2>{ this.props.interactionProvider.name }</h2>
          <div className="inputFields">
            { this.renderInteraction() }
          </div>
          { this.renderDeleteButton() }
        </div>
        <span data-interactionid={ this.props.interactionProvider.id } />

        <div className="body">
          { this.renderInputMappings() }
          { this.renderOutputMappings() }
        </div>
      </div>
    );
  }
}