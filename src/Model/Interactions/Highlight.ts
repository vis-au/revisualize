import { OnEvent, Signal, } from 'vega';

import { DynamicValue } from './DynamicValue';
import { Interaction } from './Interaction';
import InteractionProvider from './InteractionProvider';

export default class Highlight implements Interaction {
  public provider: InteractionProvider;

  private currentHighlight: Signal; // currently highlighted dataset entry

  private _inputMappings: Map<string, string>;

  constructor() {
    this._inputMappings = new Map();
    this._inputMappings.set('defaultColor', 'steelblue');
    this._inputMappings.set('highlightColor', 'red');
  }

  public get name(): string { return 'Highlight'; }

  public update() {
    this.currentHighlight = {
      description: `Contains the item from the dataset represented by the latest highlighted visual element`,
      name: `Current`,
      on: [],
      value: null,
    };

    // for every connected pattern, add a mousemove event to the highlight signal, therefore
    // moving the mouse over any mark will highlight every other connected signal
    this.provider.patterns.forEach(pattern => {
      if (pattern.visualElement === null) { return; }

      const markOnMousemoveEvent: OnEvent = {
        events: `@${pattern.visualElement.mark.name}:mousemove`, update: 'datum'
      };

      this.currentHighlight.on.push(markOnMousemoveEvent);
    });

    // any mouseout event will set mouseout event
    const onMouseOut: OnEvent = { events: `*:mouseout`, update: 'null' };

    this.currentHighlight.on.push(onMouseOut);
  }

  public get inputMappings(): Map<string, string> {
    return this._inputMappings;
  }

  public get outputMappings(): DynamicValue[] {

    const setColorIfIsCurrent: DynamicValue = new DynamicValue();
    setColorIfIsCurrent.name = 'highlightColor';
    setColorIfIsCurrent.productionRule = [
      { test: 'datum === Current', value: this._inputMappings.get('highlightColor') },
      { value: this._inputMappings.get('defaultColor') }
    ];

    return [ setColorIfIsCurrent ];
  }

  public get signals(): Signal[] {
    this.update();
    return [
      this.currentHighlight
    ];
  }
}