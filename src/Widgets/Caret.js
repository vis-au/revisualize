import React, {Component} from 'react';

import './Caret.css';

class Caret extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointsUp: true
    }
  }

  toggle() {
    this.setState({
      pointsUp: !this.state.pointsUp
    });

    this.props.onClick();
  }

  render() {
    return (
      <button
        onClick={ this.toggle.bind(this) }
        className= { this.state.pointsUp ? 'caret up' : 'caret down'}
        >
        ^
      </button>
    );
  }
}

export default Caret;