import * as React from 'react';

import Pattern from '../../Model/Pattern/Pattern';

import './PatternSidebarTitle.css';

interface Props {
  selectedPattern: Pattern;
  updatePatternGraph: () => void;
}
interface State {
  isEditModeActive: boolean;
}

export default class PatternSidebarTitle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEditModeActive: false
    };
  }

  private setPatternTitle(event: any) {
    if (event.key !== 'Enter' && event.type !== 'click' && event.type !== 'blur') { return; }

    const pattern = this.props.selectedPattern;
    const name = document.querySelector('#patternTitle').querySelector('input').value;

    pattern.name = name;

    this.props.updatePatternGraph();
    this.setState({ isEditModeActive: false });
  }

  public render() {
    const name = this.props.selectedPattern === null ? '' : this.props.selectedPattern.name;

    return (
      <div id="patternTitle">
        <h2
          onClick={ () => this.setState({ isEditModeActive: true }) }
          className={ this.state.isEditModeActive ? 'hidden' : '' }>
          { name }
          <i className="material-icons">edit</i>
        </h2>
        <input
          type="input"
          defaultValue={ name }
          autoFocus={ true }
          onKeyPress={ this.setPatternTitle.bind(this) }
          onBlur={ this.setPatternTitle.bind(this) }
          className={ this.state.isEditModeActive ? '' : 'hidden' } />
        <i
          className={ this.state.isEditModeActive ? 'material-icons save' : 'hidden' }
          onClick={ this.setPatternTitle.bind(this) }>

          check</i>
      </div>
    );
  }
}