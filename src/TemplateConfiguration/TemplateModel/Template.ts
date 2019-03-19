import Layout from './Layout';

export default abstract class Template {
  public id: string;
  public hierarchyLevel: number;

  constructor(public visualElements: Template[], public layout: Layout, public parent: Template) {
    this.id = `template${Math.round(Math.random() * 10000)}`;
    this.hierarchyLevel = -1;
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

    return Math.max(...subHierarchies) + 1;
  }
}