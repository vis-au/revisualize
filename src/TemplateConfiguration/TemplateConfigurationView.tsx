import * as React from 'react';

import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import TemplatePlumbingContainer from './LayeredDiagramEditor/TemplatePlumbingContainer';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';
import TemplateConfigurationToolbar from './Toolbar/TemplateConfigurationToolbar';

import './TemplateConfigurationView.css';

interface Props {
  activeTab: Tab;
  className: string;
  templates: Template[];
  onTemplatesChanged: () => void;
}
interface State {
}

export default class TemplateConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.addTemplate = this.addTemplate.bind(this);
    this.addTemplates = this.addTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);

    this.state = {
      templates: []
    };
  }

  private addTemplate(template?: Template) {
    const templates = this.props.templates;
    const newTemplate = template === undefined
      ? new CompositeTemplate(null, [], null)
      : template;

    templates.push(newTemplate);
    this.props.onTemplatesChanged();
  }

  private addTemplates(templates: Template[]) {
    const currentTemplates = this.props.templates;
    currentTemplates.push(...templates);
    this.props.onTemplatesChanged();
  }

  private deleteTemplate(template: Template) {
    const templates = this.props.templates;
    const indexInTemplates = templates.indexOf(template);

    if (indexInTemplates === -1) {
      return;
    }

    // TODO: when the template is deleted from the connection map in the template editor, the
    // ondetachedconnection event is triggered, which sets the parent of the deleted template to
    // null. Therefore, it is null here and cannot be referenced, which is why the following is
    // necessary
    if (template.parent !== null) {
      const indexInParent = template.parent.visualElements.indexOf(template);
      template.parent.visualElements.splice(indexInParent, 1);
    }

    templates.splice(indexInTemplates, 1);
    this.props.onTemplatesChanged();
  }

  public render() {
    return (
      <ViewContainer
        id="templateConfiguration"
        name="Templates"
        className={ this.props.className }
        activeContainerName={ this.props.activeTab.name }>

        <TemplateConfigurationToolbar
          addTemplate={ this.addTemplate }
          addTemplates={ this.addTemplates } />

        <div id="templateConfigurationBody">
          <TemplatePlumbingContainer
            templates={ this.props.templates }
            onTemplatesChanged={ this.props.onTemplatesChanged }
            addTemplate={ this.addTemplate }
            deleteTemplate={ this.deleteTemplate }/>
        </div>

      </ViewContainer>
    );
  }
}