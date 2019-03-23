import Layout from './Layout';
import { LayoutType, Plot, Composition } from './LayoutType';
import { isAtomicSchema, isConcatenateSchema, isOverlaySchema, isRepeatSchema } from './SpecUtils';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';
import CompositionTemplate from './CompositionTemplate';
import PlotTemplate from './PlotTemplate';
import { MarkEncoding } from './MarkEncoding';

export default class SpecDecompiler {
  private getAtomicLayout(spec: any): Layout {
    let layoutType: LayoutType = null;

    if (spec.encoding.x !== undefined && spec.encoding.y !== undefined) {
      if (spec.encoding.y.type === 'quantitative') {
        if (spec.encoding.x.type === 'ordinal') {
          layoutType = 'histogram'
        } else if (spec.encoding.x.type === 'quantitative') {
          layoutType = 'cartesian';
        }
      }
    }

    return new Layout(layoutType);
  }

  private decomposeOverlay(spec: any): Template[] {
    return [];
  }

  private decomposeRepeat(spec: any): Template[] {
    return [];
  }

  private decomposeConcat(spec: any): Template[] {
    return [];
  }

  public decompile(spec: any): Template {
    let rootTemplate: Template = null;
    let layout: Layout = null;
    let visualElements: Template[] = [];

    if (isAtomicSchema(spec)) {
      layout = this.getAtomicLayout(spec);
      rootTemplate = new PlotTemplate(layout.type as Plot, null, null);

      Object.keys(spec.encoding).forEach((encoding: MarkEncoding) => {
        rootTemplate.setEncodedValue(encoding, spec.encoding[encoding]);
      });

      const markTemplate = new VisualMarkTemplate(spec.mark, rootTemplate);
      visualElements.push(markTemplate);
    } else if (isOverlaySchema(spec)) {
      layout = new Layout('overlay');
      rootTemplate = new CompositionTemplate(layout.type as Composition, null, null);
      visualElements = this.decomposeOverlay(spec);
    } else if (isRepeatSchema(spec)) {
      layout = new Layout('repeat');
      rootTemplate = new CompositionTemplate(layout.type as Composition, null, null);
      visualElements = this.decomposeRepeat(spec);
    } else if (isConcatenateSchema(spec)) {
      layout = new Layout('concatenate');
      rootTemplate = new CompositionTemplate(layout.type as Composition, null, null);
      visualElements = this.decomposeConcat(spec);
    }

    rootTemplate.layout = layout;
    rootTemplate.visualElements = visualElements;

    return rootTemplate;
  }
}