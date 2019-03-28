import * as $ from 'jquery';
import 'jquery-ui/themes/base/resizable.css';
import 'jquery-ui/ui/widgets/resizable';
import * as React from 'react';

import VegaRenderer from '../../Model/Renderer/VegaRenderer';
import SpecCompiler from '../TemplateModel/SpecCompiler';
import Template from '../TemplateModel/Template';

import './TemplatePreview.css';

interface Props {
  template: Template,
  templateVersion: number,
  onRenderComplete: () => void
}
interface State {
  width: number;
  height: number;
}

export default class TemplatePreview extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;
  private templateVersion: number;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();

    this.templateVersion = this.props.templateVersion;
    this.state = {
      width: 100,
      height: 100
    };
  }

  private renderVegaPreview() {
    const legendPadding = 25;
    const axisPadding = 25;
    const template = this.props.template;
    let spec = this.specCompiler.getVegaSpecification(template, true, true);

    if (spec === null) {
      spec = {} as any;
    }

    return (
      <VegaRenderer
        id={ `renderer${this.props.template.id}` }
        onRenderComplete={ this.props.onRenderComplete }
        showExportOptions={ false }
        width={ this.state.width * 0.9 - legendPadding - axisPadding }
        height={ this.state.height * 0.9 - axisPadding }
        schema={ spec }
      />
    );
  }

  public render() {
    return (
      <div id={ `previewContainer${this.props.template.id}` } className="rendererContainer">
        { this.renderVegaPreview() }
      </div>
    );
  }

  private makePreviewResizable() {
    $(`#previewContainer${this.props.template.id}`).resizable({
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
      },
      stop: event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    });
  }

  public componentDidMount() {
    this.makePreviewResizable();
  }

  public shouldComponentUpdate() {
    // return this.props.templateVersion !== this.templateVersion;
    return true;
  }

  public componentDidUpdate() {
    this.templateVersion = this.props.templateVersion;
  }
}