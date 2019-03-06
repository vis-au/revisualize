import { csvParse } from 'd3';
import * as React from 'react';

import DatasetNode from '../../Model/DataFlowGraph/DatasetNode';
import { DatasetPreset, PRESET_DATASETS } from './DatasetPreset';

import './DataImport.css';

interface Props {
  visible: boolean;
  hidePanel: () => void;
  addDatasetNodeToGraph: (node: DatasetNode) => void;
}

export default class DataImport extends React.Component<Props, {}> {

  // adapted from https://stackoverflow.com/a/26298948
  private readFileFromDisk(e: any) {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (onloadEvent: any) => {
      const contents = onloadEvent.target;
      this.convertCSVToDatasetNode(contents.result);
    }

    reader.readAsText(file);
  }

  private convertCSVToDatasetNode(contents: any) {
    const csvFile = csvParse(contents);
    const datasetNode = new DatasetNode();
    datasetNode.fields = csvFile.columns;
    datasetNode.data = {
      name: 'new Dataset',
      values: csvFile
    };

    this.props.addDatasetNodeToGraph(datasetNode);
    this.props.hidePanel();
  }

  private addPreset(preset: DatasetPreset) {
    const node = new DatasetNode();
    const fileType = preset.url.includes('.json')
      ? 'json'
      : preset.url.includes('.csv') ? 'csv' : null;

    node.data = {
      name: preset.name,
      url: preset.url,
      format: {
        type: fileType,
        parse: 'auto'
      }
    };

    if (preset.url.includes('.json')) {
      fetch(preset.url)
        .then(response => response.json())
        .then(dataArray => {
          node.fields = Object.keys(dataArray[0]);
          node.values = dataArray;
          this.props.addDatasetNodeToGraph(node);
          this.props.hidePanel();
          console.log(dataArray)
        });
    } else if (preset.url.includes('.csv')) {
      const reader = new FileReader();

      reader.onloadend = (e: any) => {
        const dataArray = csvParse(e.srcElement.result);
        node.fields = Object.keys(dataArray[0]);
        node.values = dataArray;
        this.props.addDatasetNodeToGraph(node);
        this.props.hidePanel();
        console.log(dataArray)
      };

      fetch(preset.url)
        .then(res => res.blob())
        .then(blob => reader.readAsText(blob));
    }

  }

  private renderPreset(preset: DatasetPreset) {
    return (
      <div className="preset" key={ preset.name }>
        <button onClick={ () => this.addPreset(preset) }>
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
        <input id="addDatasetFromDisk" type="file" onChange={ this.readFileFromDisk.bind(this) } />
      </div>
    );
  }

  public render() {
    if (!this.props.visible) { return false; }

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