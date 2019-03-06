import { jsPlumb } from 'jsplumb';
import * as React from 'react';

import InteractionProvider from '../../Model/Interactions/InteractionProvider';
import DiagramEditor from '../../Widgets/DiagramEditor';

import './InteractionDiagram.css';

interface Props {
  interactionProvider: InteractionProvider[];
}

export default class InteractionDiagram extends React.Component<Props, {}> {
  private dragPlumbing: any;

  constructor(props: Props) {
    super(props);
    this.dragPlumbing = jsPlumb.getInstance();
  }

  private onNewConnection(connection: any) {
    return false;
  }

  private onDetachedConnection(connection: any) {
    return false;
  }

  private onDiagramClicked() {
    this.setState({ selectedInteraction: null });
  }

  private renderBlocks() {
    return false;
  }

  public render() {
    return (
      <DiagramEditor
        id="interactionDiagram"
        dragPlumbing={ this.dragPlumbing }
        plumbingConfig={ {} }
        onDetachedConnection={ this.onDetachedConnection.bind(this) }
        onNewConnection={ this.onNewConnection.bind(this) }
        onDiagramClicked={ this.onDiagramClicked.bind(this) }
        renderBlocks={ this.renderBlocks.bind(this) }
      />
    );
  }
}