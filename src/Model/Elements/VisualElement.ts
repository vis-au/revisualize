import { ArbitraryValueRef, Data, Mark, ProductionRule } from 'vega';
import { DynamicValue } from '../Interactions/DynamicValue';

export type BasicVisualVariableName =
    'x' | 'x2' | 'xc' | 'width' | 'y' | 'y2' | 'yc' | 'height' | 'opacity' | 'fill' | 'fillOpacity'
  | 'stroke' | 'strokeWidth' | 'strokeOpacity' | 'strokeDash' | 'strokeDashOffset' | 'strokeCap'
  | 'strokeJoin' | 'strokeMiterLimit' | 'cursor' | 'tooltip';

export const BasicVisualVariableList: BasicVisualVariableName[] =  ['x', 'x2', 'xc', 'width', 'y',
  'y2', 'yc', 'height', 'opacity', 'fill', 'fillOpacity', 'stroke', 'strokeWidth', 'strokeOpacity',
  'strokeDash', 'strokeDashOffset', 'strokeCap', 'strokeJoin', 'strokeMiterLimit', 'cursor',
  'tooltip'];

export type TextVisualVariableName =
  | BasicVisualVariableName
  | 'text' | 'align' | 'angle' | 'baseline' | 'dir' | 'dx' | 'dy' | 'ellipsis' | 'font' | 'fontSize'
  | 'fontWeight' | 'fontStyle' | 'limit' | 'radius' | 'theta';

export const TextVisualVariableList: TextVisualVariableName[] = [ 'text', 'align', 'angle',
  'baseline', 'dir', 'dx', 'dy', 'ellipsis', 'font', 'fontSize', 'fontWeight', 'fontStyle', 'limit',
  'radius', 'theta'
];

export type SymbolVisualVariableName =
 | BasicVisualVariableName
 | 'size' | 'shape';

export const SymbolVisualVariableList: SymbolVisualVariableName[] = ['size', 'shape'];

export type LineVisualVariableName =
 | BasicVisualVariableName
 | 'interpolate' | 'tension';

export const LineVisualVariableList: LineVisualVariableName[] = ['interpolate', 'tension'];

export type RectVisualVariableName =
  | BasicVisualVariableName
  | 'clip';

export type PathVisualVariableName =
  | BasicVisualVariableName
  | 'path';

export const PathVisualVariableList: PathVisualVariableName[] = ['path'];

export const RectVisualVariableList: RectVisualVariableName[] = ['clip'];

export type ArbitraryVisualVariableName =
  | TextVisualVariableName
  | SymbolVisualVariableName
  | LineVisualVariableName
  | RectVisualVariableName
  | PathVisualVariableName;

export interface VisualElement {
  mark: Mark;
  dataset: Data;
  mainVariables: ArbitraryVisualVariableName[];
  bindings: Map<ArbitraryVisualVariableName, ProductionRule<ArbitraryValueRef> | DynamicValue>;
  update: () => void;
}