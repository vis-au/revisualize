import * as React from 'react';

import Sidebar from '../../Widgets/Sidebar';
import Template from '../TemplateModel/Template';
import CompositionTemplate from '../TemplateModel/CompositionTemplate';
import CompositionTemplateProperties from './CompositionTemplateProperties';
import PlotTemplate from '../TemplateModel/PlotTemplate';
import PlotTemplateProperties from './PlotTemplateProperties';

import './TemplateConfigurationSidebar.css';
import SpecCompiler from '../TemplateModel/SpecCompiler';

interface Props {
  onTemplateChanged: () => void;
  focusedTemplate: Template;
}
interface State {
  hidden: boolean;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  private specCompiler: SpecCompiler;

  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);

    this.specCompiler = new SpecCompiler();
    this.state = { hidden: true };
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

    return (
      <textarea
        contentEditable={ false }
        id="templateConfigurationSidebarVegaPreview"
        value={ specString }>
      </textarea>
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