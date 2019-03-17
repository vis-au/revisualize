import * as React from 'react';
import { Mark } from 'vega-lite/build/src/mark';

import Toolbar from '../../Widgets/Toolbar';
import CompositeTemplate from '../TemplateModel/CompositeTemplate';
import Layout from '../TemplateModel/Layout';
import { LayoutType } from '../TemplateModel/LayoutType';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMark';

import './TemplateConfigurationToolbar.css';

interface Props {
  addTemplate: (template: Template) => void;
  addTemplates: (templates: Template[]) => void;
}

function getScatterplotMatrixPreset(): Template {
  const repeatLayout = new Layout('repeat');
  const histogramLayout = new Layout('histogram');

  const compositeTemplate = new CompositeTemplate(repeatLayout, [], null);
  const compositeTemplate2 = new CompositeTemplate(histogramLayout, [], compositeTemplate);

  const atomicTemplate = new VisualMarkTemplate('circle', compositeTemplate2);

  compositeTemplate.visualElements.push(compositeTemplate2);
  compositeTemplate2.visualElements.push(atomicTemplate);

  return compositeTemplate;
}

export default class TemplateConfigurationToolbar extends React.Component<Props, {}> {
  private templatePresets: Map<string, Template>;

  constructor(props: Props) {
    super(props);

    this.onMarkClicked = this.onMarkClicked.bind(this);

    this.templatePresets = new Map();
    this.templatePresets.set('Scatterplot Matrix', getScatterplotMatrixPreset())
  }

  private onMarkClicked(mark: Mark) {
    const newVisualMark = new VisualMarkTemplate(mark, null);

    this.props.addTemplate(newVisualMark);
  }

  private onLayoutClicked(type: LayoutType) {
    const newLayout = new Layout(type);
    const newCompositeTemplate = new CompositeTemplate(newLayout, [], null);

    this.props.addTemplate(newCompositeTemplate);
  }

  private onPresetClicked(id: string) {
    const preset = this.templatePresets.get(id);

    if (preset === undefined || preset === null) {
      return;
    }

    const flatTemplateHierarchy = preset.getFlatHierarchy();
    this.props.addTemplates(flatTemplateHierarchy);
  }

  private renderMarkBlock(mark: Mark) {
    return (
      <button key={ mark } onClick={ () => this.onMarkClicked(mark) }>{ mark }</button>
    );
    // return (
    //   <VisualElementBuildingBlock
    //     id={ mark.name }
    //     key={ mark.name }
    //     visualElement={ mark.visualElement }
    //     className="patternToolbarMarkOption" />
    // );
  }

  private renderLayoutBlock(type: LayoutType) {
    return (
      <button key={ type } onClick={ () => this.onLayoutClicked(type) }>{ type }</button>
    );
  }

  private renderPresetTemplate(key: string) {
    return (
      <button key={ key } onClick={ () => this.onPresetClicked(key) }>{ key }</button>
    );
  }

  private renderPresetTemplates(): JSX.Element[] {
    const templates: JSX.Element[] = [];

    this.templatePresets.forEach((preset, key) => {
      templates.push(this.renderPresetTemplate(key));
    });

    return templates;
  }

  public render() {
    const DEFAULT_MARK_ICONS: Mark[] = ['area', 'bar', 'point', 'text', 'rect'];
    const DEFAULT_LAYOUT_ICONS: LayoutType[] = ['cartesian', 'concatenate', 'histogram', 'overlay', 'repeat'];

    return (
      <Toolbar id="templateToolbar">
        <div id="templateToolbarVisualMarks">
          <h2>Marks</h2>
          { DEFAULT_MARK_ICONS.map(this.renderMarkBlock.bind(this)) }
        </div>
        <div id="templateToolbarLayouts">
          <h2>Layouts</h2>
          { DEFAULT_LAYOUT_ICONS.map(this.renderLayoutBlock.bind(this)) }
        </div>
        <div id="templatePresets">
          <h2>Templates</h2>
          { this.renderPresetTemplates() }
        </div>
      </Toolbar>
    );
  }
}