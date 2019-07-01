import * as React from 'react';
import { DatasetNode, GraphNode } from 'remodel-vis';

import './DatasetPanel.css';

interface Props {
  datasets: GraphNode[]
}
interface State {
}

export default class DatasetPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.renderDataset = this.renderDataset.bind(this);
  }

  private renderDataset(dataset: GraphNode) {
    return (
      <div className="sidePanelDataset">{ dataset.name }</div>
    );
  }

  public render() {
    return (
      <div className="datasetPanel">
        { this.props.datasets.filter(d => d instanceof DatasetNode).map(this.renderDataset) }
      </div>
    );
  }
}