import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import * as React from 'react';

import Pattern from '../Model/Pattern/Pattern';
import PatternGraph from '../Model/Pattern/PatternGraph';
import Tab from '../ToolkitView/Tab';
import ViewContainer from '../ToolkitView/ViewContainer';
import VegaViewComponent from './VegaViewComponent';

import './PreviewComponentView.css';

interface Props {
  activeTab: Tab;
  width: number;
  height: number;
  patternGraph: PatternGraph;
}

export default class PreviewComponentView extends React.Component<Props, {}> {

  private makeViewsSortable() {
    $('#previewComponentViews').sortable();
    console.log($('#previewComponentViews'))
  }

  private renderPatternGroupInVegaView(patternList: Pattern[], index: number) {
    return (
      <VegaViewComponent key={ index } patternList={ patternList } />
    );
  }

  private renderPatternsInVegaView() {
    return (
      <div id="previewComponentViews">
        { this.props.patternGraph.getPatternGroups().map(this.renderPatternGroupInVegaView.bind(this)) }
      </div>
    );
  }

  public render() {
    if (this.props.activeTab.name !== 'Dashboard') { return false; }

    return (
      <ViewContainer
        id="previewComponent"
        name="Dashboard"
        activeContainerName={ this.props.activeTab.name }>
        <div style={{ maxHeight: this.props.height - 50, overflow: 'hidden' }}>
          { this.renderPatternsInVegaView() }
        </div>
      </ViewContainer>
    );
  }

  public componentDidMount() {
    this.makeViewsSortable();
  }

  public componentDidUpdate() {
    this.makeViewsSortable();
  }
}