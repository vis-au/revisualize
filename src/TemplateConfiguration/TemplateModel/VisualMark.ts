import Template from "./Template";
import { Mark } from "vega-lite/build/src/mark";

export default class VisualMark extends Template {
  constructor(visualElement: Mark, parent: Template) {
    super([], null, parent);
  }
}