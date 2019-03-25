import Template from "./Template";
import { Plot } from "./LayoutType";
import Layout from "./Layout";
import { SelectionDef } from "vega-lite/build/src/selection";
import { MarkEncoding } from "./MarkEncoding";

export default class PlotTemplate extends Template {
  public selection?: SelectionDef;
  public staticMarkProperties?: Map<MarkEncoding, any>;

  constructor(plot: Plot, visualElement: Template, parent: Template = null) {
    const plotLayout = new Layout(plot);
    const visualElements = visualElement === null ? [] : [visualElement];
    super(visualElements, plotLayout, parent);
  }
}