import { Scale, Signal } from 'vega';
import { DynamicValue } from './DynamicValue';
import InteractionProvider from './InteractionProvider';

export interface Interaction {
  name: string;
  signals: Signal[];
  inputMappings?:  Map<string, string | Signal | Scale>;
  outputMappings?:  DynamicValue[];
  provider?: InteractionProvider;
  update: () => void;
}