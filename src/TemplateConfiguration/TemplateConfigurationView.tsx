import * as React from 'react';

import DataImporter from '../Model/DataModel/DataImporter';
import Template from '../Model/TemplateModel/Template';
import ViewContainer from '../ToolkitView/ViewContainer';
import TemplatePlumbingWrapper from './LayeredDiagramEditor/TemplatePlumbingWrapper';
import TemplateConfigurationSidebar from './Sidebars/TemplateDetails/TemplateConfigurationSidebar';
import TemplateConfigurationToolbar from './Toolbar/TemplateConfigurationToolbar';

import './TemplateConfigurationView.css';
import ExampleOverlay from './Toolbar/ExampleOverlay';
import VegaInputOverlay from './Toolbar/VegaInputOverlay';

interface Props {
  className: string;
  templates: Template[];
  onTemplatesChanged: () => void;
  onDatasetsChanged: () => void;
}
interface State {
  focusedTemplate: Template;
  plumbingVisible: boolean;
  exampleOverlayVisible: boolean;
  vegaInputOverlayVisible: boolean;
}

export default class TemplateConfigurationView extends React.Component<Props, State> {
  private dataImporter: DataImporter;

  constructor(props: Props) {
    super(props);

    this.addTemplate = this.addTemplate.bind(this);
    this.addTemplates = this.addTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.focusTemplate = this.focusTemplate.bind(this);
    this.togglePlumbingVisible = this.togglePlumbingVisible.bind(this);
    this.toggleExampleOverlayVisible = this.toggleExampleOverlayVisible.bind(this);
    this.toggleVegaInputOverlayVisible = this.toggleVegaInputOverlayVisible.bind(this);

    this.dataImporter = new DataImporter();
    this.dataImporter.onNewDataset = this.props.onDatasetsChanged;

    this.state = {
      focusedTemplate: null,
      plumbingVisible: true,
      exampleOverlayVisible: false,
      vegaInputOverlayVisible: false,
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

    templates.forEach(template => {
      if (template.dataTransformationNode !== null) {
        this.dataImporter.loadFieldsAndValuesToNode(template.dataTransformationNode);
      }
    });

    this.props.onTemplatesChanged();
  }

  private storeDataInParentAndChildren(template: Template) {
    if (template.dataTransformationNode === null || template.dataTransformationNode === undefined) {
      return;
    }

    if (template.parent !== null) {
      if (!!template.parent.dataTransformationNode) {
        // template.parent.data = JSON.parse(JSON.stringify(template.data));
        template.parent.dataTransformationNode = template.dataTransformationNode;
      }
    }

    template.visualElements
      .filter(t => t.dataTransformationNode === null || t.dataTransformationNode === undefined)
      .forEach(t => {
        // t.data = JSON.parse(JSON.stringify(template.data));
        t.dataTransformationNode = template.dataTransformationNode;
    });
  }

  private storeDatasetsInParentAndChildren(template: Template) {
    if (template.datasets === null || template.datasets === undefined) {
      return;
    }

    if (template.parent !== null) {
      if (!!template.parent.datasets) {
        Object.keys(template.datasets).forEach(datasetID => {
          template.parent.datasets[datasetID] = template.datasets[datasetID];
        });
      }
    }

    template.visualElements
      .forEach(t => {
        if (t.datasets === null || t.datasets === undefined) {
          t.datasets = {};
        }

        Object.keys(template.datasets).forEach(datasetID => {
          t.datasets[datasetID] = template.datasets[datasetID];
        });
      });
  }

  private deleteTemplate(template: Template) {
    const templates = this.props.templates;
    const indexInTemplates = templates.indexOf(template);

    if (indexInTemplates === -1) {
      return;
    }

    this.storeDataInParentAndChildren(template);
    this.storeDatasetsInParentAndChildren(template);

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

  private toggleExampleOverlayVisible(visible?: boolean) {
    if (visible !== undefined) {
      this.setState({
        exampleOverlayVisible: visible
      });
    } else {
      this.setState({
        exampleOverlayVisible: !this.state.exampleOverlayVisible
      });
    }
  }

  private toggleVegaInputOverlayVisible(visible?: boolean) {
    if (visible !== undefined) {
      this.setState({
        vegaInputOverlayVisible: visible
      });
    } else {
      this.setState({
        vegaInputOverlayVisible: !this.state.vegaInputOverlayVisible
      });
    }
  }

  public render() {
    return (
      <ViewContainer
        id="templateConfiguration"
        name="Templates"
        className={ this.props.className }
        activeContainerName="Templates">

        <TemplateConfigurationToolbar
          plumbingVisible={ this.state.plumbingVisible }
          togglePlumbingVisible={ this.togglePlumbingVisible }
          toggleExampleOverlayVisible={ this.toggleExampleOverlayVisible }
          toggleVegaLiteInput={ this.toggleVegaInputOverlayVisible } />

        <div id="templateConfigurationBody">
          <TemplatePlumbingWrapper
            templates={ this.props.templates }
            focusedTemplate={ this.state.focusedTemplate }
            plumbingVisible={ this.state.plumbingVisible }
            onTemplatesChanged={ this.props.onTemplatesChanged }
            focusTemplate={ this.focusTemplate }
            addTemplate={ this.addTemplate }
            deleteTemplate={ this.deleteTemplate }/>
        </div>

        <TemplateConfigurationSidebar
          onTemplateChanged={ this.props.onTemplatesChanged }
          focusedTemplate={ this.state.focusedTemplate } />

        <ExampleOverlay
          hidden={ !this.state.exampleOverlayVisible }
          addTemplates={this.addTemplates}
          hide={ () => this.toggleExampleOverlayVisible(false) }/>

        <VegaInputOverlay
          hidden={ !this.state.vegaInputOverlayVisible }
          addTemplates={ this.addTemplates }
          hide={ () => this.toggleVegaInputOverlayVisible(false) } />

      </ViewContainer>
    );
  }
}