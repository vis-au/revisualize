import { Data } from 'vega';
import DataflowGraph from './DataflowGraph';

export interface DataflowNode {
  id: string;
  name: string;
  graph: DataflowGraph;
  data: Data;
  fields: string[];
  type: 'dataset' | 'transform';
}