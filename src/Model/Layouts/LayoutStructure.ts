import { Axis, Data, Legend, Mark, Scale, Signal } from 'vega';
import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName } from '../Elements/VisualElement';
import Pattern from '../Pattern/Pattern';

export interface LayoutStructure {
  name: string;
  pattern: Pattern; // layout must exist in pattern
  dataset: DataflowNode; // when dataset is set on pattern, trigger set dataset on layouts as well
  scales: Scale[]; // list of scales produced by the layout
  blockedVisualVariables: ArbitraryVisualVariableName[]; // list of variables occupied by layout
  legends?: Legend[]; // list of legends produced by layout
  axes?: Axis[]; // list of axes produced by layout
  transformedMarks?: Mark[]; // layout may directly set values to mark
  transformedDatasets?: Data[]; // layout may add transforms to the dataset
  transformedScales?: Scale[]; // layout may require 'static' scales that user cannot modify
  transformedSignals?: Signal[]; // layout may require 'static' signals that user cannot modify
  update: () => void;
}