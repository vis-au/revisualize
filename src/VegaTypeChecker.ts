import { Field, NewSignal, Signal, SignalRef } from 'vega';

export function isScale(obj: any): obj is NewSignal {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'name' in obj && 'type' in obj && 'domain' in obj && 'range' in obj;
}
export function isScaledFieldRef(obj: any): obj is {scale: string, signal?: Field, field?: Field} {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'scale' in obj && 'field' in obj;
}
export function isScaledSignalRef(obj: any): obj is {scale: string, signal: Field} {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'scale' in obj && 'signal' in obj;
}
export function isField(obj: any): obj is { field: string } {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'field' in obj && !('scale' in obj);
}
export function isSignal(obj: any): obj is Signal {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'name' in obj && 'value' in obj && 'update' in obj;
}
export function isSignalRef(obj: any): obj is SignalRef {
  if (typeof obj !== 'object') { return false; }
  if (obj === null) { return false; }
  return 'signal' in obj && !('scale' in obj);
}