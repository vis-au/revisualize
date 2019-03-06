import DefaultSignalFactory from './DeafultSignalFactory';
import DefaultDataGraphFactory from './DefaultDataGraphFactory';
import DefaultScaleFactory from './DefaultScaleFactory';

const nodeFactory = new DefaultDataGraphFactory();
const scaleFactory = new DefaultScaleFactory();
const signalFactory = new DefaultSignalFactory();

export const DEFAULT_SCALES = scaleFactory.getDefaultScales();
export const DEFAULT_SIGNALS = signalFactory.getDefaultSignals();
export const DEFAULT_DATA_GRAPH = nodeFactory.getDefaultNodeGraph();