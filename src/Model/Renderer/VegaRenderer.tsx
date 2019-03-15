import * as React from 'react';
import Vega from 'react-vega';
import VegaLite from 'react-vega-lite';
import { Spec } from 'vega';
import vegaEmbed, { Actions } from 'vega-embed';

import './VegaRenderer.css';

interface Props {
  id?: string;
  showExportOptions?: boolean;
  schema: Spec;
  width?: number;
  height?: number;
  style?: React.CSSProperties
}

export default class VegaRenderer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private renderWithEmbed() {
    console.log('kenobi')
    return (
      <div className="vegaContainer" id={ `vegaContainer${ this.props.id }` }></div>
    );
  }

  private renderAsComponent() {
    if (this.props.schema['$schema'].indexOf('vega-lite') > -1) {
      return
    }

    console.log(this.props.schema['$schema'])
    if (this.props.schema['$schema'].indexOf('vega-lite') > -1) {
      return <VegaLite
        width={ this.props.width }
        height={ this.props.height }
        renderer="canvas"
        spec={ this.props.schema } />
    }

    return (
      <Vega
        width={ this.props.width }
        height={ this.props.height }
        renderer="canvas"
        spec={ this.props.schema } />
    );
  }

  public render() {
    return (
      <div className="vegaRenderer" style={ this.props.style }>
        {
          this.props.showExportOptions !== undefined && this.props.showExportOptions
           ? this.renderWithEmbed()
           : this.renderAsComponent()
        }
      </div>
    );
  }

  private embed() {
    const exportActions: Actions = {
      export: {
        svg: true,
        png: true
      },
      source: true,
      compiled: false,
      editor: false,
    };
    vegaEmbed(`#vegaContainer${ this.props.id }` , this.props.schema, {
      actions: exportActions,
      width: this.props.width || 600,
      height: this.props.height || 400,
    });
  }

  public componentDidMount() {
    this.embed()
  }

  public componentDidUpdate() {
    this.embed();
  }
}