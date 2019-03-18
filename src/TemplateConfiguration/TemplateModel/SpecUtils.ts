

export function isAtomicSchema(schema: any): boolean {
  return schema.mark !== undefined;
};

export function isOverlaySchema(schema: any): boolean {
  return schema.layer !== undefined;
};

export function isRepeatSchema(schema: any): boolean {
  return schema.repeat !== undefined;
};

export function isConcatenateSchema(schema: any): boolean {
  return schema.concat !== undefined || schema.hconcat !== undefined || schema.vconcat !== undefined;
};