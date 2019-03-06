import * as React from 'react';

import InteractionProviderBlock from '../BuildingBlocks/InteractionProviderBlock';
import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import InteractionFactory, { InteractionType } from '../Model/Interactions/InteractionFactory';
import InteractionProvider from '../Model/Interactions/InteractionProvider';
import PatternGraph from '../Model/Pattern/PatternGraph';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import InteractionDiagram from './Diagram/InteractionDiagram';
import InteractionToolbar from './Toolbar/InteractionToolbar';

import './InteractionConfigurationView.css';

interface Props {
  activeTab: Tab;
  datasetGraph: DataflowGraph;
  patternGraph: PatternGraph;
  onPatternGraphChanged: (graph: PatternGraph) => void;
}

export default class InteractionConfigurationView extends React.Component<Props, {}> {
  private interactionFactory: InteractionFactory;

  constructor(props: Props) {
    super(props);

    this.interactionFactory = new InteractionFactory();
  }

  private addInteractionProvider() {
    const newProvider = new InteractionProvider();
    const providers = this.props.patternGraph.interactions;

    providers.push(newProvider);

    this.props.onPatternGraphChanged(this.props.patternGraph);
  }

  private removeInteractionProvider(provider: InteractionProvider) {
    const providers = this.props.patternGraph.interactions;
    const indexInProviders = providers.indexOf(provider);
    providers.splice(indexInProviders, 1);

    this.props.onPatternGraphChanged(this.props.patternGraph);
  }


  private onInteractionDroppedOnBlock(provider: InteractionProvider, event: any) {
    const interactionName: InteractionType = event.drag.el.id;
    const interaction = this.interactionFactory.getInteraction(interactionName);

    // interaction name was invalid / not found
    if (interaction === undefined) {
      return false;
    }

    provider.interaction = interaction;

    this.props.onPatternGraphChanged(this.props.patternGraph);
    return true;
  }

  private renderInteractionProviderAsBlock(provider: InteractionProvider) {
    return (
      <InteractionProviderBlock
        key={ provider.id }
        interactionProvider={ provider }
        onDelete={ () => this.removeInteractionProvider(provider) }
        onInteractionDropped={ event => this.onInteractionDroppedOnBlock(provider, event) }
      />
    );
  }

  private renderInteractionBody() {
    return (
      <div id="interactionComponentBody">
        <div id="interactionProviders">
          { this.props.patternGraph.interactions.map(this.renderInteractionProviderAsBlock.bind(this)) }

          <button
            id="addNewInteractionProvider"
            className="floatingAddButton"
            onClick={ this.addInteractionProvider.bind(this) }>

            +
          </button>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <ViewContainer
        id="interactionConfigurationComponent"
        name="Interactions"
        activeContainerName={ this.props.activeTab.name }>

        <InteractionToolbar />
        <InteractionDiagram interactionProvider={ null } />

        {/* { this.renderInteractionBody() } */}

      </ViewContainer>
    );
  }
}