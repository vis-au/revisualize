import * as React from 'react';

import Sidebar from '../../Widgets/Sidebar';
import CompositeTemplate from '../TemplateModel/CompositeTemplate';
import Layout from '../TemplateModel/Layout';
import { MarkEncodingGroup, markEncodingGroups } from '../TemplateModel/MarkEncoding';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMark';
import EncodingGroupBlock from './EncodingGroupBlock';

import './TemplateConfigurationSidebar.css';

interface Props {
  onTemplateChanged: () => void;
  selectedTemplate: Template;
}
interface State {
  hidden: boolean;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);

    this.state = { hidden: false };
  }

  public onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  private renderEncoding(encoding: MarkEncodingGroup) {
    if (this.props.selectedTemplate === null) {
      return null;
    }

    return (
      <EncodingGroupBlock
        key={ encoding }
        groupType={ encoding }
        template={ this.props.selectedTemplate }
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

  public render() {
    return (
      <Sidebar
        id="templateConfigurationSidebar"
        height={ window.innerHeight - 75 }
        hidden={ this.state.hidden && this.props.selectedTemplate === null }
        positionLeft={ false }
        toggle={ this.onToggle }>

        { this.renderEncodings() }

      </Sidebar>
    );
  }
}