import { Resolve } from 'vega-lite/build/src/resolve';
import { Composition } from './LayoutType';
import Template from './Template';

export default abstract class CompositionTemplate extends Template {
  public resolve: Resolve;

  constructor(composition: Composition, visualElements: Template[], parent: Template = null) {
    super(visualElements, composition, parent);
  }
}