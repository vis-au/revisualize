import * as React from 'react';

import Sidebar from '../../../Widgets/Sidebar';
import CompositionTemplate from '../../TemplateModel/CompositionTemplate';
import PlotTemplate from '../../TemplateModel/PlotTemplate';
import SpecCompiler from '../../TemplateModel/SpecCompiler';
import Template from '../../TemplateModel/Template';
import CompositionTemplateProperties from './CompositionTemplateProperties';
import PlotTemplateProperties from './PlotTemplateProperties';

import './TemplateConfigurationSidebar.css';

interface Props {
  onTemplateChanged: () => void;
  focusedTemplate: Template;
}
interface State {
  hidden: boolean;
  JSONHidden: boolean;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);

    this.specCompiler = new SpecCompiler();
    this.state = {
      hidden: true,
      JSONHidden: true
    };
  }

  public onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  private renderFocusedTemplateProperties() {
    if (this.props.focusedTemplate instanceof CompositionTemplate) {
      return (
        <CompositionTemplateProperties
          template={ this.props.focusedTemplate }
          onTemplateChanged={ this.props.onTemplateChanged } />
      );
    } else if (this.props.focusedTemplate instanceof PlotTemplate) {
      return (
        <PlotTemplateProperties
          template={ this.props.focusedTemplate }
          onTemplateChanged={ this.props.onTemplateChanged } />
      );
    }
  }

  private renderVegaLiteCode() {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    const template = this.props.focusedTemplate;
    const spec = this.specCompiler.getVegaSpecification(template, true, true);
    const specString = JSON.stringify(spec, null, 2);
    const label = this.state.JSONHidden ? 'show JSON' : 'hide JSON';

    return (
      <div className="vegaLiteContainer">
        <button onClick={() => this.setState({ JSONHidden: !this.state.JSONHidden })}>
          { label }
        </button>
        <textarea
          contentEditable={ false }
          id="templateConfigurationSidebarVegaPreview"
          className={ this.state.JSONHidden ? 'hidden' : '' }
          value={ specString }
          onChange={ () => null }>
        </textarea>
      </div>
    );
  }

  public render() {
    return (
      <Sidebar
        id="templateConfigurationSidebar"
        height={ window.innerHeight - 75 }
        hidden={ this.state.hidden && this.props.focusedTemplate === null }
        positionLeft={ false }
        toggle={ this.onToggle }>

        <div className="sidebarContainer">
          { this.renderFocusedTemplateProperties() }
          { this.renderVegaLiteCode() }
        </div>

      </Sidebar>
    );
  }
}