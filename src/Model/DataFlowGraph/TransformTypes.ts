import { Transform } from 'vega';

export type TransformGroupName = 'basic' | 'geographic' | 'layout' | 'hierarchy' | 'crossfilter';
export const transformGroupNames: TransformGroupName[] = ['basic', 'geographic', 'layout', 'hierarchy', 'crossfilter'];

export type BasicTransformType =
  | 'aggregate'
  | 'bin'
  | 'collect'
  | 'countpattern'
  | 'cross'
  | 'density'
  | 'extent'
  | 'filter'
  | 'flatten'
  | 'fold'
  | 'formula'
  | 'identifier'
  | 'impute'
  | 'joinaggregate'
  | 'lookup'
  | 'pivot'
  | 'project'
  | 'sample'
  | 'sequence'
  | 'window';

export type GeographicTransformType =
  | 'contour'
  | 'geojson'
  | 'geopath'
  | 'geopoint'
  | 'geoshape'
  | 'graticule';

export type LayoutTransformType =
  | 'linkpath'
  | 'pie'
  | 'stack'
  | 'force'
  | 'voronoi'
  | 'wordcloud';

export type HierarchyTransformType =
  | 'nest'
  | 'stratify'
  | 'treelinks'
  | 'pack'
  | 'partition'
  | 'tree'
  | 'treemap';

export type CrossFilterTransformType =
  | 'crossfilter'
  | 'resolvefilter';

export type TransformType = BasicTransformType | GeographicTransformType | LayoutTransformType
  | HierarchyTransformType | CrossFilterTransformType;

export const transformTypeList = ['aggregate', 'bin', 'collect', 'countpattern', 'contour', 'extent',
  'filter', 'flatten', 'fold', 'formula', 'geojson', 'geopoint', 'graticule', 'identifier',
  'impute', 'lookup', 'sample', 'stack', 'window', 'wordcloud'];

export const BasicTransformsByName: Map<BasicTransformType, Transform> = new Map();
BasicTransformsByName.set('aggregate', {
  as: [''],
  fields: [''],
  groupby: [''],
  ops: ['sum'],
  type: 'aggregate',
});
BasicTransformsByName.set('collect', {
  sort: { field: '', order: 'descending' },
  type: 'collect',
});
BasicTransformsByName.set('filter', {
  expr: '',
  type: 'filter',
});
BasicTransformsByName.set('fold', {
  as: ['', ''],
  fields: [],
  type: 'fold',
});
BasicTransformsByName.set('formula', {
  as: '',
  expr: '',
  type: 'formula',
});
BasicTransformsByName.set('project', {
  type: 'project'
});

const GeographicTransformsByName: Map<string, Transform> = new Map();
const LayoutTransformsByName: Map<string, Transform> = new Map();
LayoutTransformsByName.set('stack', {
  field: '',
  groupby: [''],
  type: 'stack',
});

const HierarchyTransformsByName: Map<string, Transform> = new Map();
const CrossFilterTransformsByName: Map<string, Transform> = new Map();

export const TransformsByGroup: Map<TransformGroupName, Map<any, Transform>> = new Map();

TransformsByGroup.set('basic', BasicTransformsByName);
TransformsByGroup.set('geographic', GeographicTransformsByName);
TransformsByGroup.set('layout', LayoutTransformsByName);
TransformsByGroup.set('hierarchy', HierarchyTransformsByName);
TransformsByGroup.set('crossfilter', CrossFilterTransformsByName);



const aggregateTransformProperties = [
  'type', 'signal', 'groupby', 'fields', 'ops', 'as', 'drop', 'cross', 'key'
];
const stackTransformProperties = [
  'type', 'field', 'groupby', 'sort', 'offset', 'as'
];
const collectTransformProperties = [
  'type', 'collect', 'sort'
];
const filterTransformProperties = [
  'type', 'expr'
];
const foldTransformProperties = [
  'type', 'fields', 'as'
];
const formulaTransformProperties = [
  'type', 'expr', 'as', 'initonly'
];
const projectTransformProperties: string[] = [

];

export const TransformPropertiesByname: Map<TransformType, string[]> = new Map();

TransformPropertiesByname.set('aggregate', aggregateTransformProperties);
TransformPropertiesByname.set('stack', stackTransformProperties);
TransformPropertiesByname.set('collect', collectTransformProperties);
TransformPropertiesByname.set('filter', filterTransformProperties);
TransformPropertiesByname.set('fold', foldTransformProperties);
TransformPropertiesByname.set('formula', formulaTransformProperties);
TransformPropertiesByname.set('project', projectTransformProperties);