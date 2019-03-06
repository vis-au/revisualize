import * as React from 'react';

import VegaRenderer from '../Model/Renderer/VegaRenderer';

import './MiniPreview.css';

interface Props {
  schema: any;
}
interface State {
  previewVisible: boolean;
}

export default class MiniPreview extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      previewVisible: false
    };
  }

  private toggleWindow() {
    this.setState({ previewVisible: !this.state.previewVisible });
  }

  public render() {
    return (
      <div id="miniPreview">
        <div id="miniPreviewWindow" className={ this.state.previewVisible ? '' : 'hidden' }>
          <VegaRenderer schema={ this.props.schema } width={ 300 } height={ 200 } />
        </div>
        <button
          id="toggleMiniPreview"
          className={ this.state.previewVisible ? 'active' : '' }
          onClick={ this.toggleWindow.bind(this) }>

          Preview
        </button>
      </div>
    );
  }
}