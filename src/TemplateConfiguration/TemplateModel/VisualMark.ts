import { Mark } from 'vega-lite/build/src/mark';
import { FieldDef } from 'vega-lite/build/src/fielddef';

import Template from './Template';
import { PositionEncoding, GeographicPositionEncoding, MarkPropertiesChannelEncoding, TextTooltipChannelEncoding, HyperLinkChannelEncoding, LoDChannelEncoding, KeyChannelEncoding, OrderChannelEncoding, FacetChannelEncoding, MarkEncoding } from './MarkEncoding';

export default class VisualMarkTemplate extends Template {
  // private positionEncodings: Map<PositionEncoding, FieldDef<Mark>>;
  // private geographicPositionEncodings: Map<GeographicPositionEncoding, FieldDef<Mark>>;
  // private markPropertyEncodings: Map<MarkPropertiesChannelEncoding, FieldDef<Mark>>;
  // private textTooltipEncodings: Map<TextTooltipChannelEncoding, FieldDef<Mark>>;
  // private hyperlinkEncodings: Map<HyperLinkChannelEncoding, FieldDef<Mark>>;
  // private lodEncodings: Map<LoDChannelEncoding, FieldDef<Mark>>;
  // private keyEncodings: Map<KeyChannelEncoding, FieldDef<Mark>>;
  // private orderEncodings: Map<OrderChannelEncoding, FieldDef<Mark>>;
  // private facetEncodings: Map<FacetChannelEncoding, FieldDef<Mark>>;
  private markEncodings: Map<MarkEncoding, FieldDef<any>>;

  constructor(public type: Mark, parent: Template) {
    super([], null, parent);

    this.markEncodings = new Map();
  }

  public setEncodedValue(encoding: MarkEncoding, value: FieldDef<any>) {
    this.markEncodings.set(encoding, value);
  }

  public getEncodedValue(encoding: MarkEncoding) {
    return this.markEncodings.get(encoding);
  }
}