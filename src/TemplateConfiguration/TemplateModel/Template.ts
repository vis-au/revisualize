import { Config } from 'vega-lite';
import { BarBinSpacingMixins } from 'vega-lite/build/src/mark';

import { Data, isInlineData, isNamedData, isUrlData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import InlineDatasetNode from '../VegaLiteData/Datasets/InlineDatasetNode';
import NamedDataSourceNode from '../VegaLiteData/Datasets/NamedDataSourceNode';
import URLDatasetNode from '../VegaLiteData/Datasets/URLDatasetNode';
import GraphNode from '../VegaLiteData/GraphNode';
import { LayoutType } from './LayoutType';
import { MarkEncoding } from './MarkEncoding';

export default abstract class Template {
  public id: string;
  public hierarchyLevel: number;

  private dataNode: GraphNode;
  private transforms: Transform[];

  public description: string;
  public bounds: any;
  public spacing: BarBinSpacingMixins;
  public width: number;
  public height: number;
  public config: Config;

  public encodings: Map<MarkEncoding, any>;
  public overwrittenEncodings: Map<MarkEncoding, any>

  constructor(public visualElements: Template[], public layout: LayoutType, public parent: Template) {
    this.id = `template${Math.round(Math.random() * 10000)}`;
    this.hierarchyLevel = -1;

    this.dataNode = null;
    this.transforms = [];

    this.encodings = new Map();
    this.overwrittenEncodings = new Map();
  }

  /**
   * Returns the flattened hierarchy of templates succeeding this one.
   */
  public getFlatHierarchy(): Template[] {
    const successors: Template[] = [];

    successors.push(this);

    this.visualElements.forEach(successor => {
      successors.push(...successor.getFlatHierarchy());
    });

    return successors;
  }

  /**
   * Returns the hierarchy level of this template, starting at 0.
   */
  public getHierarchyLevel(): number {
    if (this.hierarchyLevel > -1) {
      return this.hierarchyLevel;
    }

    // since the template may have visual elements from different leves, output the highest value
    // between all sub-hierarchies
    if (this.visualElements.length === 0) {
      return 0;
    }

    const subHierarchies = this.visualElements.map(v => v.getHierarchyLevel());

    this.hierarchyLevel = Math.max(...subHierarchies) + 1;
    return this.hierarchyLevel;
  }

  public setEncodedValue(encoding: MarkEncoding, value: any) {
    this.encodings.set(encoding, value);
  }

  public getEncodedValue(encoding: MarkEncoding) {
    return this.encodings.get(encoding);
  }

  public get data(): Data {
    if (this.dataNode === null) {
      return this.dataNode as any;
    } else {
      return this.dataNode.getSchema();
    }
  }

  public set data(data: Data) {
    if (data === undefined) {
      return;
    }

    if (this.dataNode === null) {
      if (isUrlData(data)) {
        this.dataNode = new URLDatasetNode();
      } else if (isNamedData(data)) {
        this.dataNode = new NamedDataSourceNode();
      } else if (isInlineData(data)) {
        this.dataNode = new InlineDatasetNode();
      }
    }

    this.dataNode.setSchema(data);
  }

  public get transform(): Transform[] {
    // if (this.dataNode === null) {
    //   return this.transforms;
    // }

    // return this.dataNode.getTransformList();
    return this.transforms;
  }

  public set transform(transforms: Transform[]) {
    if (transforms === undefined) {
      return;
    }

    this.transforms = transforms;
  }
}