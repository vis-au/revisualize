import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";

export default class ConcatTemplate extends CompositionTemplate {
  public isVertical: boolean = true;

  constructor(visualElements: Template[], parent: Template = null) {
    super('concatenate', visualElements, parent);
  }
}