import * as React from 'react';

import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import TemplateEditor from './TemplateEditor';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';
import TemplateConfigurationToolbar from './Toolbar/TemplateConfigurationToolbar';
import SpecDecompiler from './TemplateModel/SpecDecompiler';

import './TemplateConfigurationView.css';

interface State {
  templates: Template[];
}
interface Props {
  activeTab: Tab;
  className: string;
}

export default class TemplateConfigurationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.addTemplate = this.addTemplate.bind(this);
    this.addTemplates = this.addTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.onTemplatesChanged = this.onTemplatesChanged.bind(this);

    this.state = {
      templates: []
    };
  }

  private addTemplate(template?: Template) {
    const templates = this.state.templates;
    const newTemplate = template === undefined
      ? new CompositeTemplate(null, [], null)
      : template;

    templates.push(newTemplate);
    this.onTemplatesChanged();
  }

  private addTemplates(templates: Template[]) {
    const currentTemplates = this.state.templates;
    currentTemplates.push(...templates);
    this.onTemplatesChanged();
  }

  private addTemplateFromSpec() {
    const decompiler = new SpecDecompiler();

    const spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": [
          {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
          {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
          {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    };

    const decompilation = decompiler.decompile(spec);
    this.addTemplates(decompilation.getFlatHierarchy());
  }

  private deleteTemplate(template: Template) {
    const templates = this.state.templates;
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
    this.onTemplatesChanged();
  }

  private onTemplatesChanged() {
    this.setState({ templates: this.state.templates });
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
          <TemplateEditor
            templates={ this.state.templates }
            onTemplatesChanged={ this.onTemplatesChanged }
            addTemplate={ this.addTemplate }
            deleteTemplate={ this.deleteTemplate }/>

          <button
            className="floatingAddButton"
            id="addNewTemplate"
            onClick={ () => this.addTemplateFromSpec() }>

            +
          </button>
        </div>

      </ViewContainer>
    );
  }
}