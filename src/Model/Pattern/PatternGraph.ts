import { Scale, Signal } from 'vega';

import DatasetNode from '../DataFlowGraph/DatasetNode';
import InteractionProvider from '../Interactions/InteractionProvider';
import VegaAdapter from '../VegaAdapter';
import Pattern from './Pattern';
import PatternLink from './PatternLink';

export default class PatternGraph {
  public patterns: Pattern[];
  public interactions: InteractionProvider[];
  public links: PatternLink[];

  public globalSignals: Signal[];
  public globalDatasets: DatasetNode[];
  public globalScales: Scale[];

  public vegaAdapter: VegaAdapter = new VegaAdapter();

  constructor() {
    this.patterns = [];
    this.links = [];
    this.interactions = [];

    this.globalDatasets = [];
    this.globalSignals = [];
    this.globalScales = [];
  }

  private getRootPatterns(): Pattern[] {
    const rootPatterns: Pattern[] = this.patterns.filter(pattern => {
      const linkWherePatternIsTarget = this.links.find(link => link.target === pattern);
      return linkWherePatternIsTarget === undefined;
    });

    return rootPatterns;
  }

  private getPatternSpanningTree(pattern: Pattern): Pattern[] {
    const spanningTree: Pattern[] = [];

    let currentPattern = pattern;

    while (currentPattern !== null) {
      spanningTree.push(currentPattern);
      const childPatternLink = this.links.find(link => link.source === currentPattern);

      currentPattern = null;

      if (childPatternLink !== undefined) {
        currentPattern = childPatternLink.target;
      }
    }

    return spanningTree;
  }

  public getPatternGroups(): Pattern[][] {
    const patternGroups: Pattern[][] = [];
    const rootPatterns = this.getRootPatterns();

    rootPatterns.forEach(pattern => {
      const patternGroup: Pattern[] = this.getPatternSpanningTree(pattern);

      patternGroups.push(patternGroup);
    });

    return patternGroups;
  }

  public addLink(link: PatternLink) {
    this.links.push(link);
  }
  public removeLink(link: PatternLink) {
    const linkInList = this.links.find(l => {
      return link.source === l.source && link.target === l.target;
    });

    if (linkInList === undefined) { return; }

    const indexInList = this.links.indexOf(linkInList);

    this.links.splice(indexInList, 1);
  }

  public addScale(scale: Scale) {
    const existingScalesWithSameName = this.globalScales.find(s => s.name === scale.name);

    if (existingScalesWithSameName === undefined) {
      this.globalScales.push(scale);
    }
  }

  public addSignal(signal: Signal) {
    const existingSignalWithSameName = this.globalSignals.find(s => s.name === signal.name);

    if (existingSignalWithSameName === undefined) {
      this.globalSignals.push(signal);
    }
  }
}