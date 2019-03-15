import Layout from "./Layout";

export default abstract class Template {
  public id: string;

  constructor(public visualElements: Template[], public layout: Layout, public parent: Template) {
    this.id = `template${Math.round(Math.random() * 10000)}`
  }
}