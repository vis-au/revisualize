import Bar from '../Model/Elements/Bar';
import Flow from '../Model/Elements/Flow';
import Line from '../Model/Elements/Line';
import Point from '../Model/Elements/Point';
import Text from '../Model/Elements/Text';
import { VisualElement } from '../Model/Elements/VisualElement';
import Highlight from '../Model/Interactions/Highlight';
import { Interaction } from '../Model/Interactions/Interaction';
import PanZoom from '../Model/Interactions/PanZoom';
import LayoutFactory from '../Model/Layouts/LayoutFactory';
import { LayoutStructure } from '../Model/Layouts/LayoutStructure';


// VISUAL ELEMENTS
export interface IconVisualElementBlock {
  name: string,
  icon: string,
  visualElement: VisualElement
}

export const DEFAULT_MARK_ICONS: IconVisualElementBlock[] = [
  { name: 'Point', icon: 'brightness_1', visualElement: new Point() },
  { name: 'Icon', icon: 'location_on', visualElement: null },
  { name: 'Glyph', icon: 'filter_vintage', visualElement: null },
  { name: 'Line', icon: 'show_chart', visualElement: new Line() },
  { name: 'Area', icon: 'pie_chart', visualElement: null },
  { name: 'Flow', icon: 'view_streams', visualElement: new Flow() },
  { name: 'Bar', icon: 'assessment', visualElement: new Bar() },
  { name: 'Text', icon: 'translate', visualElement: new Text() }
];

// LAYOUTS
const layoutFactory: LayoutFactory = new LayoutFactory();

export interface IconLayoutBlock {
  name: string,
  icon: string,
  layout: LayoutStructure
}

export const DEFAULT_LAYOUT_ICONS: IconLayoutBlock[] = [
  { name: '2D Plot', icon: 'crop_square', layout: layoutFactory.getLayout('_D_Plot') },
  { name: 'Histogram', icon: 'bar_chart', layout: layoutFactory.getLayout('Histogram') },
  { name: 'List', icon: 'list', layout: layoutFactory.getLayout('List') },
  { name: 'Parallel Plot', icon: 'view_week', layout: layoutFactory.getLayout('Parallel_Plot') },
  { name: 'Radial', icon: 'pie_chart', layout: layoutFactory.getLayout('Radial') },
];

// INTERACTIONS
export interface IconInteractionBlock {
  name: string,
  icon: string,
  interaction: Interaction
}

export const DEFAULT_INTERACTION_ICONS: IconInteractionBlock[] = [
  { name: 'Highlight', icon: 'info', interaction: new Highlight() },
  { name: 'PanZoom', icon: 'pan_tool', interaction: new PanZoom() }
];