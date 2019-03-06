import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import DatasetLink from '../Model/DataFlowGraph/DataflowLink';
import { DataflowNode } from '../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../Model/DataFlowGraph/TransformNode';

export default class DefaultDataGraphFactory {
  public getDefaultNodeGraph() {
    const graph = new DataflowGraph([], []);
    // const defaultTransforms = this.getDefaultTransformNodes();
    const defaultTransforms: TransformNode[] = [];
    const defaultDatasets = this.getDefaultDatasetNodes(graph);

    const defaultNodes: DataflowNode[] = (defaultTransforms as DataflowNode[]).concat(defaultDatasets as DataflowNode[]);
    // let defaultNodes: DataflowNode[] = [];

    const defaultLinks = this.getDefaultLinks(defaultDatasets, defaultTransforms);

    graph.nodes = defaultNodes;
    // graph.links = defaultLinks;

    graph.nodes.forEach(node => node.graph = graph);

    return graph;
  }

  private getDefaultLinks(datasets: DatasetNode[], transforms: TransformNode[]) {
    const link1 = new DatasetLink();
    link1.source = datasets[0];
    link1.target = transforms[0];

    const transformLinks = transforms
      .map((transform, i) => {
        if (i === transforms.length - 1) { return null; }

        const newLink = new DatasetLink();
        newLink.source = transform;
        newLink.target = transforms[i + 1];

        return newLink;
      })
      .filter(d => d !== null);

    return transformLinks.concat(link1);
  }

  public getDefaultTransformNodes() {

    const formula = new TransformNode();
    formula.transform = {
      as: 'value',
      expr: '1',
      type: 'formula',
    };

    const fold = new TransformNode();
    fold.transform = {
      as: ['dimension', 'category'],
      fields:  ['Miles_per_Gallon', 'Cylinders', 'Displacement', 'Horsepower',
        'Weight_in_lbs',	'Acceleration', 'Year',	'Origin'],
      type: 'fold',
    };

    const aggregate = new TransformNode();
    aggregate.transform = {
      as: ['value'],
      fields: ['value'],
      groupby: ['dimension', 'category'],
      ops: ['sum'],
      type: 'aggregate',
    };

    const collect = new TransformNode();
    collect.transform = {
      sort: {
        field: 'category',
        order: 'descending'
      },
      type: 'collect',
    };

    const stack = new TransformNode();
    stack.transform = {
      field: 'value',
      groupby: ['dimension'],
      type: 'stack',
    };

    return [formula, fold, aggregate, collect, stack];
  }

  public getDefaultDatasetNodes(graph: DataflowGraph) {
    const cars = new DatasetNode();
    cars.graph = graph;
    cars.fields = ['Miles_per_Gallon', 'Cylinders', 'Displacement', 'Horsepower',
      'Weight_in_lbs',	'Acceleration', 'Year',	'Origin', 'Name'];
    cars.data = {
      name: 'Cars',
      url: 'https://vega.github.io/vega-lite/data/cars.json'
    };
    cars.values = [
      {
        Acceleration: 12,
        Cylinders: 8,
        Displacement: 307,
        Horsepower: 130,
        Miles_per_Gallon: 18,
        Name: 'chevrolet chevelle malibu',
        Origin: 'USA',
        Weight_in_lbs: 3504,
        Year: '1970-01-01'
      },
      {
        Acceleration: 11.5,
​​​        Cylinders: 8,
        Displacement: 350,
        Horsepower: 165,
        Miles_per_Gallon: 15,
        Name: 'buick skylark 320',
        Origin: 'USA',
        Weight_in_lbs: 3693,
        Year: '1970-01-01'
      },
      {
        Acceleration: 11,
        Cylinders: 8,
        Displacement: 318,
        Horsepower: 150,
        Miles_per_Gallon: 18,
        Name: 'plymouth satellite',
        Origin: 'USA',
        Weight_in_lbs: 3436,
        Year: '1970-01-01'
      },
      {
        Acceleration: 12,
        Cylinders: 8,
        Displacement: 304,
        Horsepower: 150,
        Miles_per_Gallon: 16,
        Name: 'amc rebel sst',
        Origin: 'USA',
        Weight_in_lbs: 3433,
        Year: '1970-01-01'
      },
      {
        Acceleration: 10,
        Cylinders: 8,
        Displacement: 429,
        Horsepower: 198,
        Miles_per_Gallon: 15,
        Name: 'ford galaxie 500',
        Origin: 'USA',
        Weight_in_lbs: 4341,
        Year: '1970-01-01'
      },
      {
        Acceleration: 9,
        Cylinders: 8,
        Displacement: 454,
        Horsepower: 220,
        Miles_per_Gallon: 14,
        Name: 'chevrolet impala',
        Origin: 'USA',
        Weight_in_lbs: 4354,
        Year: '1970-01-01'
      },
      {
        Acceleration: 12,
        Cylinders: 8,
        Displacement: 307,
        Horsepower: 130,
        Miles_per_Gallon: 18,
        Name: 'chevrolet chevelle malibu',
        Origin: 'USA',
        Weight_in_lbs: 3504,
        Year: '1970-01-01'
      },
      {
        Acceleration: 11.5,
​​​        Cylinders: 8,
        Displacement: 350,
        Horsepower: 165,
        Miles_per_Gallon: 15,
        Name: 'buick skylark 320',
        Origin: 'USA',
        Weight_in_lbs: 3693,
        Year: '1970-01-01'
      },
      {
        Acceleration: 11,
        Cylinders: 8,
        Displacement: 318,
        Horsepower: 150,
        Miles_per_Gallon: 18,
        Name: 'plymouth satellite',
        Origin: 'USA',
        Weight_in_lbs: 3436,
        Year: '1970-01-01'
      },
      {
        Acceleration: 12,
        Cylinders: 8,
        Displacement: 304,
        Horsepower: 150,
        Miles_per_Gallon: 16,
        Name: 'amc rebel sst',
        Origin: 'USA',
        Weight_in_lbs: 3433,
        Year: '1970-01-01'
      },
      {
        Acceleration: 10,
        Cylinders: 8,
        Displacement: 429,
        Horsepower: 198,
        Miles_per_Gallon: 15,
        Name: 'ford galaxie 500',
        Origin: 'USA',
        Weight_in_lbs: 4341,
        Year: '1970-01-01'
      }
    ];

    return [cars];
  }
}