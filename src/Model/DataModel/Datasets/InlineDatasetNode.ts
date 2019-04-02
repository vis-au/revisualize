import { DataFormat, InlineData, InlineDataset } from 'vega-lite/build/src/data';
import DatasetNode from './DatasetNode';

export default class InlineDatasetNode extends DatasetNode {
  public format?: DataFormat;

  public getSchema(): InlineData {
    return {
      name: this.name,
      values: this.values,
      format: this.format
    };
  }

  public setSchema(data: InlineData) {
    this.name = data.name;
    this.values = data.values;
    this.format = data.format;
  }
}