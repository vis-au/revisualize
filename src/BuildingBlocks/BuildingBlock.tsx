import * as React from 'react';

import Utils from '../UtilityFunctions';

import './BuildingBlock.css';

interface Props {
  id: string;
  className: string;
  plumbing?: any;
  disablePlumbing?: boolean;
  onDelete?: (event: any) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseMove?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
}

export default class BuildingBlock extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    if (this.props.disablePlumbing === undefined || !this.props.disablePlumbing) {
      setTimeout(this.addPlumbing.bind(this), 0);
    }
  }

  private addPlumbing() {
    if (this.props.plumbing === undefined) { return; }

    const noSpaceID = Utils.getValidDOMSelector(this.props.id);
    const block = document.querySelector('#' + noSpaceID + '.buildingBlock');

    this.props.plumbing.draggable(block, {
      clone: true,
      filter: '.delete,.nodrag',
      stop: (el: any) => {
        // console.log(el)
      },
    });
  }

  private onDelete(event: any) {
    event.stopPropagation();
    this.props.onDelete(event);
  }

  private renderDeleteButton() {
    if (this.props.onDelete === undefined) { return false; }

    return (
      <span className="delete" onClick={ this.onDelete.bind(this) }></span>
    );
  }

  public render() {
    const noSpaceID = Utils.getValidDOMSelector(this.props.id);

    return (
      <div
        id={ noSpaceID }
        className={ 'buildingBlock ' + this.props.className }
        onMouseEnter={ this.props.onMouseEnter }
        onMouseMove={ this.props.onMouseMove }
        onMouseLeave={ this.props.onMouseLeave }
        onClick={ this.props.onClick }
      >

        { this.props.children }
        { this.renderDeleteButton() }
      </div>
    );
  }
}