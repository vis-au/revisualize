import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import DatasetNode from './DatasetNode';

export default class NamedDataSourceNode extends DatasetNode {
  public name: string;
  public format: DataFormat;

  public getSchema(): NamedData {
    return {
      name: this.name,
      format: this.format
    }
  }
}