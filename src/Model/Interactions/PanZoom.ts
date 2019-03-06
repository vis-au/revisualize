import { Scale, Signal } from 'vega';

import Pattern from '../Pattern/Pattern';
import { Interaction } from './Interaction';
import InteractionProvider from './InteractionProvider';

export type scaleName = 'horizontal' | 'vertical';

export default class PanZoom implements Interaction {
  public provider: InteractionProvider;
  public patterns: Pattern[] = [];
  public scaleBindings: Map<scaleName, Scale>;

  private down: Signal;
  private xCur: Signal;
  private yCur: Signal ;
  private delta: Signal;
  private anchor: Signal;
  private zoom: Signal;
  private dist1: Signal;
  private dist2: Signal;
  private size: Signal;
  private xDomain: Signal;
  private yDomain: Signal;

  constructor() {
    this.scaleBindings = new Map();
    this.scaleBindings.set('horizontal', null);
    this.scaleBindings.set('vertical', null);

    this.setupSignals();
  }

  private setupSignals() {
    this.down = {
      name: 'down',
      value: null,
      on: [
        { events: 'touchend', update: 'null' },
        { events: 'mousedown, touchstart', update: 'xy()' },
      ]
    };
    this.xCur = {
      name: 'xCur',
      value: null,
      on: [
        { events: 'mousedown, touchstart, touchend', update: `slice(xDomain)` }
      ]
    };
    this.yCur = {
      name: 'yCur',
      value: null,
      on: [
        { events: 'mousedown, touchstart, touchend', update: `slice(yDomain)` }
      ]
    };
    this.delta = {
      name: 'delta',
      value: null,
      on: [
        {
          events: [
            { source: 'window', type: 'mousemove', consume: true, between: [
              { type: 'mousedown' }, { source: 'window', type: 'mouseup' },
            ]},
            {
              type: 'touchmove', consume: true, filter: 'event.touches.length === 1'
            }
          ],
          update: `down ? [down[0]-x(), y()-down[1]] : [0, 0]`
        }
      ]
    };
    this.anchor = {
      name: 'anchor',
      value: [0, 0],
      on: [
        { events: 'wheel', update: `[invert('horizontal', x()), invert('vertical', y())]` },
        {
          events: { type: 'touchstart', filter: 'event.touches.length === 2' },
          update: `[(xDomain[0] + xDomain[1]) / 2, (yDomain[0] + yDomain[1]) / 2]`
        }
      ]
    };
    this.zoom = {
      name: 'zoom',
      value: 1,
      on: [
        { events: 'wheel!', force: true, update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))' },
        { events: { signal: `dist2` }, force: true, update: `dist1 / dist2` }
      ]
    };
    this.dist1 = {
      name: 'dist1',
      value: 0,
      on: [
        { events: { type: 'touchstart', filter: 'event.touches.length === 2'}, update: 'pinchDistance(event)' },
        { events: { signal: `dist2` }, update: `dist2` }
      ]
    };
    this.dist2 = {
      name: 'dist2',
      value: 0,
      on: [
        { events: { type: 'touchmove', consume: true, filter: 'event.touches.length === 2'}, update: 'pinchDistance(event)' }
      ]
    };
    this.size = {
      name: 'size',
      update: `clamp(20 / span(xDomain), 1, 1000)`
    };

    this.xDomain = {
      name: 'xDomain',
      update: 'slice(xext)',
      react: false,
      on: [
        {
          events: { signal: `delta`},
          update: `[xCur[0] + span(xCur) * delta[0] / width, xCur[1] + span(xCur) * delta[0] / width]`
        },
        {
          events: { signal: `zoom`},
          update: `[anchor[0] + span(xDomain) * anchor[0] * zoom, anchor[0] + (xDomain)[1] * anchor[0] * zoom]`
        }
      ]
    };
    this.yDomain = {
      name: 'yDomain',
      update: 'slice(yext)',
      react: false,
      on: [
        {
          events: { signal: `delta`},
          update: `[yCur[0] + span(yCur) * delta[1] / height, yCur[1] + span(yCur) * delta[1] / height]`
        },
        {
          events: { signal: `zoom`},
          update: `[anchor[1] + span(yDomain) * anchor[1] * zoom, anchor[1] + (yDomain)[1] * anchor[1] * zoom]`
        }
      ]
    };
  }

  public update() {
    this.xDomain = {
      name: 'xDomain',

    };
  }

  public get dynamicValues(): Signal[] {
    this.update();

    return [
      this.xDomain, this.yDomain, this.size
    ];
  }

  public get name(): string { return 'PanZoom'; }

  public get outputSignals(): Signal[] {
    return [];
  }

  public get signals(): Signal[] {
    return [
      this.down,
      this.xCur,
      this.yCur,
      this.delta,
      this.anchor,
      this.zoom,
      this.dist1,
      this.dist2,
      this.size,
      this.xDomain,
      this.yDomain,
    ];
  }
}