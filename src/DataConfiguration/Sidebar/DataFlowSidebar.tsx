import * as React from 'react';

import { DataflowNode } from '../../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../../Model/DataFlowGraph/TransformNode';
import Sidebar from '../../Widgets/Sidebar';
import DatasetPreview from './DatasetPreview';

import './DataFlowSidebar.css';

interface Props {
  focusedNode: DataflowNode;
  updateFocusedNode: () => void;
  showDataImport: () => void;
}
interface State {
  isTitleInputVisible: boolean;
  isTextAreaFocused: boolean;
  textAreaText: string;
}

export default class DataFlowsidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isTitleInputVisible: false,
      isTextAreaFocused: false,
      textAreaText: ''
    };
  }

  private onNodeNameChanged(event: any) {
    if (event.key === 'Enter') {
      this.setState({ isTitleInputVisible: false });
      return;
    }

    this.props.focusedNode.name = event.target.value;
    this.props.updateFocusedNode();
  }

  private getSelectedNodeName() {
    if (this.props.focusedNode === null) {
      // focused node was unselected
      return '';
    } else if (this.props.focusedNode === undefined) {
      // focused node was deleted
      return '';
    } else if (this.props.focusedNode instanceof DatasetNode) {
      return this.props.focusedNode.name;
    } else if (this.props.focusedNode instanceof TransformNode) {
      return this.props.focusedNode.name;
    }
  }

  private renderDatasetNodeConfigurationEntry(key: string) {
    if ((this.props.focusedNode.data as any)[key] === undefined) {
      return false;
    }

    let value: string = (this.props.focusedNode.data as any)[key];

    if (typeof value !== 'string') {
      value = JSON.stringify(value, null, 2);
    }

    return (
      <div
        className="datasetNodeConfigurationEntry"
        key={ `${this.props.focusedNode.id}${key}` }>

        <div className="key">{ key }</div>
        <div
          id={ `${this.props.focusedNode.id}${key}` }
          className="value"
          title={ value }>

          { value }
        </div>
      </div>
    );
  }

  private renderDatasetNodeConfiguration() {
    if (!(this.props.focusedNode instanceof DatasetNode)) {
      return false;
    }

    const nodeConfigurationKeys = Object.keys(this.props.focusedNode.data);

    return (
      <div id="dataflowSidebarDatasetNodeConfiguration">
        {
          nodeConfigurationKeys
            .filter(key => key !== 'name')
            .filter(key => key !== 'transform')
            .map((d: string) => this.renderDatasetNodeConfigurationEntry(d))
        }
        <DatasetPreview datasetNode={ this.props.focusedNode } />
      </div>
    );
  }

  private getNodeType() {
    if (this.props.focusedNode === null) { return ''; }
    if (this.props.focusedNode === undefined) { return ''; }

    return this.props.focusedNode.type;
  }

  private saveTransformChanges() {
    const textArea = document.querySelector('#dataflowSidebarTransformNodeConfiguration textarea');

    if (textArea === undefined) { return; }

    const newTransform = JSON.parse(textArea.textContent);
  }

  private onTransformTextareaChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!(this.props.focusedNode instanceof TransformNode)) { return false; }

    // update the focused transform only if the text in the secondary textfield is a valid json
    // object
    this.setState({ textAreaText: event.target.value });

    try {
      const value = JSON.parse(event.target.value);
      this.props.focusedNode.transform = value;
      this.props.updateFocusedNode();
    } catch(error) {
      throw error;
    }
  }

  private renderTitle() {
    if (this.props.focusedNode === undefined) { return false; }
    if (this.props.focusedNode === null) { return false; }

    const isInputVisible = this.state.isTitleInputVisible;
    const isDataset = this.props.focusedNode instanceof DatasetNode;

    return (
      <div id="dataflowSidebarTitle">
        <h2
          className={ (isInputVisible && !isDataset) ? 'hidden' : '' }
          onClick={ () => this.setState({ isTitleInputVisible: !isDataset }) }>
          <span className="focusedNodeTitle">{ this.getSelectedNodeName() }</span>
          <span className="focusedNodeType">{ this.getNodeType() }</span>
        </h2>
        <input
          id="modifyNodeName"
          className={ isInputVisible ? '' : 'hidden' }
          type="text"
          value={ this.props.focusedNode.name }
          onChange={ this.onNodeNameChanged.bind(this) }
          onBlur={ () => this.setState({ isTitleInputVisible: false }) }
        />
      </div>
    );
  }

  private renderTransformNodeConfiguration() {
    if (!(this.props.focusedNode instanceof TransformNode)) { return false; }

    const text = JSON.stringify(this.props.focusedNode.transform, null, 2);

    return (
      <div id="dataflowSidebarTransformNodeConfiguration">
        <textarea
          id="dataflowSidebarPreview"
          className={ this.state.isTextAreaFocused ? 'hidden' : '' }
          value={ text }
          readOnly={ true }
          onClick={ () => this.setState({ isTextAreaFocused: true, textAreaText: text }) } />
        <textarea
          id="dataflowSidebarEdit"
          className={ this.state.isTextAreaFocused ? '' : 'hidden' }
          value={ this.state.textAreaText }
          autoFocus={ this.state.isTextAreaFocused }
          onBlur={ () => this.setState({ isTextAreaFocused: false }) }
          onChange={ this.onTransformTextareaChanged.bind(this) } />
      </div>
    );
  }

  private renderFocusedNodeConfiguration() {
    if (this.props.focusedNode === null) { return false; }
    if (this.props.focusedNode === undefined) { return false; }

    if (this.props.focusedNode instanceof DatasetNode) {
      return this.renderDatasetNodeConfiguration();
    }

    return this.renderTransformNodeConfiguration();
  }

  public render() {
    return (
      <Sidebar
        id="dataFlowSidebar"
        positionLeft={ true }
        hidden={ this.props.focusedNode === null || this.props.focusedNode === undefined }
        height={ window.innerHeight - 125 }>

        { this.renderTitle() }
        { this.renderFocusedNodeConfiguration() }

        <button
          className="floatingAddButton"
          id="addNewDataset"
          onClick={ this.props.showDataImport }>

          +
        </button>
      </Sidebar>
    );
  }
}