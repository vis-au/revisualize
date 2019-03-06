import { ArbitraryValueRef, ProductionRule } from 'vega';

export class DynamicValue {
  public name: string;
  public productionRule: ProductionRule<ArbitraryValueRef>;
}