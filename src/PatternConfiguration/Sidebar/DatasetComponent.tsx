import * as React from 'react';

import FieldBuildingBlock from '../../BuildingBlocks/FieldBuildingBlock';
import Pattern from '../../Model/Pattern/Pattern';

import './DatasetComponent.css';

interface Props {
  selectedPattern: Pattern;
}

export default class DatasetComponent extends React.Component<Props, {}> {


  private renderDatasetField(field: string) {
    return (
      <FieldBuildingBlock
        id={ 'patternSidebar' + this.props.selectedPattern.dataset.name + field }
        key={ field }
        className="sidebarBuildingBlock"
        field={ field }
        datasetName={ this.props.selectedPattern.dataset.name }
      />
    );
  }

  private renderDatasetFields() {
    if (this.props.selectedPattern.dataset === undefined
        || this.props.selectedPattern.dataset === null) {

      return <div className="unboundPropertyNotice">No connected dataset</div>;
    }

    const dataset = this.props.selectedPattern.dataset;

    return (
      <div id="patternSidebarDatasetBlocks" className="patternSidebarBuildingBlockColumn">
        <div id="patternSidebarDatasetFields" className="patternSidebarBuildingBlockRow">
          { dataset.fields.map(this.renderDatasetField.bind(this)) }
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div id="patternSidebarDataset" className="patternSidebarGroup">
        <h3>Dataset</h3>
        { this.renderDatasetFields() }
      </div>
    );
  }
}