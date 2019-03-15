import * as React from 'react';

import ViewContainer from '../ToolkitView/ViewContainer';
import Tab from '../ToolkitView/Tab';
import Template from './TemplateModel/Template';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import TemplateEditor from './TemplateEditor';

import './TemplateConfigurationView.css';
import VisualMark from './TemplateModel/VisualMark';

interface State {
  templates: Template[];
}
interface Props {
  activeTab: Tab;
}

export default class TemplateConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.addTemplate = this.addTemplate.bind(this);
    this.removeTemplate = this.removeTemplate.bind(this);
    this.onTemplatesChanged = this.onTemplatesChanged.bind(this);

    this.state = {
      templates: []
    };
  }

  private addTemplate() {
    const templates = this.state.templates;
    const newTemplate = new CompositeTemplate(null, []);

    templates.push(newTemplate);
    this.setState({ templates });
  }

  private removeTemplate() {
    return;
  }

  private onTemplatesChanged() {
    this.setState({ templates: this.state.templates })
  }

  public render() {
    return (
      <ViewContainer
        id="templateConfiguration"
        name="Templates"
        activeContainerName={ this.props.activeTab.name }>

        <TemplateEditor
          templates={ this.state.templates }
          onTemplatesChanged={ this.onTemplatesChanged }/>

        <button
          className="floatingAddButton"
          id="addNewTemplate"
          onClick={ this.addTemplate }>

          +
        </button>

      </ViewContainer>
    );
  }
}