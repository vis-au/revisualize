import * as React from 'react';

import './IconRadioButtonGroup.css';

interface Props {
  id: string;
  checkedValue: any;
  icons: any[];
  updateActiveValue: (value: any) => void;
}

export default class IconRadioButtonGroup extends React.Component<Props, {}> {

  private onIconChecked(event: any) {
    this.props.updateActiveValue(event.target.value);
  }

  private renderIconRadioButton(icon: any) {
    const id = this.props.id + icon.value;

    return (
      <div key={ id } className="iconRadioButton">
        <input
          type="radio"
          id={ id }
          name={ this.props.id }
          value={ icon.value }
          onChange={ this.onIconChecked.bind(this) }
          checked={ this.props.checkedValue === icon.value}
        />
        <label htmlFor={ id } title={ icon.value }>
          <span className="material-icons icon">{ icon.name }</span>
          <span>{ icon.value }</span>
        </label>
      </div>
    );
  }

  public render() {
    return (
      <div className="iconRadioButtonGroup">
        { this.props.icons.map(this.renderIconRadioButton.bind(this)) }
      </div>
    );
  }
}