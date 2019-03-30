import * as React from 'react';

import DatasetNode from '../../Model/DataFlowGraph/DatasetNode';
import DataImporter from '../../TemplateConfiguration/VegaLiteData/DataImporter';
import { DatasetPreset, PRESET_DATASETS } from './DatasetPreset';

import './DataImportPanel.css';

interface Props {
  visible: boolean;
  hidePanel: () => void;
  addDatasetNodeToGraph: (node: DatasetNode) => void;
}

export default class DataImportPanel extends React.Component<Props, {}> {
  private dataImporter: DataImporter;

  constructor(props: Props) {
    super(props);

    this.dataImporter = new DataImporter();
    this.dataImporter.onNewDataset = this.onNewDataset.bind(this);
  }

  private onNewDataset(node: DatasetNode) {
    this.props.hidePanel();
    this.props.addDatasetNodeToGraph(node);
  }

  private renderPreset(preset: DatasetPreset) {
    return (
      <div className="preset" key={ preset.name }>
        <button onClick={ () => this.dataImporter.importPreset(preset) }>
          <i className="material-icons">folder_open</i>

          { preset.name }
        </button>
        <span className="presetUrl">{ preset.url }</span>
      </div>
    );
  }

  private renderPresets() {
    const presets = PRESET_DATASETS;

    return (
      <div id="dataImportPresets" className="panel">
        <h2>Presets<span className="delete" onClick={ this.props.hidePanel }></span></h2>
        { presets.map(this.renderPreset.bind(this)) }
        <p>Select one of the items in the list above to add it to the dataflow graph.</p>
      </div>
    );
  }

  private renderFileInput() {
    return (
      <div id="dataImportFromDisk" className="panel">
        <h2>From Disk</h2>
        <input id="addDatasetFromDisk" type="file" onChange={ this.dataImporter.readFileFromDisk } />
      </div>
    );
  }

  public render() {
    if (!this.props.visible) {
      return false;
    }

    return (
      <div id="dataImport" style={{ height: window.innerHeight }}>
        <div id="dataImportPanel">
          <div id="dataImportPanelOptions" className="panel">
            { this.renderPresets() }
            { this.renderFileInput() }
          </div>
        </div>
      </div>
    );
  }
}