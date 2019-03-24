import CompositionTemplate from "./CompositionTemplate";
import Template from "./Template";

export default class FacetTemplate extends CompositionTemplate {
  public facetedFields: string[] = [];

  constructor(visualElements: Template[], parent: Template = null) {
    super('facet', visualElements, parent);
  }
}