import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import DatasetNode from './DatasetNode';

export default class NamedDataSourceNode extends DatasetNode {
  public format: DataFormat;
  public datasets: Datasets;

  public getSchema(): NamedData {
    return {
      name: this.name,
      format: this.format
    }
  }

  public getDatasets(): Datasets {
    return this.datasets;
  }

  public setSchema(data: NamedData) {
    this.name = data.name;
    this.format = data.format;
  }
}