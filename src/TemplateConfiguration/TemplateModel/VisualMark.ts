import { Mark } from 'vega-lite/build/src/mark';
import Template from './Template';

export default class VisualMarkTemplate extends Template {
  constructor(public type: Mark, parent: Template) {
    super([], null, parent);
  }
}