import Template from "./Template";
import Layout from "./Layout";

export default class CompositeTemplate extends Template {
  constructor(layout: Layout, visualElements: Template[], parent: Template) {
    super(visualElements, layout, parent);
  }
}