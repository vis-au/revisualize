import Layout from './Layout';
import { MarkEncoding } from './MarkEncoding';
import { FieldDef } from 'vega-lite/build/src/fielddef';

export default abstract class Template {
  public id: string;
  public hierarchyLevel: number;

  public encodings: Map<MarkEncoding, FieldDef<any>>;

  constructor(public visualElements: Template[], public layout: Layout, public parent: Template) {
    this.id = `template${Math.round(Math.random() * 10000)}`;
    this.hierarchyLevel = -1;

    this.encodings = new Map();
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

  public setEncodedValue(encoding: MarkEncoding, value: FieldDef<any>) {
    this.encodings.set(encoding, value);
  }

  public getEncodedValue(encoding: MarkEncoding) {
    return this.encodings.get(encoding);
  }
}