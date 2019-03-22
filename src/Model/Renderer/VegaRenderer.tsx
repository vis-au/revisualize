import * as React from 'react';
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
    return (
      <div className="vegaContainer" id={ `vegaContainer${ this.props.id }` }></div>
    );
  }

  public render() {
    return (
      <div className="vegaRenderer" style={ this.props.style }>
        {
          this.renderWithEmbed()
        }
      </div>
    );
  }

  private embed() {
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