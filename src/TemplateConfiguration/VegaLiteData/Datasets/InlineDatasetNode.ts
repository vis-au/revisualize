import { DataFormat, InlineData, InlineDataset } from 'vega-lite/build/src/data';
import DatasetNode from './DatasetNode';

export default class InlineDatasetNode extends DatasetNode {
  public values: InlineDataset = []
  public format?: DataFormat;
  public name?: string

  public getSchema(): InlineData {
    return {
      name: this.name,
      values: this.values,
      format: this.format
    };
  }
}