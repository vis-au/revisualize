import { Mark } from 'vega-lite/build/src/mark';

import Template from './Template';
import { MarkEncoding, markPropertiesChannelEncodings } from './MarkEncoding';
import { FieldDef } from 'vega-lite/build/src/fielddef';

export default class VisualMarkTemplate extends Template {
  constructor(public type: Mark, parent: Template) {
    super([], null, parent);
  }

  public setEncodedValue(encoding: MarkEncoding, value: FieldDef<any>) {
    if (markPropertiesChannelEncodings.indexOf(encoding as any) > -1) {
      super.setEncodedValue(encoding, value);
    }
  }

  public getEncodedValue(encoding: MarkEncoding) {
    if (markPropertiesChannelEncodings.indexOf(encoding as any) > -1) {
      return super.getEncodedValue(encoding);
    }

    return null;
  }
}