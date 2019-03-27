import { Composition, Plot } from "./LayoutType";
import { isUnitSpec, isLayerSpec, isRepeatSpec, isAnyConcatSpec, isFacetSpec, ExtendedLayerSpec, NormalizedRepeatSpec, NormalizedConcatSpec, NormalizedLayerSpec, NormalizedUnitSpec, GenericVConcatSpec, GenericHConcatSpec } from "vega-lite/build/src/spec";
import { MarkEncoding, markEncodings } from "./MarkEncoding";


export function isAtomicSchema(schema: any): boolean {
  return isUnitSpec(schema);
};

export function isOverlaySchema(schema: any): boolean {
  return isLayerSpec(schema);
};

export function isRepeatSchema(schema: any): boolean {
  return isRepeatSpec(schema);
};

export function isConcatenateSchema(schema: any): boolean {
  return isAnyConcatSpec(schema);
};

export function isFacetSchema(schema: any): boolean {
  return isFacetSpec(schema);
};

export function isCompositionSchema(schema: any): boolean {
  return isOverlaySchema(schema)
    || isRepeatSchema(schema)
    || isConcatenateSchema(schema)
    || isFacetSchema(schema);
};

export function isPlotSchema(schema: any) {
  return isAtomicSchema(schema);
};

export function getCompositionType(schema: any): Composition {
  if (isOverlaySchema(schema)) {
    return 'overlay';
  } else if (isRepeatSchema(schema)) {
    return 'repeat';
  } else if (isConcatenateSchema(schema)) {
    return 'concatenate';
  } else if (isFacetSchema(schema)) {
    return 'facet';
  }

  return null;
};

export function getPlotType(schema: any): Plot {
  return 'histogram';
};

export function getLayerAbstraction(schema: ExtendedLayerSpec) {
  const currentLayers = JSON.parse(JSON.stringify(schema.layer));
  let currentEncoding: any;

  if (schema.encoding !== undefined) {
    currentEncoding = JSON.parse(JSON.stringify(schema.encoding));
  }

  delete schema.layer;
  delete schema.encoding;

  const abstraction: any = {
    layer: currentLayers
  }

  if (currentEncoding !== undefined) {
    abstraction.encoding = currentEncoding;
  }

  return abstraction;
};

export function getRepeatAbstraction(schema: NormalizedRepeatSpec) {
  const currentSpec = JSON.parse(JSON.stringify(schema.spec));
  const currentRepeat = JSON.parse(JSON.stringify(schema.repeat));

  const abstraction = {
    spec: currentSpec,
    repeat: currentRepeat
  };

  delete schema.spec;
  delete schema.repeat;

  return abstraction;
};

export function getConcatAbstraction(schema: NormalizedConcatSpec) {
  let currentConcat: any = null;
  let concatProp: string = null;

  if ((schema as any).concat !== undefined) {
    concatProp = 'concat';
  } else if ((schema as GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>).hconcat !== undefined)  {
    concatProp = 'hconcat';
  } else if ((schema as GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>).vconcat !== undefined) {
    concatProp = 'vconcat';
  }

  currentConcat = JSON.parse(JSON.stringify((schema as any)[concatProp]));
  delete (schema as any)[concatProp];

  const abstraction: any = {};
  abstraction[concatProp] = currentConcat;

  return abstraction;
};


export function getMarkPropertiesAsMap(mark: any): Map<MarkEncoding, any> {
  const properties = new Map<MarkEncoding, any>();

  // since every mark encoding could potentially be statically set for a mark, just go through
  // all of them and find the ones that are configured
  markEncodings.forEach(encoding => {
    if (mark[encoding] !== undefined) {
      properties.set(encoding, JSON.parse(JSON.stringify(mark[encoding])));
    }
  });

  return properties;
};

export function getAtomicAbstraction(schema: any, compositionProperty: string) {
  const abstraction: any = {
    mark: JSON.parse(JSON.stringify(schema.mark)),
  };

  if (schema.encoding !== undefined) {
    abstraction.encoding = JSON.parse(JSON.stringify(schema.encoding));
  }

  if (schema.selection !== undefined) {
    abstraction.selection = JSON.parse(JSON.stringify(schema.selection));
  }

  const staticProperties = getMarkPropertiesAsMap(schema.mark);
  staticProperties.forEach((property, key) => {
    abstraction[key] = property;
    delete schema[key];
  });

  delete schema.mark;
  delete schema.encoding;
  delete schema.selection;

  if (compositionProperty === 'spec' && abstraction.encoding !== undefined) {
    if (abstraction.encoding.x !== undefined) {
      abstraction.encoding.x = {
          field: { repeat: 'column' },
          type: abstraction.encoding.x.type
      };
    }
    if (abstraction.encoding.y !== undefined) {
      abstraction.encoding.y = {
          field: { repeat: 'row' },
          type: abstraction.encoding.y.type
      };
    }
  }

  return abstraction;
};

export function setSingleViewProperties(schema: any, abstraction: any) {
  if (schema.bounds !== undefined) {
    abstraction.bounds = JSON.parse(JSON.stringify(schema.bounds));
  }
  if (schema.spacing !== undefined) {
    abstraction.spacing = JSON.parse(JSON.stringify(schema.spacing));
  }
  if (schema.width !== undefined) {
    abstraction.width = JSON.parse(JSON.stringify(schema.width));
  }
  if (schema.height !== undefined) {
    abstraction.height = JSON.parse(JSON.stringify(schema.height));
  }
  if (schema.data !== undefined) {
    abstraction.data = JSON.parse(JSON.stringify(schema.data));
  }
  if (schema.transform !== undefined) {
    abstraction.transform = JSON.parse(JSON.stringify(schema.transform));
  }
  if (schema.config !== undefined) {
    abstraction.config = JSON.parse(JSON.stringify(schema.config));
  }
  if (schema.resolve !== undefined) {
    abstraction.resolve = JSON.parse(JSON.stringify(schema.resolve));
  }

  return abstraction;
};

export function getAbstraction(schema: any, compositionProperty?: string): any {
  let abstraction: any = null;

  if (isAtomicSchema(schema)) {
    // atomic can either be content of a plot or repeat, indicated by the compositionpropety being
    // set to 'spec'
    abstraction = getAtomicAbstraction(schema, compositionProperty);
  } else if (isOverlaySchema(schema)) {
    abstraction = getLayerAbstraction(schema);
  } else if (isRepeatSchema(schema)) {
    abstraction = getRepeatAbstraction(schema);
  } else if (isConcatenateSchema(schema)) {
    abstraction = getConcatAbstraction(schema);
  }

  abstraction = setSingleViewProperties(schema, abstraction);

  return abstraction;
};
