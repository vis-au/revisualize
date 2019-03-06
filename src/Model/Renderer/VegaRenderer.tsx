import * as React from 'react';
import Vega from 'react-vega';
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
    const exportActions: Actions = {
      export: {
        svg: true,
        png: true
      },
      source: true,
      compiled: false,
      editor: false
    };

    setTimeout(() => {
      vegaEmbed(`#vegaContainer${ this.props.id }` , this.props.schema, {
        actions: exportActions,
        width: this.props.width || 600,
        height: this.props.height || 400
      });
    }, 0);

    return (
      <div className="vegaContainer" id={ `vegaContainer${ this.props.id }` }></div>
    );
  }

  private renderAsComponent() {
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
}