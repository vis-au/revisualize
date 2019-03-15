import { TopLevelSpec } from "vega-lite";

import Template from "./Template";
import VisualMarkTemplate from "./VisualMark";

export default class SpecCompiler {

  public getVegaSpecification(template: Template): TopLevelSpec {

    const spec: any = {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": [
          {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
          {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
          {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    }


    if (template instanceof VisualMarkTemplate) {
      spec.mark = template.type;
    }

    return spec;
  }
}