import { Composition, Plot } from "./LayoutType";
import { isUnitSpec, isLayerSpec, isRepeatSpec, isConcatSpec, isFacetSpec, GenericLayerSpec, ExtendedLayerSpec, GenericRepeatSpec, NormalizedRepeatSpec, NormalizedConcatSpec, NormalizedLayerSpec, NormalizedUnitSpec, GenericVConcatSpec, GenericHConcatSpec } from "vega-lite/build/src/spec";


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
  return isConcatSpec(schema);
};

export function isFacetSchema(schema: any): boolean {
  return isFacetSpec(schema);
}

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

export function getAtomicAbstraction(schema: any, compositionProperty: string) {
  let abstraction: any = {
    mark: JSON.parse(JSON.stringify(schema.mark)),
    encoding: JSON.parse(JSON.stringify(schema.encoding)),
  };

  if (schema.selection !== undefined) {
    abstraction.selection = JSON.parse(JSON.stringify(schema.selection));
  }

  delete schema.mark;
  delete schema.encoding;
  delete schema.selection;

  if (compositionProperty === 'spec') {
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

  return abstraction;
};

export function getAbstraction(schema: any, compositionProperty?: string): any {
  let abstraction: any = null;

  if (isAtomicSchema(schema)) {
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
