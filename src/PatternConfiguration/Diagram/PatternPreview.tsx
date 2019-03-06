import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';
import * as React from 'react';
import { Spec } from 'vega';

import Pattern from '../../Model/Pattern/Pattern';
import VegaRenderer from '../../Model/Renderer/VegaRenderer';
import VegaAdapter from '../../Model/VegaAdapter';

import 'jquery-ui/themes/base/resizable.css';
import './PatternPreview.css';

interface Props {
  pattern: Pattern;
  onResize: () => void;
}
interface State {
  width: number;
  height: number;
  padding: number;
}

export default class PatternPreview extends React.Component<Props, State> {
  private vegaAdapter: VegaAdapter;

  constructor(props: Props) {
    super(props);

    this.vegaAdapter = new VegaAdapter();

    this.state = {
      height: 100,
      width: 310,
      padding: 5
    };
  }

  private makeResizable() {
    $(`#patternPreview${this.props.pattern.id}`).resizable({
      start: event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      },
      resize: (event, ui) => {
        event.stopPropagation();
        event.stopImmediatePropagation();

        this.setState({
          width: ui.size.width,
          height: ui.size.height
        });

        this.props.onResize();
      },
      stop: event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    });
  }

  private onPaddingControlClicked(event: any, amount: number) {
    event.stopPropagation();
    this.setState({ padding: this.state.padding + amount });
  }

  private getVegaSchema(): Spec {
    const schema: Spec = this.vegaAdapter.getSchemaForPattern(this.props.pattern);

    schema.width = this.state.width;
    schema.height = this.state.height;
    schema.padding = this.state.padding;

    return schema;
  }

  public render() {
    return (
      <div id={ `patternPreview${this.props.pattern.id}` } className="patternPreview">
        <div className="paddingControls">
          <div className="paddingButtonWrapper">
            <button className="padding" onClick={ (e) => this.onPaddingControlClicked(e, 5) }>+</button>
            <button className="padding" onClick={ (e) => this.onPaddingControlClicked(e, -5) }>-</button>
          </div>
        </div>

        <VegaRenderer
          width={ this.state.width - (4 * this.state.padding) }
          height={ this.state.height - (4 * this.state.padding) }
          schema={ this.getVegaSchema() } />
      </div>
    );
  }

  public componentDidMount() {
    this.makeResizable();
  }

  public componentDidUpdate() {
    this.makeResizable();
  }
}