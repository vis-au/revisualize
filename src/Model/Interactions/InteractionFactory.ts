import Highlight from './Highlight';
import { Interaction } from './Interaction';
import PanZoom from './PanZoom';

export type InteractionType = 'Highlight' | 'PanZoom';

export default class InteractionFactory {
  public getInteraction(type: InteractionType) {
    let interaction: Interaction;

    if (type === 'Highlight') {
      interaction = new Highlight();
    } else if (type === 'PanZoom') {
      interaction = new PanZoom();
    }

    return interaction;
  }
}