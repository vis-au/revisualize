import * as React from 'react';

import Sidebar from '../../Widgets/Sidebar';
import { MarkEncodingGroup, markEncodingGroups } from '../TemplateModel/MarkEncoding';
import Template from '../TemplateModel/Template';
import EncodingGroupBlock from './EncodingGroup';
import SpecCompiler from '../TemplateModel/SpecCompiler';

import './TemplateConfigurationSidebar.css';

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
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);

    this.specCompiler = new SpecCompiler();
    this.state = { hidden: true };
  }

  public onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  private renderEncoding(encoding: MarkEncodingGroup) {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    return (
      <EncodingGroupBlock
        key={ encoding }
        groupType={ encoding }
        template={ this.props.focusedTemplate }
        onTemplateChanged={ this.props.onTemplateChanged }
      />
    );
  }

  private renderEncodings() {
    return (
      <div className="encodings">
        { markEncodingGroups.map(this.renderEncoding)}
      </div>
    );
  }

  private renderVegaLiteCode() {
    if (this.props.focusedTemplate === null) {
      return null;
    }

    const focusedTemplate = this.props.focusedTemplate;
    const spec = this.specCompiler.getVegaSpecification(focusedTemplate, true, true);
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
          { this.renderEncodings() }
          { this.renderVegaLiteCode() }
        </div>

      </Sidebar>
    );
  }
}