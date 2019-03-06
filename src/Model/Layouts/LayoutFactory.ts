import TwoDimensionalPlot from './2DPlot';
import Histogram from './Histogram';
import { LayoutStructure } from './LayoutStructure';
import List from './List';
import ParallelPlot from './ParallelPlot';
import RadialLayout from './Radial';

export type LayoutType = 'List' | 'Parallel_Plot' | 'Histogram' | '_D_Plot' | 'Radial';

export default class LayoutFactory {
  public getLayout(layoutName: LayoutType) {
    let layout: LayoutStructure;

    if (layoutName === 'List') {
      layout = new List();
    } else if (layoutName === 'Parallel_Plot') {
      layout = new ParallelPlot();
    } else if (layoutName === 'Histogram') {
      layout = new Histogram();
    } else if (layoutName === '_D_Plot') {
      layout = new TwoDimensionalPlot();
    } else if (layoutName === 'Radial') {
      layout = new RadialLayout();
    }

    return layout;
  }
}