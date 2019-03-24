import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";

export default class LayerTemplate extends CompositionTemplate {
  constructor(visualElements: Template[], parent: Template = null) {
    super('overlay', visualElements, parent);
  }
}