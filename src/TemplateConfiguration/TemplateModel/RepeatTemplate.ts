import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";
import { RepeatMapping } from "vega-lite/build/src/spec/repeat";

export default class RepeatTemplate extends CompositionTemplate {
  public repeat: RepeatMapping = {};

  constructor(visualElements: Template[], parent: Template = null) {
    super('repeat', visualElements, parent);
  }
}