import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";
import { Repeat } from "vega-lite/build/src/repeat";

export default class RepeatTemplate extends CompositionTemplate {
  public repeat: Repeat = {};

  constructor(visualElements: Template[], parent: Template = null) {
    super('repeat', visualElements, parent);
  }
}