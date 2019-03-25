import Template from "./Template";
import { Composition } from "./LayoutType";

export default abstract class CompositionTemplate extends Template {
  constructor(composition: Composition, visualElements: Template[], parent: Template = null) {
    super(visualElements, composition, parent);
  }
}