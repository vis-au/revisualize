import { Axis, Data, Mark, Scale, Signal, Spec } from 'vega';

import { isScaledFieldRef, isScaledSignalRef } from '../VegaTypeChecker';
import Pattern from './Pattern/Pattern';
import VegaAdapter from './VegaAdapter';

export default class VegaSpecBuilder {
  public patterns: Pattern[];

  private vegaAdapter: VegaAdapter;

  constructor() {
    this.vegaAdapter = new VegaAdapter();
  }

  private getListOfUniquelyNamedElements(list: Array<{name: string}>) {
    const uniqueElements: Array<{name: string}> = [];

    list.forEach(element => {
      const existingElement = uniqueElements.find(el => el.name === element.name);

      if (existingElement !== undefined) { return; }

      uniqueElements.push(element);
    });

    return uniqueElements;
  }

  private getData(): Data[] {
    const dataList: Data[][] = this.patterns
      .map(pattern => this.vegaAdapter.getSchemaForPattern(pattern))
      .map(spec => JSON.parse(JSON.stringify(spec)) as Spec)
      .map((spec, i) => {
        if (spec.data === undefined) { return spec; }

        // replace all referneces to scales in the data transforms as well
        spec.data.forEach(data => {
          if (data.transform === undefined) { return; }

          // I apologize ...
          data.transform.forEach((transform, j) => {
            const asString = JSON.stringify(transform);

            // looks for the scale('' pattern and replaces the referenced name in there
            data.transform[j] = JSON.parse(asString
              .replace(/scale\('(\w+)'/g, `scale\('$1${this.patterns[i].id}'`));
          });
        });

        return spec;
      })
      .filter(spec => spec.data !== undefined)
      .map(spec => spec.data);

    const data = [].concat(...dataList);

    return this.getListOfUniquelyNamedElements(data);
  }

  private getSignals(): Signal[] {
    const signalsList: Signal[][] = this.patterns
      .map(pattern => this.vegaAdapter.getSchemaForPattern(pattern))
      .filter(spec => spec.signals !== undefined)
      .map(spec => spec.signals);

    const signals = [].concat(...signalsList);

    return this.getListOfUniquelyNamedElements(signals);
  }

  private getScales(): Scale[] {
    const scaleList: Scale[][] = this.patterns
      .map(pattern => this.vegaAdapter.getSchemaForPattern(pattern))
      .map(spec => JSON.parse(JSON.stringify(spec)) as Spec)
      .map((spec, i) => {
        if (spec.scales === undefined) { return spec; }

        // rename all scales so they are unique to the pattern
        spec.scales.forEach(scale => scale.name = `${scale.name}${this.patterns[i].id}`);

        return spec;
      })
      .filter(spec => spec.scales !== undefined)
      .map(spec => spec.scales);

    const scales = [].concat(...scaleList);

    return this.getListOfUniquelyNamedElements(scales);
  }

  private getAxes(): Axis[] {
    const axesList: Axis[][] = this.patterns
      .map(pattern => this.vegaAdapter.getSchemaForPattern(pattern))
      .map(spec => JSON.parse(JSON.stringify(spec)) as Spec)
      .map((spec, i) => {
        if (spec.axes === undefined) { return spec; }

        spec.axes.forEach(axis => {
          axis.scale = `${axis.scale}${this.patterns[i].id}`
        });

        return spec;
      })
      .filter(spec => spec.axes !== undefined)
      .map(spec => spec.axes);

    const axes = [].concat(...axesList);

    return axes;
  }

  private getMarks() {
    const allMarks: Mark[][] = this.patterns
      .map(pattern => this.vegaAdapter.getSchemaForPattern(pattern))
      .map(spec => JSON.parse(JSON.stringify(spec)) as Spec)
      .map((spec, i) => {
        if (spec.marks === undefined) { return spec; }

        // go through all visual encodings in all visual marks in this spec and replace the
        // name of any referenced scales
        spec.marks.forEach(mark => {
          if (mark.encode !== undefined && mark.encode.update !== undefined) {
            Object.keys(mark.encode.update).forEach(variable => {
              if (isScaledFieldRef(mark.encode.update[variable])
                || isScaledSignalRef(mark.encode.update[variable])) {
                const value: any = mark.encode.update[variable];
                value.scale = `${value.scale}${this.patterns[i].id}`;
              }
            });
          }
        });

        return spec;
      })
      .filter(spec => spec.marks !== undefined)
      .map(spec => spec.marks);

    allMarks.forEach((marks, i) => {
      marks.forEach(mark => mark.name = `${mark.name}${this.patterns[i].id}`);
    });

    const allMarkList: Mark[] = [].concat(...allMarks).filter(m => m !== null);
    const uniqueMarkList: Mark[] = [];

    allMarkList.forEach(mark => {
     const existingMark = allMarkList.find(m => m.name === mark.name);

      if (existingMark === undefined) { return; }

      uniqueMarkList.push(mark);
    });

    return uniqueMarkList;
  }

  public build() {
    const empty: any[] = [];

    const schema = {
      '$schema': this.vegaAdapter.getVegaSchemaURL(),
      axes: this.getAxes(),
      data: this.getData(),
      legends: empty,
      marks: this.getMarks(),
      scales: this.getScales(),
      signals: this.getSignals(),
    };

    console.log(schema);

    return schema;
  }
}