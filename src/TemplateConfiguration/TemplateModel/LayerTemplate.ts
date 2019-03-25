import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";
import { MarkEncoding } from "./MarkEncoding";

export default class LayerTemplate extends CompositionTemplate {
  public groupEncodings: Map<MarkEncoding, any>;

  constructor(visualElements: Template[], parent: Template = null) {
    super('overlay', visualElements, parent);
    this.groupEncodings = new Map();
  }
}