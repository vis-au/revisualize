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
  onRenderComplete: () => void
}
interface State {
  width: number;
  height: number;
}

export default class TemplatePreview extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;
  private latestSchemaString: string;

  constructor(props: Props) {
    super(props);

    this.specCompiler = new SpecCompiler();

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
    this.latestSchemaString = JSON.stringify(spec);

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

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    // TODO: this is a quick-and-dirty way to prevent the preview from updating, whenever the
    // template has not changed. It is necessary, because the spec passed to the vegarenderer is
    // computed here instead of in the template, therefore a new object is created every time the
    // list of templates in app.tsx changes. A better approach is to use a proxy for the template
    // class, which updates the spec every time a property was modified and then accesssing this
    // spec from the previewcomponent.
    const template = nextProps.template;
    const nextSpec = this.specCompiler.getVegaSpecification(template, true, true);
    const nextSchemaString = JSON.stringify(nextSpec);

    const widthIsTheSame = nextState.width === this.state.width;
    const heightIsTheSame = nextState.height === this.state.height;
    const sizeIsTheSame = widthIsTheSame && heightIsTheSame;

    return nextSchemaString !== this.latestSchemaString || !sizeIsTheSame;
  }
}