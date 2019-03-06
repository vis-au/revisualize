import { Scale, Signal } from 'vega';

import Utils from '../../UtilityFunctions';
import { DataflowNode } from '../DataFlowGraph/DataflowNode';
import { ArbitraryVisualVariableName, VisualElement } from '../Elements/VisualElement';
import { Grid } from '../Grid/Grid';
import { DynamicValue } from '../Interactions/DynamicValue';
import InteractionProvider from '../Interactions/InteractionProvider';
import { LayoutStructure } from '../Layouts/LayoutStructure';
import PatternGraph from './PatternGraph';

export const UNNAMED_PATTERN_NAME = 'new pattern';

export default class Pattern {
  private _id: string;
  private _name: string;
  private _dataset: DataflowNode = null;
  private _layout: LayoutStructure = null;
  private _visualElement: VisualElement = null;
  private _interactionProviders: InteractionProvider[] = [];
  private _datasetTransformedByLayout: DataflowNode;

  public grid: Grid;
  public graph: PatternGraph;
  public customScales: Scale[] = [];
  public customSignals: Signal[] = [];

  public visibleVisualVariables: ArbitraryVisualVariableName[];

  constructor(graph: PatternGraph) {
    this._id = Utils.getRandomID('pattern');
    this.graph = graph;
  }

  public update() {

    if (this._layout !== null) {
      this._layout.update();
    }
    if (this._visualElement !== null) {
      this._visualElement.update();
    }

    this._interactionProviders.forEach(provider => { provider.interaction.update(); });
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    if (this._name === undefined) { return UNNAMED_PATTERN_NAME; }

    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }

  public get dataset(): DataflowNode {
    if (this._datasetTransformedByLayout !== undefined) {
      return this._datasetTransformedByLayout;
    }

    return this._dataset;
  }
  public set dataset(node: DataflowNode) {

    if (node !== null && this._visualElement !== null) {
      this._visualElement.dataset = node.data;
    } else if (node === null && this._visualElement !== null) {
      this._visualElement.bindings.forEach((value, key) => {
        this._visualElement.bindings.set(key, null);
      });

      this.customScales.forEach(scale => {
        delete scale.domain;
      });

      this._visualElement.dataset = null;
    }

    if (this._layout !== null) {
      this._layout.update();
      this._layout.dataset = node;
    }

    this._dataset = node;
  }

  public get visualElement(): VisualElement {
    return this._visualElement;
  }
  public set visualElement(visualElement: VisualElement) {
    this._visualElement = visualElement;

    if (visualElement !== null) {
      this.visibleVisualVariables = visualElement.mainVariables;

      if (this._dataset !== null) {
        this._visualElement.dataset = this._dataset;
      }
    }
  }

  public get layout(): LayoutStructure {
    return this._layout;
  }
  public set layout(layout: LayoutStructure) {
    this._layout = layout;

    // deleting the layout --> delete all mappings
    if (layout === null && this._visualElement !== null) {
      this.visualElement.bindings.forEach((value, key) => {
        this.visualElement.bindings.set(key, null);
      });
    }
  }

  public get interactionProviders(): InteractionProvider[] {
    return this._interactionProviders;
  }

  public addInteraction(provider: InteractionProvider) {
    // interaction already exists on pattern
    if (this._interactionProviders.find(i => i.name === provider.name) !== undefined) {
      return false;
    }

    this._interactionProviders.push(provider);
    provider.patterns.push(this);
    return true;
  }
  public removeInteraction(provider: InteractionProvider) {
    const existingInteraction = this._interactionProviders.find(i => i.id === provider.id);

    if (existingInteraction === undefined) {
      return false;
    }

    if (this._visualElement !== null) {
      this._visualElement.bindings.forEach((value, key) => {
        if (value instanceof DynamicValue) {
          this._visualElement.bindings.set(key, null);
        }
      });
    }

    const indexInInteractions = this._interactionProviders.indexOf(existingInteraction);
    this._interactionProviders.splice(indexInInteractions, 1);

    return true;
  }

  public getScaleByName(name: string) {
    let scales: Scale[] = this.customScales;

    if (this._layout !== null) {
      scales = scales.concat(this._layout.scales);
    }

    return scales.find(scale => scale.name === name);
  }

  public getSignalByName(name: string) {
    return this.graph.globalSignals.find(signal => signal.name === name);
  }

  public getInteractionProviderById(id: string) {
    return this._interactionProviders.find(provider => provider.id === id);
  }

  public getDynamicValueByName(name: string) {
    let allDynamicValues: DynamicValue[] = [];
    this._interactionProviders.forEach(provider => {
      allDynamicValues = allDynamicValues.concat(provider.interaction.outputMappings);
    });

    return allDynamicValues.find(value => value.name === name);
  }
}