import { VisualElementType } from "./VisualElementType";

import Layout from "./Layout";

export default abstract class Template {
  public id: string;

  constructor(public visualElements: VisualElementType[], public layout: Layout) {
    this.id = `template${Math.round(Math.random() * 10000)}`
  }
}