import * as React from 'react';
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
    }).then((value: Result) => {
      this.props.onRenderComplete();
    });
  }

  public componentDidMount() {
    this.embed()
  }

  public componentDidUpdate() {
    this.embed();
  }
}