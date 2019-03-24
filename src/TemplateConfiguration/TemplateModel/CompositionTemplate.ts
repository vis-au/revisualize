import Template from "./Template";
import { Composition } from "./LayoutType";
import Layout from "./Layout";

export default abstract class CompositionTemplate extends Template {
  constructor(composition: Composition, visualElements: Template[], parent: Template = null) {
    const compositionLayout = new Layout(composition);
    super(visualElements, compositionLayout, parent);
  }
}