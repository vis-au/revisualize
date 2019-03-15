import * as React from 'react';

interface Props {
  views: Template
}
interface State {

}

export default class ViewContainer extends React.Component<Props, State> {
  public render() {
    return (
      <div className="viewContainer"></div>
    );
  }
}