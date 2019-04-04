import * as React from 'react';
import { isFacetSchema, isInlineFacetSchema, isRepeatSchema } from 'toolkitmodel/src/TemplateModel/SpecUtils';
import { Spec } from 'vega';
import vegaEmbed, { Actions, Result } from 'vega-embed';

import './VegaRenderer.css';

interface Props {
  id?: string;
  showExportOptions?: boolean;
  schema: Spec;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onRenderComplete?: () => void;
  onRenderRejected?: () => void;
}

export default class VegaRenderer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div className="vegaRenderer" style={ this.props.style }>
        <div className="vegaContainer" id={ `vegaContainer${ this.props.id }` }></div>
      </div>
    );
  }

  private getSize() {
    let width = this.props.width || 600;
    let height = this.props.height || 400;

    // with and height in embed are applied to the singular views, not the compositions
    if (isRepeatSchema(this.props.schema)) {
      if ((this.props.schema as any).repeat.column !== undefined) {
        width = width / (this.props.schema as any).repeat.column.length;
      }
      if ((this.props.schema as any).repeat.row !== undefined) {
        height = height / (this.props.schema as any).repeat.row.length;
      }
    } else if (isInlineFacetSchema(this.props.schema)) {
      // TODO: is it possible to calculate, how many facetted plots there will be?
      if ((this.props.schema as any).columns !== undefined) {
        width = width / (this.props.schema as any).columns;
      }
    } else if (isFacetSchema(this.props.schema)) {
      // TODO: is it possible to calculate, how many facetted plots there will be?
    }

    return {
      width,
      height
    }
  }

  private embed() {
    const size = this.getSize();

    const exportActions: Actions = {
      export: {
        svg: this.props.showExportOptions,
        png: this.props.showExportOptions
      },
      source: this.props.showExportOptions,
      compiled: false,
      editor: false,
    };

    vegaEmbed(`#vegaContainer${ this.props.id }` , this.props.schema, {
      actions: exportActions,
      width: size.width,
      height: size.height
    }).then((value: Result) => {
      if (this.props.onRenderComplete !== undefined) {
        this.props.onRenderComplete();
      }
    }).catch(onrejected => {
      if (this.props.onRenderRejected !== undefined) {
        this.props.onRenderRejected();
      }
      console.log(onrejected);
    });
  }

  public componentDidMount() {
    this.embed()
  }

  public componentDidUpdate() {
    this.embed();
  }
}