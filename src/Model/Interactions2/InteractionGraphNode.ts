import { EventSelector, Expr, Field, SignalRef } from 'vega';
import { InteractionGraphOperator } from './InteractionGraphOperator';

export type InteractionGraphNode = EventSelector | Field | SignalRef | Expr
  | InteractionGraphOperator;