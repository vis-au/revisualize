import Template from "./Template";
import { Mark } from "vega-lite/build/src/mark";

export default class VisualMarkTemplate extends Template {
  constructor(public type: Mark, parent: Template) {
    super([], null, parent);
  }
}