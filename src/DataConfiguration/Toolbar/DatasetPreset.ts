import { DataFormat } from 'vega-lite/build/src/data';

export interface DatasetPreset { url: string; name: string; format?: DataFormat }

export const PRESET_DATASETS: DatasetPreset[] = [
  { name: 'Cars', url: 'https://vega.github.io/vega-lite/data/cars.json'},
  { name: 'Weather', url: 'https://vega.github.io/vega-lite/data/seattle-weather.csv'},
  { name: 'Movies', url: 'https://vega.github.io/vega-lite/data/movies.json'},
  { name: 'Population', url: 'https://vega.github.io/vega-lite/data/population.json'},
  { name: 'Driving', url: 'https://vega.github.io/vega-lite/data/driving.json'},
  { name: 'Disasters', url: 'https://vega.github.io/vega-lite/data/disasters.csv'},
  { name: 'CO²', url: 'https://vega.github.io/vega-lite/data/co2-concentration.csv'},
];