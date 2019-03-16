import * as React from 'react';

import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import TemplateEditor from './TemplateEditor';
import CompositeTemplate from './TemplateModel/CompositeTemplate';
import Template from './TemplateModel/Template';

import './TemplateConfigurationView.css';
import Layout from './TemplateModel/Layout';
import VisualMarkTemplate from './TemplateModel/VisualMark';

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
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.onTemplatesChanged = this.onTemplatesChanged.bind(this);

    const repeatLayout = new Layout('repeat');
    const histogramLayout = new Layout('histogram');
    const cartesianLayout = new Layout('cartesian');

    const compositeTemplate = new CompositeTemplate(repeatLayout, [], null);
    const compositeTemplate2 = new CompositeTemplate(histogramLayout, [], compositeTemplate);

    const atomicTemplate = new VisualMarkTemplate('circle', compositeTemplate2);
    const atomicTemplate2 = new VisualMarkTemplate('bar', compositeTemplate2);

    compositeTemplate.visualElements.push(compositeTemplate2);
    compositeTemplate2.visualElements.push(atomicTemplate)

    this.state = {
      templates: [compositeTemplate, compositeTemplate2, atomicTemplate, atomicTemplate2]
    };
  }

  private addTemplate() {
    const templates = this.state.templates;
    const newTemplate = new CompositeTemplate(null, [], null);

    templates.push(newTemplate);
    this.onTemplatesChanged();
  }

  private deleteTemplate(template: Template) {
    const templates = this.state.templates;
    const indexInTemplates = templates.indexOf(template);

    if (indexInTemplates === -1) {
      return;
    }

    if (template.parent !== null) {
      const indexInParent = template.parent.visualElements.indexOf(template);
      template.parent.visualElements.splice(indexInParent, 1);
    }

    templates.splice(indexInTemplates, 1);
    this.onTemplatesChanged();
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
          onTemplatesChanged={ this.onTemplatesChanged }
          deleteTemplate={ this.deleteTemplate }/>

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