import Bar from './Bar';
import Flow from './Flow';
import Line from './Line';
import Point from './Point';
import Text from './Text';
import { VisualElement } from './VisualElement';

export type VisualElementType = 'Bar' | 'Line' | 'Point' | 'Text';

export default class VisualElementFactory {
  public getVisualElement(type: VisualElementType): VisualElement {
    let element: VisualElement;

    if (type === 'Bar') {
      element = new Bar();
    } else if (type === 'Line') {
      element = new Line();
    } else if (type === 'Point') {
      element = new Point();
    } else if (type === 'Text') {
      element = new Text();
    } else if (type === 'Flow') {
      element = new Flow();
    } else {
      throw new Error(`unknown dropped visual element "${type}"`);
    }

    return element;
  }
}