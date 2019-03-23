import Template from "./Template";
import { Plot } from "./LayoutType";
import Layout from "./Layout";

export default class PlotTemplate extends Template {
  constructor(plot: Plot, visualElement: Template, parent: Template = null) {
    const plotLayout = new Layout(plot);
    const visualElements = visualElement === null ? [] : [visualElement];
    super(visualElements, plotLayout, parent);
  }
}