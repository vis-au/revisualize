import { TopLevelSpec } from 'vega-lite';

import CompositeTemplate from './CompositeTemplate';
import Layout from './Layout';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';

export default class SpecCompiler {

  private applyVisualMarkTemplate(spec: any, template: VisualMarkTemplate, layout: Layout) {
    spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'values': [
          {'a': 'A', 'b': 28, 'c': 'X'}, {'a': 'B','b': 55, 'c': 'X'}, {'a': 'C','b': 43, 'c': 'Y'},
          {'a': 'D','b': 91, 'c': 'X'}, {'a': 'E','b': 81, 'c': 'X'}, {'a': 'F','b': 53, 'c': 'Y'},
          {'a': 'G','b': 19, 'c': 'X'}, {'a': 'H','b': 87, 'c': 'X'}, {'a': 'I','b': 52, 'c': 'Z'}
        ]
      },
      'mark': template.type,
      'encoding': {
        'x': {'field': 'a', 'type': 'ordinal'},
        'y': {'field': 'b', 'type': 'quantitative'}
      }
    }

    return spec;
  }

  private applyCompositeTemplate(spec: any, template: CompositeTemplate, layout: Layout) {

    if (template.visualElements.length > 0) {
      const firstChild = template.visualElements[0];

      if (firstChild instanceof VisualMarkTemplate) {
        spec = this.applyVisualMarkTemplate(spec, firstChild, layout);
      }
    }

    return spec;
  }

  private applyLayout(spec: any, template: Template, layout: Layout): TopLevelSpec {
    if (spec === null) {
      return spec;
    }
    if (layout === null) {
      return spec;
    }

    if (layout.type === 'cartesian') {
      spec.encoding.x.type = 'quantitative';
      spec.encoding.y.type = 'quantitative';
    } else if (layout.type === 'histogram') {
      spec.encoding.x.type = 'ordinal';
      spec.encoding.y.type = 'quantitative';
    } else if (layout.type === 'repeat') {
      spec.spec = {
        mark: JSON.parse(JSON.stringify(spec.mark)),
        encoding: JSON.parse(JSON.stringify(spec.encoding))
      }

      delete spec.mark;
      delete spec.encoding;

      spec.repeat = {
        'column': ['a', 'c']
      }

      spec.spec.encoding.x = {
          field: { repeat: 'column' },
          type: 'ordinal'
      };
    }

    return spec;
  }

  public getVegaSpecification(templates: Template[], layout: Layout): TopLevelSpec {

    let spec: any = null;
    const template = templates[0];

    if (template instanceof VisualMarkTemplate) {
      spec = this.applyVisualMarkTemplate(spec, template, layout);
    } else if (template instanceof CompositeTemplate) {
      spec = this.applyCompositeTemplate(spec, template, layout);
    }

    this.applyLayout(spec, template, layout);

    if (spec === null) {
      spec = {};
    }

    return spec;
  }
}