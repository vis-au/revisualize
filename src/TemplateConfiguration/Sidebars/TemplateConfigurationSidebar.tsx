import * as React from 'react';

import Sidebar from '../../Widgets/Sidebar';
import CompositeTemplate from '../TemplateModel/CompositeTemplate';
import Layout from '../TemplateModel/Layout';
import { FacetChannelEncoding, GeographicPositionEncoding, HyperLinkChannelEncoding, KeyChannelEncoding, LoDChannelEncoding, MarkEncoding, MarkEncodingGroup, markEncodingGroups, MarkPropertiesChannelEncoding, OrderChannelEncoding, PositionEncoding, TextTooltipChannelEncoding } from '../TemplateModel/MarkEncoding';
import Template from '../TemplateModel/Template';
import VisualMarkTemplate from '../TemplateModel/VisualMark';
import EncodingGroupBlock from './EncodingGroupBlock';

import './TemplateConfigurationSidebar.css';

interface Props {
}
interface State {
  hidden: boolean;
}

function getLineChartPreset(): Template {
  const histogramLayout = new Layout('histogram');
  const overlayLayout = new Layout('overlay');

  const compositeTemplate = new CompositeTemplate(overlayLayout, [], null);
  const compositeTemplate2 = new CompositeTemplate(histogramLayout, [], compositeTemplate);
  const compositeTemplate3 = new CompositeTemplate(histogramLayout, [], compositeTemplate);

  const atomicTemplate = new VisualMarkTemplate('point', compositeTemplate2);
  const atomicTemplate2 = new VisualMarkTemplate('line', compositeTemplate3);

  compositeTemplate.visualElements.push(compositeTemplate2, compositeTemplate3);
  compositeTemplate2.visualElements.push(atomicTemplate);
  compositeTemplate3.visualElements.push(atomicTemplate2);

  return compositeTemplate;
}

function getAtomicTemplate(): VisualMarkTemplate {
  const atomicTemplate = new VisualMarkTemplate('point', null);
  atomicTemplate.setEncodedValue('x', {field: 'a', type: 'ordinal'});

  return atomicTemplate;
}

export default class TemplateConfigurationSidebar extends React.Component<Props, State> {
  private selectedTemplate: Template;

  constructor(props: Props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.renderEncodings = this.renderEncodings.bind(this);
    this.renderEncoding = this.renderEncoding.bind(this);

    this.selectedTemplate = getAtomicTemplate();

    this.state = { hidden: false };
  }

  public onToggle() {
    this.setState({ hidden: !this.state.hidden });
  }

  private renderEncoding(encoding: MarkEncodingGroup) {
    if (!(this.selectedTemplate instanceof VisualMarkTemplate)) {
      return null;
    }

    return (
      <EncodingGroupBlock
        key={ encoding }
        groupType={ encoding }
        template={ this.selectedTemplate }
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
        hidden={ this.state.hidden }
        positionLeft={ false }
        toggle={ this.onToggle }>

        { this.renderEncodings() }

      </Sidebar>
    );
  }
}