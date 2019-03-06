import { Data, Spec, Transform } from 'vega';
import UtilityFunctions from '../../UtilityFunctions';
import DataflowGraph from './DataflowGraph';
import { DataflowNode } from './DataflowNode';

export default class TransformNode implements DataflowNode {
  private _id: string;
  private _name: string;
  private _transform: Transform;
  private _graph: DataflowGraph;
  private _fields: string[] = [];

  constructor() {
    this._id = UtilityFunctions.getRandomID('transformNode');
  }

  public get id(): string {
    return this._id;
  }

  public get type(): 'transform' {
    return 'transform';
  }

  public get name(): string {
    if (this._name === undefined) {
      return this.transform.type;
    }

    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get transform(): Transform {
    return this._transform;
  }

  public set transform(transform: Transform) {
    this._transform = transform;

    if (this._graph !== undefined) {
      this.updateFields();
    }
  }

  public get graph(): DataflowGraph {
    return this._graph;
  }

  public set graph(graph: DataflowGraph) {
    this._graph = graph;
    this._name = `${this.transform.type}${graph.getNumberOfTransformNodesOfType(this.transform.type)}`;
    this.updateFields();
  }

  public async updateFields() {
    const dummySpec: Spec = {
      $schema: 'https://vega.github.io/schema/vega/v4.json',
      data: [
        this.graph.getDataForTransformNode(this)
      ]
    };

    this.graph.getFieldsForDataInSpecByName(dummySpec, this.name)
      .then(fields => { this._fields = fields; });
  }

  public get fields() {
    return this._fields;
  }

  public get data(): Data {
    return this.graph.getDataForTransformNode(this);
  }
}