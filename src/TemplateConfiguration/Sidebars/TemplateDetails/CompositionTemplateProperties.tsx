import * as React from 'react';
import Template from '../../TemplateModel/Template';
import RepeatTemplate from '../../TemplateModel/RepeatTemplate';
import FacetTemplate from '../../TemplateModel/FacetTemplate';
import LayerTemplate from '../../TemplateModel/LayerTemplate';
import ConcatTemplate from '../../TemplateModel/ConcatTemplate';

interface Props {
  template: Template;
  onTemplateChanged: () => void;
}
interface State {
}

export default class CompositionTemplateProperties extends React.Component<Props, State> {
  private renderRepeatProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderFacetProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderLayerProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderConcatProperties() {
    return (
      <div className="properties"></div>
    );
  }

  private renderProperties() {
    let properties: JSX.Element = null;

    if (this.props.template instanceof RepeatTemplate) {
      properties = this.renderRepeatProperties();
    } else if (this.props.template instanceof FacetTemplate) {
      properties = this.renderFacetProperties();
    } else if (this.props.template instanceof LayerTemplate) {
      properties = this.renderLayerProperties();
    } else if (this.props.template instanceof ConcatTemplate) {
      properties = this.renderConcatProperties();
    }

    return properties;
  }

  public render() {
    return (
      <div className="compositionTemplateProperties">
        { this.renderProperties() }
      </div>
    );
  }
}