import Template from "./Template";
import { Composition } from "./LayoutType";
import { Resolve } from "vega-lite/build/src/resolve";

export default abstract class CompositionTemplate extends Template {
  public resolve: Resolve;

  constructor(composition: Composition, visualElements: Template[], parent: Template = null) {
    super(visualElements, composition, parent);
  }
}