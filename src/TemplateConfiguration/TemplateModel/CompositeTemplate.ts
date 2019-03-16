import Layout from './Layout';
import Template from './Template';

export default class CompositeTemplate extends Template {
  constructor(layout: Layout, visualElements: Template[], parent: Template) {
    super(visualElements, layout, parent);
  }
}