import * as React from 'react';

import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import TemplatePlumbingWrapper from './LayeredDiagramEditor/TemplatePlumbingWrapper';
import TemplateConfigurationSidebar from './Sidebars/TemplateDetails/TemplateConfigurationSidebar';
import Template from './TemplateModel/Template';
import TemplateConfigurationToolbar from './Toolbar/TemplateConfigurationToolbar';

import './TemplateConfigurationView.css';

interface Props {
  activeTab: Tab;
  className: string;
  templates: Template[];
  templateVersion: number;
  onTemplatesChanged: () => void;
}
interface State {
  focusedTemplate: Template;
  plumbingVisible: boolean;
}

export default class TemplateConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.addTemplate = this.addTemplate.bind(this);
    this.addTemplates = this.addTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.focusTemplate = this.focusTemplate.bind(this);
    this.togglePlumbingVisible = this.togglePlumbingVisible.bind(this);

    this.state = {
      focusedTemplate: null,
      plumbingVisible: true
    };
  }

  private focusTemplate(template: Template) {
    if (this.state.focusedTemplate === template) {
      this.setState({ focusedTemplate: null });
    } else {
      this.setState({ focusedTemplate: template });
    }
  }

  private addTemplate(template: Template) {
    const templates = this.props.templates;
    const newTemplate = template;

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

    if (template.data !== null || template.data !== undefined) {
      if (template.parent !== null) {
        if (template.parent.data === null || template.parent.data === undefined) {
          template.parent.data = JSON.parse(JSON.stringify(template.data));
        }
      }

      template.visualElements.forEach(t => {
        if (t.data === null || t.data === undefined) {
          t.data = JSON.parse(JSON.stringify(template.data));
        }
      });
    }

    // TODO: when the template is deleted from the connection map in the template editor, the
    // ondetachedconnection event is triggered, which sets the parent of the deleted template to
    // null. Therefore, it is null here and cannot be referenced, which is why the following is
    // necessary
    if (template.parent !== null) {
      const indexInParent = template.parent.visualElements.indexOf(template);
      template.parent.visualElements.splice(indexInParent, 1);
    }

    template.visualElements.forEach(t => {
      t.parent = null;
    });

    templates.splice(indexInTemplates, 1);
    this.props.onTemplatesChanged();
  }

  private togglePlumbingVisible(visible?: boolean) {
    if (visible !== undefined) {
      this.setState({ plumbingVisible: visible });
    } else {
      this.setState({ plumbingVisible: !this.state.plumbingVisible });
    }
  }

  public render() {
    return (
      <ViewContainer
        id="templateConfiguration"
        name="Templates"
        className={ this.props.className }
        activeContainerName={ this.props.activeTab.name }>

        <TemplateConfigurationToolbar
          plumbingVisible={ this.state.plumbingVisible }
          togglePlumbingVisible={ this.togglePlumbingVisible }
          addTemplate={ this.addTemplate }
          addTemplates={ this.addTemplates } />

        <div id="templateConfigurationBody">
          <TemplatePlumbingWrapper
            templates={ this.props.templates }
            templateVersion={ this.props.templateVersion }
            focusedTemplate={ this.state.focusedTemplate }
            plumbingVisible={ this.state.plumbingVisible }
            onTemplatesChanged={ this.props.onTemplatesChanged }
            focusTemplate={ this.focusTemplate }
            addTemplate={ this.addTemplate }
            deleteTemplate={ this.deleteTemplate }/>
        </div>

        <TemplateConfigurationSidebar
          onTemplateChanged={ this.props.onTemplatesChanged }
          focusedTemplate={ this.state.focusedTemplate }
        />

      </ViewContainer>
    );
  }
}