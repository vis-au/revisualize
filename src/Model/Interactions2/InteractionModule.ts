import InteractionGraph from './InteractionGraph';
import InteractionModuleGraph from './InteractionModuleGraph';
import { PortType } from './PortType';

export default class InteractionModule {
  private moduleGraph: InteractionModuleGraph;
  private interactionGraph: InteractionGraph;

  constructor() {
    this.moduleGraph = null;
    this.interactionGraph = null;
  }

  public get inputPorts(): PortType[] {
    return [];
  }

  public get outputPorts(): PortType[] {
    return [];
  }
}