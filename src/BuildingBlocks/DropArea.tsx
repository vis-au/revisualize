import * as React from 'react';

import './DropArea.css';

interface Props {
  id: string;
  className: string;
  plumbing: any;
  onDrop: (elem: any, event?: any) => boolean;
}

export default class DropArea extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    setTimeout(this.makeDroppable.bind(this), 0);
  }

  private makeDroppable() {
    const block = document.querySelector(`#${this.props.id}.dropArea`);
    this.props.plumbing.droppable(block, {
      drop: this.props.onDrop
    });
  }

  public render() {
    return (
      <div id={ this.props.id } className={ 'dropArea ' + this.props.className } />
    );
  }
}