import { isConcatSpec } from 'vega-lite/build/src/spec';
import CompositeTemplate from './CompositeTemplate';
import Layout from './Layout';
import { LayoutType } from './LayoutType';
import { isAtomicSchema, isConcatenateSchema, isOverlaySchema, isRepeatSchema } from './SpecUtils';
import Template from './Template';
import VisualMarkTemplate from './VisualMark';

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
    const rootTemplate: Template = new CompositeTemplate(null, [], null);
    let layout: Layout = null;
    let visualElements: Template[] = [];

    if (isAtomicSchema(spec)) {
      layout = this.getAtomicLayout(spec);
      visualElements.push(new VisualMarkTemplate(spec.mark, rootTemplate));
    } else if (isOverlaySchema(spec)) {
      layout = new Layout('overlay');
      visualElements = this.decomposeOverlay(spec);
    } else if (isRepeatSchema(spec)) {
      layout = new Layout('repeat');
      visualElements = this.decomposeRepeat(spec);
    } else if (isConcatenateSchema(spec)) {
      layout = new Layout('concatenate');
      visualElements = this.decomposeConcat(spec);
    }

    rootTemplate.layout = layout;
    rootTemplate.visualElements = visualElements;

    return rootTemplate;
  }
}