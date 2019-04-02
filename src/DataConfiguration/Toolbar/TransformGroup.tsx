import * as React from 'react';
import { Transform } from 'vega';

import { TransformGroup } from '../../Model/DataModel/Transforms/TransformTypes';

import './TransformGroup.css';

interface Props {
  groupName: TransformGroup;
  addBlock: (transform: Transform) => void;
  className: string;
  visible: boolean;
  onGroupClicked: (groupName: string) => void;
}

export default class TransformGroupBlock extends React.Component<Props, {}> {

  private toggleGroup() {
    if (this.props.visible) {
      this.props.onGroupClicked(null);
    } else {
      this.props.onGroupClicked(this.props.groupName);
    }
  }

  private renderTransform(transform: any) {
    return (
      <div
        key={ transform.type }
        className="transform"
        onClick={ () => {
          this.props.addBlock(transform);
          this.props.onGroupClicked(null);
        }}>

        { transform.type }
      </div>
    );
  }

  private renderTransforms() {
    // const transformsByName = transformGroups.get(this.props.groupName);
    // const transforms: JSX.Element[] = [];

    // transformsByName.forEach((value, key) => {
    //   transforms.push(this.renderTransform(value));
    // });

    // return (
    //   <div className={`transforms ${this.props.visible ? '' : 'hidden'}`}>
    //     { transforms }
    //   </div>
    // );
  }

  public render() {
    return (
      <div className={ this.props.className + ' transformGroup'}>
        <h2 onClick={ this.toggleGroup.bind(this) }>
          {this.props.groupName}
        </h2>

        { this.renderTransforms() }
      </div>
    );
  }
}