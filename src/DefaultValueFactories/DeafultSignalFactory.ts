import { Signal } from 'vega';

export default class DefaultSignalFactory {
  public getDefaultSignals() {
    const width: Signal = {
      name: 'width',
      value: '1920'
    };
    const height: Signal = {
      name: 'height',
      value: '1080'
    };
    const padding: Signal = {
      name: 'padding',
      value: '10',
    };
    const five: Signal = {
      name: 'five',
      value: '5'
    };

    return [width, height, padding, five];
  }
}