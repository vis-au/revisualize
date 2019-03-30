import * as React from 'react';

import DatasetNode from '../../TemplateConfiguration/VegaLiteData/Datasets/DatasetNode';

import './DatasetPreview.css';

interface Props {
  datasetNode: DatasetNode;
}
interface State {

}

export default class DatasetPreview extends React.Component<Props, State> {
  constructor(props: Props)  {
    super(props);
  }

  private renderTableHeaderField(field: string, totalNumberOfFields: number) {
    const maxWidth = 1 / totalNumberOfFields * 300;

    return (
      <td key={ field } title={ field } style={{ maxWidth }}>{ field }</td>
    );
  }

  private renderTableHeader() {
    const fields = this.props.datasetNode.fields.sort();

    return (
      <thead>
        <tr>
          { fields.map(field => this.renderTableHeaderField(field, fields.length)) }
        </tr>
      </thead>
    );
  }

  private renderValueEntry(entry: string, key: string) {
    return (
      <td key={ `entry${entry}${key}` } title={ entry }>{ entry }</td>
    );
  }

  private renderObjectAsRow(row: any, index: number) {
    const valueKeys = Object.keys(row).sort();

    return (
      <tr className={ index % 2 === 0 ? 'even' : 'odd' } key={ `row${index}` }>
        { valueKeys.map(key => this.renderValueEntry(JSON.stringify(row[key as any]), key)) }
      </tr>
    );
  }

  private renderTableBody() {
    const values = this.props.datasetNode.values;

    if (!(values instanceof Array)) {
      return null;
    } else if (!(typeof values[0] === 'object')) {
      return null;
    }

    const firstTenValues = values.slice(0, 10) as any[];

    return (
      <tbody>
        { firstTenValues.map((row, i) => this.renderObjectAsRow(row, i)) }
      </tbody>
    );
  }

  public render() {
    return (
      <div className="datasetPreview">
        <h2>Contents</h2>
        <table>
          { this.renderTableHeader() }
          { this.renderTableBody() }
        </table>
      </div>
    );
  }
}