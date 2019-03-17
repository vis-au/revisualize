import Layout from './Layout';

export default abstract class Template {
  public id: string;

  constructor(public visualElements: Template[], public layout: Layout, public parent: Template) {
    this.id = `template${Math.round(Math.random() * 10000)}`
  }

  public getFlatHierarchy(): Template[] {
    const successors: Template[] = [];

    successors.push(this);

    this.visualElements.forEach(successor => {
      successors.push(...successor.getFlatHierarchy());
    });

    return successors;
  }
}