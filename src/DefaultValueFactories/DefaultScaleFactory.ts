import { Scale } from 'vega';

export default class DefaultScaleFactory {
  private getColorScales() {
    const categoricalColorScale: Scale = {
      name: 'categoricalColor',
      range: 'category',
      type: 'ordinal',
    };
    const continuousColor: Scale = {
      name: 'continuousColor',
      range: 'diverging',
      type: 'linear',
    };

    return [categoricalColorScale, continuousColor];
  }

  public getDefaultScales(): Scale[] {
    return this.getColorScales();
  }
}