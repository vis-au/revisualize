import { InteractionGraphNode } from './InteractionGraphNode';

export interface InteractionGraphOperator {
  nodes: InteractionGraphNode[];
  apply: () => void;
  toString: () => string;
}