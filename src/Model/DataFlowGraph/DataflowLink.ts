import {Connection} from 'jsplumb';
import {DataflowNode} from './DataflowNode';

export default class DatasetLink {
  public source: DataflowNode;
  public target: DataflowNode;
  public connection: Connection;
}