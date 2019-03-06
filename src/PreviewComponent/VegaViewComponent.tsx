import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';
import * as React from 'react';

import { Spec } from 'vega';
import Pattern from '../Model/Pattern/Pattern';
import VegaRenderer from '../Model/Renderer/VegaRenderer';
import VegaSpecBuilder from '../Model/VegaSpecBuilder';

import './VegaViewComponent.css';

interface Props {
  patternList: Pattern[]
}
interface State {
  width: number;
  height: number;
}

export default class VegaViewComponent extends React.Component<Props, State> {
  private vegaSpecBuilder: VegaSpecBuilder;

  constructor(props: Props) {
    super(props);

    this.vegaSpecBuilder = new VegaSpecBuilder();

    this.state = {
      width: 600,
      height: 400
    };
  }

  private getID() {
    return this.props.patternList
      .map(pattern => pattern.id)
      .join('');
  }

  private getUniqueKey() {
    return this.props.patternList
      .map(pattern => pattern.id)
      .join('##');
  }

  private onResize(ui: JQueryUI.ResizableUIParams) {
    this.setState({
      width: ui.size.width,
      height: ui.size.height
    });

    return;
  }

  private makeResizable() {
    $(`#preview${this.getUniqueKey()}`).resizable({
      start: event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      },
      resize: (event, ui) => {
        event.stopPropagation();
        event.stopImmediatePropagation();

        this.onResize(ui);
      },
      stop: event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    });
  }

  private renderPatternListInVega() {
    this.vegaSpecBuilder.patterns = this.props.patternList;
    const vegaSpec: Spec = this.vegaSpecBuilder.build();

    vegaSpec.padding = 0;

    const padding = { vertical: 100, horizontal: 100 };

    return (
      <VegaRenderer
        key={ this.getID() }
        id={ this.getID() }
        showExportOptions={ true }
        width={ this.state.width - padding.horizontal }
        height={ this.state.height - padding.vertical }
        schema={ vegaSpec }
      />
    );
  }

  public render() {

    return (
      <div
        id={ `preview${this.getUniqueKey()}` }
        key={ this.getUniqueKey() }
        className="patternGroup"
        style={ { width: this.state.width, height: this.state.height } }>
        { this.renderPatternListInVega() }
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