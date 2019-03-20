import * as d3 from 'd3';
import { ZoomTransform } from 'd3';
import * as React from 'react';

import './DiagramEditor.css';

interface Props {
  id: string;
  dragPlumbing: any;
  plumbingConfig: any;
  onNewConnection: (newConnection: any) => void;
  onConnectionMoved?: (connection: any) => void;
  onDetachedConnection: (oldConnection: any) => void;
  onDiagramClicked: (event: any) => void;
  renderBlocks: () => JSX.Element[];
}

export default class DiagramEditor extends React.Component<Props, {}> {

  private lastTransform: ZoomTransform;

  constructor(props: Props) {
    super(props);

    this.lastTransform = d3.zoomIdentity;
  }

  private configurePlumbing() {
    const plumbing = this.props.dragPlumbing;

    plumbing.bind('connection', this.props.onNewConnection);
    plumbing.bind('connectionDetached', this.props.onDetachedConnection);
    plumbing.bind('connectionMoved', this.props.onConnectionMoved);

    const container = document.querySelector(`#${this.props.id} .diagram`);

    plumbing.setContainer(container);
    plumbing.importDefaults(this.props.plumbingConfig);

    this.addZoomBehavior();
  }

  private addZoomBehavior() {
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 1])
      .on('zoom', this.onZoomed.bind(this));

    d3.select(`#${this.props.id}.diagramContainer`);
      // .call(zoomBehavior);
  }

  private onZoomed() {
    if (d3.event.sourceEvent.target.classList.contains('resizable')) { return; }

    const t = d3.event.transform;
    const style = `translate(${t.x}px,${t.y}px)scale(${t.k})`;
    const plumbing = this.props.dragPlumbing;
    const duration = this.lastTransform.k === t.k ? 0 : 250;

    d3.selectAll(`#${this.props.id} .diagram > div`)
      .transition()
      .duration(duration)
      .style('transform', style);

    plumbing.setZoom(t.k);

    this.lastTransform = t;
  }

  public render() {
    return (
      <article
        id={ this.props.id }
        className="diagramContainer"
        onClick={ this.props.onDiagramClicked }
        style={{ height: window.innerHeight - 75 }}>

        { this.props.children }

        <div className="diagram">
          { this.props.renderBlocks() }
        </div>
      </article>
    );
  }

  public componentDidMount() {
    this.props.dragPlumbing.ready(this.configurePlumbing.bind(this));
  }
}
