import UtilityFunctions from '../../UtilityFunctions';
import Pattern from '../Pattern/Pattern';
import { Interaction } from './Interaction';

export default class InteractionProvider {
  private _id: string;
  private _interaction: Interaction = null;

  public patterns: Pattern[] = [];

  constructor() {
    this._id = UtilityFunctions.getRandomID('interactionProvider');
  }

  public get name(): string {
    if (this.interaction === null) { return 'new interaction'; }
    return this.interaction.name;
  }

  public get id(): string {
    return this._id;
  }

  public get interaction(): Interaction {
    return this._interaction;
  }
  public set interaction(interaction: Interaction) {
    interaction.provider = this;

    if (interaction !== null) {
      this._interaction = interaction;
      this._interaction.update();
    }
  }
}