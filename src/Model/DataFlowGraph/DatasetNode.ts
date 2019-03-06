import { Data } from 'vega';
import UtilityFunctions from '../../UtilityFunctions';
import DataflowGraph from './DataflowGraph';
import { DataflowNode } from './DataflowNode';

export default class DatasetNode implements DataflowNode {
  public data: Data;
  public graph: DataflowGraph;
  public values: any[];

  private _id: string;
  private _fields: string[];

  constructor() {
    this._id = UtilityFunctions.getRandomID('datasetNode');
  }

  public get id(): string {
    return this._id;
  }

  public get fields(): string[] {
    // TODO: get into actual json object
    return this._fields;
  }
  public set fields(fields: string[]) {
    // FIXME: fields property should be read-only
    this._fields = fields;
  }

  public get name(): string {
    return this.data.name;
  }

  public get type(): 'dataset' {
    return 'dataset';
  }
}