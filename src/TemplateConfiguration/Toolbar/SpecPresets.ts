export const populationLayerChart: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'description': 'The population of the German city of Falkensee over time',
  'width': 500,
  'data': {
    'values': [
      {'year': '1875', 'population': 1309},
      {'year': '1890', 'population': 1558},
      {'year': '1910', 'population': 4512},
      {'year': '1925', 'population': 8180},
      {'year': '1933', 'population': 15915},
      {'year': '1939', 'population': 24824},
      {'year': '1946', 'population': 28275},
      {'year': '1950', 'population': 29189},
      {'year': '1964', 'population': 29881},
      {'year': '1971', 'population': 26007},
      {'year': '1981', 'population': 24029},
      {'year': '1985', 'population': 23340},
      {'year': '1989', 'population': 22307},
      {'year': '1990', 'population': 22087},
      {'year': '1991', 'population': 22139},
      {'year': '1992', 'population': 22105},
      {'year': '1993', 'population': 22242},
      {'year': '1994', 'population': 22801},
      {'year': '1995', 'population': 24273},
      {'year': '1996', 'population': 25640},
      {'year': '1997', 'population': 27393},
      {'year': '1998', 'population': 29505},
      {'year': '1999', 'population': 32124},
      {'year': '2000', 'population': 33791},
      {'year': '2001', 'population': 35297},
      {'year': '2002', 'population': 36179},
      {'year': '2003', 'population': 36829},
      {'year': '2004', 'population': 37493},
      {'year': '2005', 'population': 38376},
      {'year': '2006', 'population': 39008},
      {'year': '2007', 'population': 39366},
      {'year': '2008', 'population': 39821},
      {'year': '2009', 'population': 40179},
      {'year': '2010', 'population': 40511},
      {'year': '2011', 'population': 40465},
      {'year': '2012', 'population': 40905},
      {'year': '2013', 'population': 41258},
      {'year': '2014', 'population': 41777}
    ],
    'format': {
      'parse': {'year': 'date:\'%Y\''}
    }
  },
  'layer': [
    {
      'mark': 'rect',
      'data': {
        'values': [
          {
            'start': '1933',
            'end': '1945',
            'event': 'Nazi Rule'
          },
          {
            'start': '1948',
            'end': '1989',
            'event': 'GDR (East Germany)'
          }
        ],
        'format': {
          'parse': {'start': 'date:\'%Y\'', 'end': 'date:\'%Y\''}
        }
      },
      'encoding': {
        'x': {
          'field': 'start',
          'type': 'temporal',
          'timeUnit': 'year',
          'axis': null
        },
        'x2': {
          'field': 'end',
          'timeUnit': 'year'
        },
        'color': {'field': 'event', 'type': 'nominal'}
      }
    },
    {
      'mark': 'line',
      'encoding': {
        'x': {
          'field': 'year',
          'type': 'temporal',
          'timeUnit': 'year'
        },
        'y': {'field': 'population', 'type': 'quantitative'},
        'color': {'value': '#333'}
      }
    },
    {
      'mark': 'point',
      'encoding': {
        'x': {
          'field': 'year',
          'type': 'temporal',
          'timeUnit': 'year'
        },
        'y': {'field': 'population', 'type': 'quantitative'},
        'color': {'value': '#333'}
      }
    }
  ]
};

export const barchartSpec: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'description': 'A simple bar chart with embedded data.',
  'data': {
    'values': [
      {'a': 'A','b': 28}, {'a': 'B','b': 55}, {'a': 'C','b': 43},
      {'a': 'D','b': 91}, {'a': 'E','b': 81}, {'a': 'F','b': 53},
      {'a': 'G','b': 19}, {'a': 'H','b': 87}, {'a': 'I','b': 52}
    ]
  },
  'mark': 'bar',
  'encoding': {
    'x': {'field': 'a', 'type': 'ordinal'},
    'y': {'field': 'b', 'type': 'quantitative'}
  }
};

export const scatterplotMatrixSpec: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'repeat': {
    'row': ['Horsepower', 'Acceleration', 'Miles_per_Gallon'],
    'column': ['Miles_per_Gallon', 'Acceleration', 'Horsepower']
  },
  'spec': {
    'data': {'url': 'https://vega.github.io/editor/data/cars.json'},
    'mark': 'point',
    'selection': {
      'brush': {
        'type': 'interval',
        'resolve': 'union',
        'on': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
        'translate': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
        'zoom': 'wheel![event.shiftKey]'
      },
      'grid': {
        'type': 'interval',
        'resolve': 'global',
        'bind': 'scales',
        'translate': '[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!',
        'zoom': 'wheel![!event.shiftKey]'
      }
    },
    'encoding': {
      'x': {'field': {'repeat': 'column'}, 'type': 'quantitative'},
      'y': {
        'field': {'repeat': 'row'},
        'type': 'quantitative',
        'axis': {'minExtent': 30}
      },
      'color': {
        'condition': {
          'selection': 'brush',
          'field': 'Origin',
          'type': 'nominal'
        },
        'value': 'grey'
      }
    }
  }
};

export const candlestickSpec: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'width': 320,
  'description': 'A candlestick chart inspired by an example in Protovis (http://mbostock.github.io/protovis/ex/candlestick.html)',
  'data': {
    'format': {
      'parse': {
        'date': 'date:\'%Y-%m-%d\''
      }
    },
    'values': [
      {
        'date': '2009-06-01',
        'open': 28.7,
        'high': 30.05,
        'low': 28.45,
        'close': 30.04,
        'signal': 'short',
        'ret': -4.89396411092985
      },
      {
        'date': '2009-06-02',
        'open': 30.04,
        'high': 30.13,
        'low': 28.3,
        'close': 29.63,
        'signal': 'short',
        'ret': -0.322580645161295
      },
      {
        'date': '2009-06-03',
        'open': 29.62,
        'high': 31.79,
        'low': 29.62,
        'close': 31.02,
        'signal': 'short',
        'ret': 3.68663594470045
      },
      {
        'date': '2009-06-04',
        'open': 31.02,
        'high': 31.02,
        'low': 29.92,
        'close': 30.18,
        'signal': 'short',
        'ret': 4.51010886469673
      },
      {
        'date': '2009-06-05',
        'open': 29.39,
        'high': 30.81,
        'low': 28.85,
        'close': 29.62,
        'signal': 'short',
        'ret': 6.08424336973478
      },
      {
        'date': '2009-06-08',
        'open': 30.84,
        'high': 31.82,
        'low': 26.41,
        'close': 29.77,
        'signal': 'short',
        'ret': 1.2539184952978
      },
      {
        'date': '2009-06-09',
        'open': 29.77,
        'high': 29.77,
        'low': 27.79,
        'close': 28.27,
        'signal': 'short',
        'ret': -5.02431118314424
      },
      {
        'date': '2009-06-10',
        'open': 26.9,
        'high': 29.74,
        'low': 26.9,
        'close': 28.46,
        'signal': 'short',
        'ret': -5.46623794212217
      },
      {
        'date': '2009-06-11',
        'open': 27.36,
        'high': 28.11,
        'low': 26.81,
        'close': 28.11,
        'signal': 'short',
        'ret': -8.3743842364532
      },
      {
        'date': '2009-06-12',
        'open': 28.08,
        'high': 28.5,
        'low': 27.73,
        'close': 28.15,
        'signal': 'short',
        'ret': -5.52763819095477
      },
      {
        'date': '2009-06-15',
        'open': 29.7,
        'high': 31.09,
        'low': 29.64,
        'close': 30.81,
        'signal': 'long',
        'ret': 3.4920634920635
      },
      {
        'date': '2009-06-16',
        'open': 30.81,
        'high': 32.75,
        'low': 30.07,
        'close': 32.68,
        'signal': 'short',
        'ret': 0.155038759689914
      },
      {
        'date': '2009-06-17',
        'open': 31.19,
        'high': 32.77,
        'low': 30.64,
        'close': 31.54,
        'signal': 'short',
        'ret': 5.82822085889571
      },
      {
        'date': '2009-06-18',
        'open': 31.54,
        'high': 31.54,
        'low': 29.6,
        'close': 30.03,
        'signal': 'short',
        'ret': 8.17610062893082
      },
      {
        'date': '2009-06-19',
        'open': 29.16,
        'high': 29.32,
        'low': 27.56,
        'close': 27.99,
        'signal': 'short',
        'ret': 8.59872611464968
      },
      {
        'date': '2009-06-22',
        'open': 30.4,
        'high': 32.05,
        'low': 30.3,
        'close': 31.17,
        'signal': 'short',
        'ret': 15.4907975460123
      },
      {
        'date': '2009-06-23',
        'open': 31.3,
        'high': 31.54,
        'low': 27.83,
        'close': 30.58,
        'signal': 'short',
        'ret': 11.7370892018779
      },
      {
        'date': '2009-06-24',
        'open': 30.58,
        'high': 30.58,
        'low': 28.79,
        'close': 29.05,
        'signal': 'long',
        'ret': -10.4234527687296
      },
      {
        'date': '2009-06-25',
        'open': 29.45,
        'high': 29.56,
        'low': 26.3,
        'close': 26.36,
        'signal': 'long',
        'ret': 0
      },
      {
        'date': '2009-06-26',
        'open': 27.09,
        'high': 27.22,
        'low': 25.76,
        'close': 25.93,
        'signal': 'long',
        'ret': 0
      },
      {
        'date': '2009-06-29',
        'open': 25.93,
        'high': 27.18,
        'low': 25.29,
        'close': 25.35,
        'signal': 'long',
        'ret': 5.26315789473684
      },
      {
        'date': '2009-06-30',
        'open': 25.36,
        'high': 27.38,
        'low': 25.02,
        'close': 26.35,
        'signal': 'long',
        'ret': 6.73758865248228
      }
    ]
  },
  'encoding': {
    'x': {'field': 'date', 'type': 'temporal', 'title': 'Date in 2009'},
    'color': {
      'condition': {
        'test': 'datum.open < datum.close',
        'value': '#06982d'
      },
      'value': '#ae1325'
    }
  },
  'layer': [
    {
      'mark': 'rule',
      'encoding': {
        'y': {
          'field': 'low', 'type': 'quantitative',
          'scale': {'zero': false}
        },
        'y2': {'field': 'high'}
      }
    },
    {
      'mark': 'bar',
      'encoding': {
        'y': {'field': 'open', 'type': 'quantitative'},
        'y2': {'field': 'close'},
        'size': {'value': 5}
      }
    }
  ]
};

export const concatenateSpec: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'data': {'url': 'https://vega.github.io/editor/data/movies.json'},
  'spacing': 15,
  'bounds': 'flush',
  'vconcat': [{
    'mark': 'bar',
    'height': 60,
    'encoding': {
      'x': {
        'bin': true,
        'field': 'IMDB_Rating',
        'type': 'quantitative',
        'axis': null
      },
      'y': {
        'aggregate': 'count',
        'type': 'quantitative',
        'scale': {
          'domain': [0,1000]
        },
        'title': ''
      }
    }
  }, {
    'spacing': 15,
    'bounds': 'flush',
    'hconcat': [{
      'mark': 'rect',
      'encoding': {
        'x': {
          'bin': true,
          'field': 'IMDB_Rating',
          'type': 'quantitative'
        },
        'y': {
          'bin': true,
          'field': 'Rotten_Tomatoes_Rating',
          'type': 'quantitative'
        },
        'color': {
          'aggregate': 'count',
          'type': 'quantitative'
        }
      }
    }, {
      'mark': 'bar',
      'width': 60,
      'encoding': {
        'y': {
          'bin': true,
          'field': 'Rotten_Tomatoes_Rating',
          'type': 'quantitative',
          'axis': null
        },
        'x': {
          'aggregate': 'count',
          'type': 'quantitative',
          'scale': {
            'domain': [0,1000]
          },
          'title': ''
        }
      }
    }]
  }],
  'config': {
    'view': {
      'stroke': 'transparent'
    }
  }
};

export const stackedBarchartPreset = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'data': {'url': 'https://vega.github.io/editor/data/seattle-weather.csv'},
  'mark': 'bar',
  'encoding': {
    'x': {
      'timeUnit': 'month',
      'field': 'date',
      'type': 'ordinal',
      'axis': {'title': 'Month of the year'}
    },
    'y': {
      'aggregate': 'count',
      'type': 'quantitative'
    },
    'color': {
      'field': 'weather',
      'type': 'nominal',
      'scale': {
        'domain': ['sun','fog','drizzle','rain','snow'],
        'range': ['#e7ba52','#c7c7c7','#aec7e8','#1f77b4','#9467bd']
      },
      'legend': {'title': 'Weather type'}
    }
  }
};

export const parallelCoordinatesPreset: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'description': 'Though Vega-Lite supports only one scale per axes, one can create a parallel coordinate plot by folding variables, using `joinaggregate` to normalize their values and using ticks and rules to manually create axes.',
  'data': {
    'url': 'https://vega.github.io/editor/data/iris.json'
  },
  'width': 600,
  'height': 300,
  'transform': [
    {'window': [{'op': 'count', 'as': 'index'}]},
    {'fold': ['petalLength', 'petalWidth', 'sepalLength', 'sepalWidth']},
    {
      'joinaggregate': [
        {'op': 'min', 'field': 'value', 'as': 'min'},
        {'op': 'max', 'field': 'value', 'as': 'max'}
      ],
      'groupby': ['key']
    },
    {
      'calculate': '(datum.value - datum.min) / (datum.max-datum.min)',
      'as': 'norm_val'
    },
    {
      'calculate': '(datum.min + datum.max) / 2',
      'as': 'mid'
    }
  ],
  'layer': [{
    'mark': {'type': 'rule', 'color': '#ccc', 'tooltip': null},
    'encoding': {
      'detail': {'aggregate': 'count', 'type': 'quantitative'},
      'x': {'type': 'nominal', 'field': 'key'}
    }
  }, {
    'mark': 'line',
    'encoding': {
      'color': {'type': 'nominal', 'field': 'species'},
      'detail': {'type': 'nominal', 'field': 'index'},
      'opacity': {'value': 0.3},
      'x': {'type': 'nominal', 'field': 'key'},
      'y': {'type': 'quantitative', 'field': 'norm_val', 'axis': null},
      'tooltip': [{
        'field': 'petalLength'
      }, {
        'field': 'petalWidth'
      }, {
        'field': 'sepalLength'
      }, {
        'field': 'sepalWidth'
      }]
    }
  },{
    'encoding': {
      'x': {'type': 'nominal', 'field': 'key'},
      'y': {'value': 0}
    },
    'layer': [{
      'mark': {'type': 'text', 'style': 'label'},
      'encoding': {
        'text': {'aggregate': 'max', 'field': 'max', 'type': 'quantitative'}
      }
    }, {
      'mark': {'type': 'tick', 'style': 'tick', 'size': 8, 'color': '#ccc'}
    }]
  },{

    'encoding': {
      'x': {'type': 'nominal', 'field': 'key'},
      'y': {'value': 150}
    },
    'layer': [{
      'mark': {'type': 'text', 'style': 'label'},
      'encoding': {
        'text': {'aggregate': 'min', 'field': 'mid', 'type': 'quantitative'}
      }
    }, {
      'mark': {'type': 'tick', 'style': 'tick', 'size': 8, 'color': '#ccc'}
    }]
  },{
    'encoding': {
      'x': {'type': 'nominal', 'field': 'key'},
      'y': {'value': 300}
    },
    'layer': [{
      'mark': {'type': 'text', 'style': 'label'},
      'encoding': {
        'text': {'aggregate': 'min', 'field': 'min', 'type': 'quantitative'}
      }
    }, {
      'mark': {'type': 'tick', 'style': 'tick', 'size': 8, 'color': '#ccc'}
    }]
  }],
  'config': {
    'axisX': {'domain': false, 'labelAngle': 0, 'tickColor': '#ccc', 'title': false},
    'view': {'stroke': null},
    'style': {
      'label': {'baseline': 'middle', 'align': 'right', 'dx': -5, 'tooltip': null},
      'tick': {'orient': 'horizontal', 'tooltip': null}
    }
  }
};

export const repeatOverlayPreset = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'description': 'Summarized and per year weather information for Seatle and New York.',
  'data': {'url': 'https://vega.github.io/editor/data/weather.csv'},
  'repeat': {'column': ['temp_max','precipitation','wind']},
  'spec': {
    'layer': [
      {
        'mark': 'line',
        'encoding': {
          'y': {
            'aggregate': 'mean',
            'field': {'repeat': 'column'},
            'type': 'quantitative'
          },
          'x': {
            'timeUnit': 'month',
            'field': 'date',
            'type': 'ordinal'
          },
          'detail': {
            'timeUnit': 'year',
            'type': 'temporal',
            'field': 'date'
          },
          'color': {'type': 'nominal','field': 'location'},
          'opacity': {'value': 0.2}
        }
      },
      {
        'mark': 'line',
        'encoding': {
          'y': {
            'aggregate': 'mean',
            'field': {'repeat': 'column'},
            'type': 'quantitative'
          },
          'x': {
            'timeUnit': 'month',
            'field': 'date',
            'type': 'ordinal'
          },
          'color': {'type': 'nominal','field': 'location'}
        }
      }
    ]
  }
};

export const mosaicPreset: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'data': {
    'url': 'https://vega.github.io/editor/data/cars.json'
  },
  'transform': [
    {
      'aggregate': [
        {
          'op': 'count',
          'as': 'count_*'
        }
      ],
      'groupby': [
        'Origin',
        'Cylinders'
      ]
    },
    {
      'stack': 'count_*',
      'groupby': [],
      'as': [
        'stack_count_Origin1',
        'stack_count_Origin2'
      ],
      'offset': 'normalize',
      'sort': [
        {
          'field': 'Origin',
          'order': 'ascending'
        }
      ]
    },
    {
      'window': [
        {
          'op': 'min',
          'field': 'stack_count_Origin1',
          'as': 'x'
        },
        {
          'op': 'max',
          'field': 'stack_count_Origin2',
          'as': 'x2'
        },
        {
          'op': 'dense_rank',
          'as': 'rank_Cylinders'
        },
        {
          'op': 'distinct',
          'field': 'Cylinders',
          'as': 'distinct_Cylinders'
        }
      ],
      'groupby': [
        'Origin'
      ],
      'frame': [
        null,
        null
      ],
      'sort': [
        {
          'field': 'Cylinders',
          'order': 'ascending'
        }
      ]
    },
    {
      'window': [
        {
          'op': 'dense_rank',
          'as': 'rank_Origin'
        }
      ],
      'frame': [
        null,
        null
      ],
      'sort': [
        {
          'field': 'Origin',
          'order': 'ascending'
        }
      ]
    },
    {
      'stack': 'count_*',
      'groupby': [
        'Origin'
      ],
      'as': [
        'y',
        'y2'
      ],
      'offset': 'normalize',
      'sort': [
        {
          'field': 'Cylinders',
          'order': 'ascending'
        }
      ]
    },
    {
      'calculate': 'datum.y + (datum.rank_Cylinders - 1) * datum.distinct_Cylinders * 0.01 / 3',
      'as': 'ny'
    },
    {
      'calculate': 'datum.y2 + (datum.rank_Cylinders - 1) * datum.distinct_Cylinders * 0.01 / 3',
      'as': 'ny2'
    },
    {
      'calculate': 'datum.x + (datum.rank_Origin - 1) * 0.01',
      'as': 'nx'
    },
    {
      'calculate': 'datum.x2 + (datum.rank_Origin - 1) * 0.01',
      'as': 'nx2'
    },
    {
      'calculate': '(datum.nx+datum.nx2)/2',
      'as': 'xc'
    },
    {
      'calculate': '(datum.ny+datum.ny2)/2',
      'as': 'yc'
    }
  ],
  'vconcat': [
    {
      'mark': {
        'type': 'text',
        'baseline': 'middle',
        'align': 'center'
      },
      'encoding': {
        'x': {
          'aggregate': 'min',
          'field': 'xc',
          'type': 'quantitative',
          'title': 'Origin',
          'axis': {
            'orient': 'top'
          }
        },
        'color': {
          'field': 'Origin',
          'type': 'nominal',
          'legend': null
        },
        'text': {
          'field': 'Origin',
          'type': 'nominal'
        }
      }
    },
    {
      'layer': [
        {
          'mark': {
            'type': 'rect'
          },
          'encoding': {
            'x': {
              'field': 'nx',
              'type': 'quantitative',
              'axis': null
            },
            'x2': {
              'field': 'nx2',
              'type': 'quantitative'
            },
            'y': {
              'field': 'ny',
              'type': 'quantitative',
              'axis': null
            },
            'y2': {
              'field': 'ny2',
              'type': 'quantitative'
            },
            'color': {
              'field': 'Origin',
              'type': 'nominal',
              'legend': null
            },
            'opacity': {
              'field': 'Cylinders',
              'type': 'quantitative',
              'legend': null
            },
            'tooltip': [
              {
                'field': 'Origin',
                'type': 'nominal'
              },
              {
                'field': 'Cylinders',
                'type': 'quantitative'
              }
            ]
          }
        },
        {
          'mark': {
            'type': 'text',
            'baseline': 'middle'
          },
          'encoding': {
            'x': {
              'field': 'xc',
              'type': 'quantitative',
              'axis': null
            },
            'y': {
              'field': 'yc',
              'type': 'quantitative',
              'axis': {
                'title': 'Cylinders'
              }
            },
            'text': {
              'field': 'Cylinders',
              'type': 'nominal'
            }
          }
        }
      ]
    }
  ],
  'resolve': {
    'scale': {
      'x': 'shared'
    }
  },
  'config': {
    'view': {
      'stroke': ''
    },
    'concat': {'spacing': 10},
    'axis': {
      'domain': false,
      'ticks': false,
      'labels': false,
      'grid': false
    }
  }
}

export const streamGraphPreset: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'width': 300, 'height': 200,
  'data': {'url': 'https://vega.github.io/editor/data/unemployment-across-industries.json'},
  'mark': 'area',
  'encoding': {
    'x': {
      'timeUnit': 'yearmonth', 'field': 'date', 'type': 'temporal',
      'axis': {'domain': false, 'format': '%Y', 'tickSize': 0}
    },
    'y': {
      'aggregate': 'sum', 'field': 'count','type': 'quantitative',
      'axis': null,
      'stack': 'center'
    },
    'color': {'field':'series', 'type':'nominal', 'scale':{'scheme': 'category20b'}}
  }
};

export const stackedAreaPreset: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'description': 'Area chart showing weight of cars over time.',
  'width': 300, 'height': 200,
  'data': {'url': 'https://vega.github.io/editor/data/unemployment-across-industries.json'},
  'mark': 'area',
  'encoding': {
    'x': {
      'timeUnit': 'yearmonth', 'field': 'date', 'type': 'temporal',
      'axis': {'format': '%Y'}
    },
    'y': {
      'aggregate': 'sum', 'field': 'count', 'type': 'quantitative'
    },
    'color': {
      'field': 'series',
      'type': 'nominal',
      'scale': {'scheme': 'category20b'}
    }
  }
};

export const carbonDioxide: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'data': {
    'url': 'https://vega.github.io/editor/data/co2-concentration.csv',
    'format': {'parse': {'Date': 'utc:\'%Y-%m-%d\''}}
  },
  'width': 800,
  'height': 500,
  'transform': [
    {'calculate': 'year(datum.Date)', 'as': 'year'},
    {'calculate': 'floor(datum.year / 10)', 'as': 'decade'},
    {
      'calculate': '(datum.year % 10) + (month(datum.Date)/12)',
      'as': 'scaled_date'
    },
    {
      'window': [
        {'op': 'first_value', 'field': 'scaled_date', 'as': 'first_date'},
        {'op': 'last_value', 'field': 'scaled_date', 'as': 'last_date'}
      ],
      'sort': [
        {'field': 'scaled_date', 'order': 'ascending'}
      ],
      'groupby': ['decade'],
      'frame': [null, null]
    },
    {
      'calculate': 'datum.first_date === datum.scaled_date ? \'first\' : datum.last_date === datum.scaled_date ? \'last\' : null',
      'as': 'end'
    }
  ],
  'encoding': {
    'x': {
      'field': 'scaled_date',
      'type': 'quantitative',
      'axis': {'title': 'Year into Decade', 'tickCount': 11}
    },
    'y': {
      'field': 'CO2',
      'title': 'CO2 concentration in ppm',
      'type': 'quantitative',
      'scale': {'zero': false}
    }
  },
  'layer': [
    {
      'mark': 'line',
      'encoding': {
        'color': {
          'field': 'decade',
          'type': 'ordinal',
          'scale': {'scheme': 'magma'},
          'legend': null
        }
      }
    },
    {
      'transform': [{'filter': {'field': 'end', 'equal': 'first'}}],
      'mark': {'type': 'text', 'baseline': 'top'},
      'encoding': {'text': {'field': 'year', 'type': 'nominal'}}
    },
    {
      'transform': [{'filter': {'field': 'end', 'equal': 'last'}}],
      'mark': {'type': 'text', 'baseline': 'bottom'},
      'encoding': {'text': {'field': 'year', 'type': 'nominal'}}
    }
  ],
  'config': {'text': {'align': 'left', 'dx': 3, 'dy': 1}}
};

export const londonTube: any = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'width': 700,
  'height': 500,
  'config': {
    'view': {
      'stroke': 'transparent'
    }
  },
  'layer': [
    {
      'data': {
        'url': 'https://vega.github.io/editor/data/londonBoroughs.json',
        'format': {
          'type': 'topojson',
          'feature': 'boroughs'
        }
      },
      'mark': {
        'type': 'geoshape',
        'stroke': 'white',
        'strokeWidth': 2
      },
      'encoding': {
        'color': {
          'value': '#eee'
        }
      }
    },
    {
      'data': {
        'url': 'https://vega.github.io/editor/data/londonCentroids.json',
        'format': {
          'type': 'json'
        }
      },
      'transform': [
        {
          'calculate': 'indexof (datum.name,\' \') > 0  ? substring(datum.name,0,indexof(datum.name, \' \')) : datum.name',
          'as': 'bLabel'
        }
      ],
      'mark': 'text',
      'encoding': {
        'longitude': {
          'field': 'cx',
          'type': 'quantitative'
        },
        'latitude': {
          'field': 'cy',
          'type': 'quantitative'
        },
        'text': {
          'field': 'bLabel',
          'type': 'nominal'
        },
        'size': {
          'value': 8
        },
        'opacity': {
          'value': 0.6
        }
      }
    },
    {
      'data': {
        'url': 'https://vega.github.io/editor/data/londonTubeLines.json',
        'format': {
          'type': 'topojson',
          'feature': 'line'
        }
      },
      'mark': {
        'type': 'geoshape',
        'filled': false,
        'strokeWidth': 2
      },
      'encoding': {
        'color': {
          'field': 'id',
          'type': 'nominal',
          'legend': {
            'title': null,
            'orient': 'bottom-right',
            'offset': 0
          },
          'scale': {
            'domain': [
              'Bakerloo',
              'Central',
              'Circle',
              'District',
              'DLR',
              'Hammersmith & City',
              'Jubilee',
              'Metropolitan',
              'Northern',
              'Piccadilly',
              'Victoria',
              'Waterloo & City'
            ],
            'range': [
              'rgb(137,78,36)',
              'rgb(220,36,30)',
              'rgb(255,206,0)',
              'rgb(1,114,41)',
              'rgb(0,175,173)',
              'rgb(215,153,175)',
              'rgb(106,114,120)',
              'rgb(114,17,84)',
              'rgb(0,0,0)',
              'rgb(0,24,168)',
              'rgb(0,160,226)',
              'rgb(106,187,170)'
            ]
          }
        }
      }
    }
  ]
};

export const trellisBarleyPreset = {
  'name': 'trellis_barley',
  'data': {'url': 'https://vega.github.io/editor/data/barley.json'},
  'mark': 'point',
  'columns': 2,
  'encoding': {
    'facet': {
      'field': 'site',
      'type': 'ordinal',
      'sort': {'op': 'median', 'field': 'yield'}
    },
    'x': {
      'aggregate': 'median',
      'field': 'yield',
      'type': 'quantitative',
      'scale': {'zero': false}
    },
    'y': {
      'field': 'variety',
      'type': 'ordinal',
      'sort': {'encoding': 'x', 'order': 'descending'},
      'scale': {'rangeStep': 12}
    },
    'color': {'field': 'year', 'type': 'nominal'}
  }
};

export const facettedBarchartsPreset = {
  'data': {'url': 'https://vega.github.io/editor/data/cars.json'},
  'facet': {'row': {'field': 'Origin', 'type': 'nominal'}},
  'spec': {
    'mark': 'bar',
    'encoding': {
      'x': {
        'bin': {'maxbins': 15},
        'field': 'Horsepower',
        'type': 'quantitative'
      },
      'y': {'aggregate': 'count', 'type': 'quantitative'}
    }
  }
};

export const bubbleChartAltairPreset = {
  'config': {'view': {'width': 400, 'height': 300}},
  'data': {'name': 'data-f02450ab61490a1363517a0190416235'},
  'mark': 'point',
  'encoding': {
    'size': {'type': 'quantitative', 'field': 'Acceleration'},
    'x': {'type': 'quantitative', 'field': 'Horsepower'},
    'y': {'type': 'quantitative', 'field': 'Miles_per_Gallon'}
  },
  '$schema': 'https://vega.github.io/schema/vega-lite/v2.6.0.json',
  'datasets': {
    'data-f02450ab61490a1363517a0190416235': [
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 307,
        'Horsepower': 130,
        'Miles_per_Gallon': 18,
        'Name': 'chevrolet chevelle malibu',
        'Origin': 'USA',
        'Weight_in_lbs': 3504,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 165,
        'Miles_per_Gallon': 15,
        'Name': 'buick skylark 320',
        'Origin': 'USA',
        'Weight_in_lbs': 3693,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 18,
        'Name': 'plymouth satellite',
        'Origin': 'USA',
        'Weight_in_lbs': 3436,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 150,
        'Miles_per_Gallon': 16,
        'Name': 'amc rebel sst',
        'Origin': 'USA',
        'Weight_in_lbs': 3433,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10.5,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 140,
        'Miles_per_Gallon': 17,
        'Name': 'ford torino',
        'Origin': 'USA',
        'Weight_in_lbs': 3449,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10,
        'Cylinders': 8,
        'Displacement': 429,
        'Horsepower': 198,
        'Miles_per_Gallon': 15,
        'Name': 'ford galaxie 500',
        'Origin': 'USA',
        'Weight_in_lbs': 4341,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 9,
        'Cylinders': 8,
        'Displacement': 454,
        'Horsepower': 220,
        'Miles_per_Gallon': 14,
        'Name': 'chevrolet impala',
        'Origin': 'USA',
        'Weight_in_lbs': 4354,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 8.5,
        'Cylinders': 8,
        'Displacement': 440,
        'Horsepower': 215,
        'Miles_per_Gallon': 14,
        'Name': 'plymouth fury iii',
        'Origin': 'USA',
        'Weight_in_lbs': 4312,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10,
        'Cylinders': 8,
        'Displacement': 455,
        'Horsepower': 225,
        'Miles_per_Gallon': 14,
        'Name': 'pontiac catalina',
        'Origin': 'USA',
        'Weight_in_lbs': 4425,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 8.5,
        'Cylinders': 8,
        'Displacement': 390,
        'Horsepower': 190,
        'Miles_per_Gallon': 15,
        'Name': 'amc ambassador dpl',
        'Origin': 'USA',
        'Weight_in_lbs': 3850,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 17.5,
        'Cylinders': 4,
        'Displacement': 133,
        'Horsepower': 115,
        'Miles_per_Gallon': null,
        'Name': 'citroen ds-21 pallas',
        'Origin': 'Europe',
        'Weight_in_lbs': 3090,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 165,
        'Miles_per_Gallon': null,
        'Name': 'chevrolet chevelle concours (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4142,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 153,
        'Miles_per_Gallon': null,
        'Name': 'ford torino (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4034,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10.5,
        'Cylinders': 8,
        'Displacement': 383,
        'Horsepower': 175,
        'Miles_per_Gallon': null,
        'Name': 'plymouth satellite (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4166,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 360,
        'Horsepower': 175,
        'Miles_per_Gallon': null,
        'Name': 'amc rebel sst (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 3850,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10,
        'Cylinders': 8,
        'Displacement': 383,
        'Horsepower': 170,
        'Miles_per_Gallon': 15,
        'Name': 'dodge challenger se',
        'Origin': 'USA',
        'Weight_in_lbs': 3563,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 8,
        'Cylinders': 8,
        'Displacement': 340,
        'Horsepower': 160,
        'Miles_per_Gallon': 14,
        'Name': 'plymouth \'cuda 340',
        'Origin': 'USA',
        'Weight_in_lbs': 3609,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 8,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 140,
        'Miles_per_Gallon': null,
        'Name': 'ford mustang boss 302',
        'Origin': 'USA',
        'Weight_in_lbs': 3353,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 9.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 150,
        'Miles_per_Gallon': 15,
        'Name': 'chevrolet monte carlo',
        'Origin': 'USA',
        'Weight_in_lbs': 3761,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 10,
        'Cylinders': 8,
        'Displacement': 455,
        'Horsepower': 225,
        'Miles_per_Gallon': 14,
        'Name': 'buick estate wagon (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 3086,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 113,
        'Horsepower': 95,
        'Miles_per_Gallon': 24,
        'Name': 'toyota corona mark ii',
        'Origin': 'Japan',
        'Weight_in_lbs': 2372,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 198,
        'Horsepower': 95,
        'Miles_per_Gallon': 22,
        'Name': 'plymouth duster',
        'Origin': 'USA',
        'Weight_in_lbs': 2833,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 199,
        'Horsepower': 97,
        'Miles_per_Gallon': 18,
        'Name': 'amc hornet',
        'Origin': 'USA',
        'Weight_in_lbs': 2774,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 85,
        'Miles_per_Gallon': 21,
        'Name': 'ford maverick',
        'Origin': 'USA',
        'Weight_in_lbs': 2587,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 88,
        'Miles_per_Gallon': 27,
        'Name': 'datsun pl510',
        'Origin': 'Japan',
        'Weight_in_lbs': 2130,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 20.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 46,
        'Miles_per_Gallon': 26,
        'Name': 'volkswagen 1131 deluxe sedan',
        'Origin': 'Europe',
        'Weight_in_lbs': 1835,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 17.5,
        'Cylinders': 4,
        'Displacement': 110,
        'Horsepower': 87,
        'Miles_per_Gallon': 25,
        'Name': 'peugeot 504',
        'Origin': 'Europe',
        'Weight_in_lbs': 2672,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 107,
        'Horsepower': 90,
        'Miles_per_Gallon': 24,
        'Name': 'audi 100 ls',
        'Origin': 'Europe',
        'Weight_in_lbs': 2430,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 17.5,
        'Cylinders': 4,
        'Displacement': 104,
        'Horsepower': 95,
        'Miles_per_Gallon': 25,
        'Name': 'saab 99e',
        'Origin': 'Europe',
        'Weight_in_lbs': 2375,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 113,
        'Miles_per_Gallon': 26,
        'Name': 'bmw 2002',
        'Origin': 'Europe',
        'Weight_in_lbs': 2234,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 6,
        'Displacement': 199,
        'Horsepower': 90,
        'Miles_per_Gallon': 21,
        'Name': 'amc gremlin',
        'Origin': 'USA',
        'Weight_in_lbs': 2648,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 360,
        'Horsepower': 215,
        'Miles_per_Gallon': 10,
        'Name': 'ford f250',
        'Origin': 'USA',
        'Weight_in_lbs': 4615,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 8,
        'Displacement': 307,
        'Horsepower': 200,
        'Miles_per_Gallon': 10,
        'Name': 'chevy c20',
        'Origin': 'USA',
        'Weight_in_lbs': 4376,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 210,
        'Miles_per_Gallon': 11,
        'Name': 'dodge d200',
        'Origin': 'USA',
        'Weight_in_lbs': 4382,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 18.5,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 193,
        'Miles_per_Gallon': 9,
        'Name': 'hi 1200d',
        'Origin': 'USA',
        'Weight_in_lbs': 4732,
        'Year': '1970-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 88,
        'Miles_per_Gallon': 27,
        'Name': 'datsun pl510',
        'Origin': 'Japan',
        'Weight_in_lbs': 2130,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 90,
        'Miles_per_Gallon': 28,
        'Name': 'chevrolet vega 2300',
        'Origin': 'USA',
        'Weight_in_lbs': 2264,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 113,
        'Horsepower': 95,
        'Miles_per_Gallon': 25,
        'Name': 'toyota corona',
        'Origin': 'Japan',
        'Weight_in_lbs': 2228,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': null,
        'Miles_per_Gallon': 25,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2046,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 20,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 48,
        'Miles_per_Gallon': null,
        'Name': 'volkswagen super beetle 117',
        'Origin': 'Europe',
        'Weight_in_lbs': 1978,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 19,
        'Name': 'amc gremlin',
        'Origin': 'USA',
        'Weight_in_lbs': 2634,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 105,
        'Miles_per_Gallon': 16,
        'Name': 'plymouth satellite custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3439,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 100,
        'Miles_per_Gallon': 17,
        'Name': 'chevrolet chevelle malibu',
        'Origin': 'USA',
        'Weight_in_lbs': 3329,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 88,
        'Miles_per_Gallon': 19,
        'Name': 'ford torino 500',
        'Origin': 'USA',
        'Weight_in_lbs': 3302,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 18,
        'Name': 'amc matador',
        'Origin': 'USA',
        'Weight_in_lbs': 3288,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 165,
        'Miles_per_Gallon': 14,
        'Name': 'chevrolet impala',
        'Origin': 'USA',
        'Weight_in_lbs': 4209,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 175,
        'Miles_per_Gallon': 14,
        'Name': 'pontiac catalina brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4464,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 153,
        'Miles_per_Gallon': 14,
        'Name': 'ford galaxie 500',
        'Origin': 'USA',
        'Weight_in_lbs': 4154,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'plymouth fury iii',
        'Origin': 'USA',
        'Weight_in_lbs': 4096,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 383,
        'Horsepower': 180,
        'Miles_per_Gallon': 12,
        'Name': 'dodge monaco (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4955,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 170,
        'Miles_per_Gallon': 13,
        'Name': 'ford country squire (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4746,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 175,
        'Miles_per_Gallon': 13,
        'Name': 'pontiac safari (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 5140,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 6,
        'Displacement': 258,
        'Horsepower': 110,
        'Miles_per_Gallon': 18,
        'Name': 'amc hornet sportabout (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 2962,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 72,
        'Miles_per_Gallon': 22,
        'Name': 'chevrolet vega (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 2408,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 100,
        'Miles_per_Gallon': 19,
        'Name': 'pontiac firebird',
        'Origin': 'USA',
        'Weight_in_lbs': 3282,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 88,
        'Miles_per_Gallon': 18,
        'Name': 'ford mustang',
        'Origin': 'USA',
        'Weight_in_lbs': 3139,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 86,
        'Miles_per_Gallon': 23,
        'Name': 'mercury capri 2000',
        'Origin': 'USA',
        'Weight_in_lbs': 2220,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 116,
        'Horsepower': 90,
        'Miles_per_Gallon': 28,
        'Name': 'opel 1900',
        'Origin': 'Europe',
        'Weight_in_lbs': 2123,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 70,
        'Miles_per_Gallon': 30,
        'Name': 'peugeot 304',
        'Origin': 'Europe',
        'Weight_in_lbs': 2074,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 88,
        'Horsepower': 76,
        'Miles_per_Gallon': 30,
        'Name': 'fiat 124b',
        'Origin': 'Europe',
        'Weight_in_lbs': 2065,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 71,
        'Horsepower': 65,
        'Miles_per_Gallon': 31,
        'Name': 'toyota corolla 1200',
        'Origin': 'Japan',
        'Weight_in_lbs': 1773,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 72,
        'Horsepower': 69,
        'Miles_per_Gallon': 35,
        'Name': 'datsun 1200',
        'Origin': 'Japan',
        'Weight_in_lbs': 1613,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 60,
        'Miles_per_Gallon': 27,
        'Name': 'volkswagen model 111',
        'Origin': 'Europe',
        'Weight_in_lbs': 1834,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 20.5,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 70,
        'Miles_per_Gallon': 26,
        'Name': 'plymouth cricket',
        'Origin': 'USA',
        'Weight_in_lbs': 1955,
        'Year': '1971-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 113,
        'Horsepower': 95,
        'Miles_per_Gallon': 24,
        'Name': 'toyota corona hardtop',
        'Origin': 'Japan',
        'Weight_in_lbs': 2278,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 97.5,
        'Horsepower': 80,
        'Miles_per_Gallon': 25,
        'Name': 'dodge colt hardtop',
        'Origin': 'USA',
        'Weight_in_lbs': 2126,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 23.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 54,
        'Miles_per_Gallon': 23,
        'Name': 'volkswagen type 3',
        'Origin': 'Europe',
        'Weight_in_lbs': 2254,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 90,
        'Miles_per_Gallon': 20,
        'Name': 'chevrolet vega',
        'Origin': 'USA',
        'Weight_in_lbs': 2408,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 86,
        'Miles_per_Gallon': 21,
        'Name': 'ford pinto runabout',
        'Origin': 'USA',
        'Weight_in_lbs': 2226,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 165,
        'Miles_per_Gallon': 13,
        'Name': 'chevrolet impala',
        'Origin': 'USA',
        'Weight_in_lbs': 4274,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 175,
        'Miles_per_Gallon': 14,
        'Name': 'pontiac catalina',
        'Origin': 'USA',
        'Weight_in_lbs': 4385,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 15,
        'Name': 'plymouth fury iii',
        'Origin': 'USA',
        'Weight_in_lbs': 4135,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 153,
        'Miles_per_Gallon': 14,
        'Name': 'ford galaxie 500',
        'Origin': 'USA',
        'Weight_in_lbs': 4129,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 150,
        'Miles_per_Gallon': 17,
        'Name': 'amc ambassador sst',
        'Origin': 'USA',
        'Weight_in_lbs': 3672,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 429,
        'Horsepower': 208,
        'Miles_per_Gallon': 11,
        'Name': 'mercury marquis',
        'Origin': 'USA',
        'Weight_in_lbs': 4633,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 155,
        'Miles_per_Gallon': 13,
        'Name': 'buick lesabre custom',
        'Origin': 'USA',
        'Weight_in_lbs': 4502,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 160,
        'Miles_per_Gallon': 12,
        'Name': 'oldsmobile delta 88 royale',
        'Origin': 'USA',
        'Weight_in_lbs': 4456,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 190,
        'Miles_per_Gallon': 13,
        'Name': 'chrysler newport royal',
        'Origin': 'USA',
        'Weight_in_lbs': 4422,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 3,
        'Displacement': 70,
        'Horsepower': 97,
        'Miles_per_Gallon': 19,
        'Name': 'mazda rx2 coupe',
        'Origin': 'Japan',
        'Weight_in_lbs': 2330,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 150,
        'Miles_per_Gallon': 15,
        'Name': 'amc matador (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 3892,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 307,
        'Horsepower': 130,
        'Miles_per_Gallon': 13,
        'Name': 'chevrolet chevelle concours (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4098,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 140,
        'Miles_per_Gallon': 13,
        'Name': 'ford gran torino (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4294,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'plymouth satellite custom (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4077,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 112,
        'Miles_per_Gallon': 18,
        'Name': 'volvo 145e (sw)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2933,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 76,
        'Miles_per_Gallon': 22,
        'Name': 'volkswagen 411 (sw)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2511,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 87,
        'Miles_per_Gallon': 21,
        'Name': 'peugeot 504 (sw)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2979,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 96,
        'Horsepower': 69,
        'Miles_per_Gallon': 26,
        'Name': 'renault 12 (sw)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2189,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 86,
        'Miles_per_Gallon': 22,
        'Name': 'ford pinto (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 2395,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 92,
        'Miles_per_Gallon': 28,
        'Name': 'datsun 510 (sw)',
        'Origin': 'Japan',
        'Weight_in_lbs': 2288,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 97,
        'Miles_per_Gallon': 23,
        'Name': 'toyouta corona mark ii (sw)',
        'Origin': 'Japan',
        'Weight_in_lbs': 2506,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 80,
        'Miles_per_Gallon': 28,
        'Name': 'dodge colt (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 2164,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 88,
        'Miles_per_Gallon': 27,
        'Name': 'toyota corolla 1600 (sw)',
        'Origin': 'Japan',
        'Weight_in_lbs': 2100,
        'Year': '1972-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 175,
        'Miles_per_Gallon': 13,
        'Name': 'buick century 350',
        'Origin': 'USA',
        'Weight_in_lbs': 4100,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'amc matador',
        'Origin': 'USA',
        'Weight_in_lbs': 3672,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 145,
        'Miles_per_Gallon': 13,
        'Name': 'chevrolet malibu',
        'Origin': 'USA',
        'Weight_in_lbs': 3988,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 137,
        'Miles_per_Gallon': 14,
        'Name': 'ford gran torino',
        'Origin': 'USA',
        'Weight_in_lbs': 4042,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 15,
        'Name': 'dodge coronet custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3777,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 429,
        'Horsepower': 198,
        'Miles_per_Gallon': 12,
        'Name': 'mercury marquis brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4952,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 150,
        'Miles_per_Gallon': 13,
        'Name': 'chevrolet caprice classic',
        'Origin': 'USA',
        'Weight_in_lbs': 4464,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 158,
        'Miles_per_Gallon': 13,
        'Name': 'ford ltd',
        'Origin': 'USA',
        'Weight_in_lbs': 4363,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'plymouth fury gran sedan',
        'Origin': 'USA',
        'Weight_in_lbs': 4237,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 440,
        'Horsepower': 215,
        'Miles_per_Gallon': 13,
        'Name': 'chrysler new yorker brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4735,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 455,
        'Horsepower': 225,
        'Miles_per_Gallon': 12,
        'Name': 'buick electra 225 custom',
        'Origin': 'USA',
        'Weight_in_lbs': 4951,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 360,
        'Horsepower': 175,
        'Miles_per_Gallon': 13,
        'Name': 'amc ambassador brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 3821,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 105,
        'Miles_per_Gallon': 18,
        'Name': 'plymouth valiant',
        'Origin': 'USA',
        'Weight_in_lbs': 3121,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 100,
        'Miles_per_Gallon': 16,
        'Name': 'chevrolet nova custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3278,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 18,
        'Name': 'amc hornet',
        'Origin': 'USA',
        'Weight_in_lbs': 2945,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 88,
        'Miles_per_Gallon': 18,
        'Name': 'ford maverick',
        'Origin': 'USA',
        'Weight_in_lbs': 3021,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 198,
        'Horsepower': 95,
        'Miles_per_Gallon': 23,
        'Name': 'plymouth duster',
        'Origin': 'USA',
        'Weight_in_lbs': 2904,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 21,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 46,
        'Miles_per_Gallon': 26,
        'Name': 'volkswagen super beetle',
        'Origin': 'Europe',
        'Weight_in_lbs': 1950,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 150,
        'Miles_per_Gallon': 11,
        'Name': 'chevrolet impala',
        'Origin': 'USA',
        'Weight_in_lbs': 4997,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 167,
        'Miles_per_Gallon': 12,
        'Name': 'ford country',
        'Origin': 'USA',
        'Weight_in_lbs': 4906,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 360,
        'Horsepower': 170,
        'Miles_per_Gallon': 13,
        'Name': 'plymouth custom suburb',
        'Origin': 'USA',
        'Weight_in_lbs': 4654,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 180,
        'Miles_per_Gallon': 12,
        'Name': 'oldsmobile vista cruiser',
        'Origin': 'USA',
        'Weight_in_lbs': 4499,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 18,
        'Name': 'amc gremlin',
        'Origin': 'USA',
        'Weight_in_lbs': 2789,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 88,
        'Miles_per_Gallon': 20,
        'Name': 'toyota carina',
        'Origin': 'Japan',
        'Weight_in_lbs': 2279,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 72,
        'Miles_per_Gallon': 21,
        'Name': 'chevrolet vega',
        'Origin': 'USA',
        'Weight_in_lbs': 2401,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 108,
        'Horsepower': 94,
        'Miles_per_Gallon': 22,
        'Name': 'datsun 610',
        'Origin': 'Japan',
        'Weight_in_lbs': 2379,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 3,
        'Displacement': 70,
        'Horsepower': 90,
        'Miles_per_Gallon': 18,
        'Name': 'maxda rx3',
        'Origin': 'Japan',
        'Weight_in_lbs': 2124,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 18.5,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 85,
        'Miles_per_Gallon': 19,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2310,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 6,
        'Displacement': 155,
        'Horsepower': 107,
        'Miles_per_Gallon': 21,
        'Name': 'mercury capri v6',
        'Origin': 'USA',
        'Weight_in_lbs': 2472,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 90,
        'Miles_per_Gallon': 26,
        'Name': 'fiat 124 sport coupe',
        'Origin': 'Europe',
        'Weight_in_lbs': 2265,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 145,
        'Miles_per_Gallon': 15,
        'Name': 'chevrolet monte carlo s',
        'Origin': 'USA',
        'Weight_in_lbs': 4082,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 9.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 230,
        'Miles_per_Gallon': 16,
        'Name': 'pontiac grand prix',
        'Origin': 'USA',
        'Weight_in_lbs': 4278,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 4,
        'Displacement': 68,
        'Horsepower': 49,
        'Miles_per_Gallon': 29,
        'Name': 'fiat 128',
        'Origin': 'Europe',
        'Weight_in_lbs': 1867,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 116,
        'Horsepower': 75,
        'Miles_per_Gallon': 24,
        'Name': 'opel manta',
        'Origin': 'Europe',
        'Weight_in_lbs': 2158,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 114,
        'Horsepower': 91,
        'Miles_per_Gallon': 20,
        'Name': 'audi 100ls',
        'Origin': 'Europe',
        'Weight_in_lbs': 2582,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 112,
        'Miles_per_Gallon': 19,
        'Name': 'volvo 144ea',
        'Origin': 'Europe',
        'Weight_in_lbs': 2868,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 15,
        'Name': 'dodge dart custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3399,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 110,
        'Miles_per_Gallon': 24,
        'Name': 'saab 99le',
        'Origin': 'Europe',
        'Weight_in_lbs': 2660,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 6,
        'Displacement': 156,
        'Horsepower': 122,
        'Miles_per_Gallon': 20,
        'Name': 'toyota mark ii',
        'Origin': 'Japan',
        'Weight_in_lbs': 2807,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 11,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 180,
        'Miles_per_Gallon': 11,
        'Name': 'oldsmobile omega',
        'Origin': 'USA',
        'Weight_in_lbs': 3664,
        'Year': '1973-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 6,
        'Displacement': 198,
        'Horsepower': 95,
        'Miles_per_Gallon': 20,
        'Name': 'plymouth duster',
        'Origin': 'USA',
        'Weight_in_lbs': 3102,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': null,
        'Miles_per_Gallon': 21,
        'Name': 'ford maverick',
        'Origin': 'USA',
        'Weight_in_lbs': 2875,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 19,
        'Name': 'amc hornet',
        'Origin': 'USA',
        'Weight_in_lbs': 2901,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 100,
        'Miles_per_Gallon': 15,
        'Name': 'chevrolet nova',
        'Origin': 'USA',
        'Weight_in_lbs': 3336,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 67,
        'Miles_per_Gallon': 31,
        'Name': 'datsun b210',
        'Origin': 'Japan',
        'Weight_in_lbs': 1950,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 80,
        'Miles_per_Gallon': 26,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2451,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 21,
        'Cylinders': 4,
        'Displacement': 71,
        'Horsepower': 65,
        'Miles_per_Gallon': 32,
        'Name': 'toyota corolla 1200',
        'Origin': 'Japan',
        'Weight_in_lbs': 1836,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 75,
        'Miles_per_Gallon': 25,
        'Name': 'chevrolet vega',
        'Origin': 'USA',
        'Weight_in_lbs': 2542,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 100,
        'Miles_per_Gallon': 16,
        'Name': 'chevrolet chevelle malibu classic',
        'Origin': 'USA',
        'Weight_in_lbs': 3781,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 6,
        'Displacement': 258,
        'Horsepower': 110,
        'Miles_per_Gallon': 16,
        'Name': 'amc matador',
        'Origin': 'USA',
        'Weight_in_lbs': 3632,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 105,
        'Miles_per_Gallon': 18,
        'Name': 'plymouth satellite sebring',
        'Origin': 'USA',
        'Weight_in_lbs': 3613,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 140,
        'Miles_per_Gallon': 16,
        'Name': 'ford gran torino',
        'Origin': 'USA',
        'Weight_in_lbs': 4141,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 150,
        'Miles_per_Gallon': 13,
        'Name': 'buick century luxus (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4699,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'dodge coronet custom (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4457,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 140,
        'Miles_per_Gallon': 14,
        'Name': 'ford gran torino (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4638,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 150,
        'Miles_per_Gallon': 14,
        'Name': 'amc matador (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4257,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 83,
        'Miles_per_Gallon': 29,
        'Name': 'audi fox',
        'Origin': 'Europe',
        'Weight_in_lbs': 2219,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 67,
        'Miles_per_Gallon': 26,
        'Name': 'volkswagen dasher',
        'Origin': 'Europe',
        'Weight_in_lbs': 1963,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 78,
        'Miles_per_Gallon': 26,
        'Name': 'opel manta',
        'Origin': 'Europe',
        'Weight_in_lbs': 2300,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 76,
        'Horsepower': 52,
        'Miles_per_Gallon': 31,
        'Name': 'toyota corona',
        'Origin': 'Japan',
        'Weight_in_lbs': 1649,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 4,
        'Displacement': 83,
        'Horsepower': 61,
        'Miles_per_Gallon': 32,
        'Name': 'datsun 710',
        'Origin': 'Japan',
        'Weight_in_lbs': 2003,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 75,
        'Miles_per_Gallon': 28,
        'Name': 'dodge colt',
        'Origin': 'USA',
        'Weight_in_lbs': 2125,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 75,
        'Miles_per_Gallon': 24,
        'Name': 'fiat 128',
        'Origin': 'Europe',
        'Weight_in_lbs': 2108,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 116,
        'Horsepower': 75,
        'Miles_per_Gallon': 26,
        'Name': 'fiat 124 tc',
        'Origin': 'Europe',
        'Weight_in_lbs': 2246,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 97,
        'Miles_per_Gallon': 24,
        'Name': 'honda civic',
        'Origin': 'Japan',
        'Weight_in_lbs': 2489,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 108,
        'Horsepower': 93,
        'Miles_per_Gallon': 26,
        'Name': 'subaru',
        'Origin': 'Japan',
        'Weight_in_lbs': 2391,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 67,
        'Miles_per_Gallon': 31,
        'Name': 'fiat x1.9',
        'Origin': 'Europe',
        'Weight_in_lbs': 2000,
        'Year': '1974-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 95,
        'Miles_per_Gallon': 19,
        'Name': 'plymouth valiant custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3264,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 105,
        'Miles_per_Gallon': 18,
        'Name': 'chevrolet nova',
        'Origin': 'USA',
        'Weight_in_lbs': 3459,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 21,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 72,
        'Miles_per_Gallon': 15,
        'Name': 'mercury monarch',
        'Origin': 'USA',
        'Weight_in_lbs': 3432,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 19.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 72,
        'Miles_per_Gallon': 15,
        'Name': 'ford maverick',
        'Origin': 'USA',
        'Weight_in_lbs': 3158,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 11.5,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 170,
        'Miles_per_Gallon': 16,
        'Name': 'pontiac catalina',
        'Origin': 'USA',
        'Weight_in_lbs': 4668,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 145,
        'Miles_per_Gallon': 15,
        'Name': 'chevrolet bel air',
        'Origin': 'USA',
        'Weight_in_lbs': 4440,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 16,
        'Name': 'plymouth grand fury',
        'Origin': 'USA',
        'Weight_in_lbs': 4498,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 148,
        'Miles_per_Gallon': 14,
        'Name': 'ford ltd',
        'Origin': 'USA',
        'Weight_in_lbs': 4657,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 21,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 110,
        'Miles_per_Gallon': 17,
        'Name': 'buick century',
        'Origin': 'USA',
        'Weight_in_lbs': 3907,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 18.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 105,
        'Miles_per_Gallon': 16,
        'Name': 'chevroelt chevelle malibu',
        'Origin': 'USA',
        'Weight_in_lbs': 3897,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 6,
        'Displacement': 258,
        'Horsepower': 110,
        'Miles_per_Gallon': 15,
        'Name': 'amc matador',
        'Origin': 'USA',
        'Weight_in_lbs': 3730,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 95,
        'Miles_per_Gallon': 18,
        'Name': 'plymouth fury',
        'Origin': 'USA',
        'Weight_in_lbs': 3785,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 110,
        'Miles_per_Gallon': 21,
        'Name': 'buick skyhawk',
        'Origin': 'USA',
        'Weight_in_lbs': 3039,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 8,
        'Displacement': 262,
        'Horsepower': 110,
        'Miles_per_Gallon': 20,
        'Name': 'chevrolet monza 2+2',
        'Origin': 'USA',
        'Weight_in_lbs': 3221,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 129,
        'Miles_per_Gallon': 13,
        'Name': 'ford mustang ii',
        'Origin': 'USA',
        'Weight_in_lbs': 3169,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 75,
        'Miles_per_Gallon': 29,
        'Name': 'toyota corolla',
        'Origin': 'Japan',
        'Weight_in_lbs': 2171,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 83,
        'Miles_per_Gallon': 23,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2639,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 100,
        'Miles_per_Gallon': 20,
        'Name': 'amc gremlin',
        'Origin': 'USA',
        'Weight_in_lbs': 2914,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 18.5,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 78,
        'Miles_per_Gallon': 23,
        'Name': 'pontiac astro',
        'Origin': 'USA',
        'Weight_in_lbs': 2592,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 4,
        'Displacement': 134,
        'Horsepower': 96,
        'Miles_per_Gallon': 24,
        'Name': 'toyota corona',
        'Origin': 'Japan',
        'Weight_in_lbs': 2702,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 71,
        'Miles_per_Gallon': 25,
        'Name': 'volkswagen dasher',
        'Origin': 'Europe',
        'Weight_in_lbs': 2223,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 97,
        'Miles_per_Gallon': 24,
        'Name': 'datsun 710',
        'Origin': 'Japan',
        'Weight_in_lbs': 2545,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 6,
        'Displacement': 171,
        'Horsepower': 97,
        'Miles_per_Gallon': 18,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2984,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 70,
        'Miles_per_Gallon': 29,
        'Name': 'volkswagen rabbit',
        'Origin': 'Europe',
        'Weight_in_lbs': 1937,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 90,
        'Miles_per_Gallon': 19,
        'Name': 'amc pacer',
        'Origin': 'USA',
        'Weight_in_lbs': 3211,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 115,
        'Horsepower': 95,
        'Miles_per_Gallon': 23,
        'Name': 'audi 100ls',
        'Origin': 'Europe',
        'Weight_in_lbs': 2694,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 88,
        'Miles_per_Gallon': 23,
        'Name': 'peugeot 504',
        'Origin': 'Europe',
        'Weight_in_lbs': 2957,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 98,
        'Miles_per_Gallon': 22,
        'Name': 'volvo 244dl',
        'Origin': 'Europe',
        'Weight_in_lbs': 2945,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 115,
        'Miles_per_Gallon': 25,
        'Name': 'saab 99le',
        'Origin': 'Europe',
        'Weight_in_lbs': 2671,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 17.5,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 53,
        'Miles_per_Gallon': 33,
        'Name': 'honda civic cvcc',
        'Origin': 'Japan',
        'Weight_in_lbs': 1795,
        'Year': '1975-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 107,
        'Horsepower': 86,
        'Miles_per_Gallon': 28,
        'Name': 'fiat 131',
        'Origin': 'Europe',
        'Weight_in_lbs': 2464,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 16.9,
        'Cylinders': 4,
        'Displacement': 116,
        'Horsepower': 81,
        'Miles_per_Gallon': 25,
        'Name': 'opel 1900',
        'Origin': 'Europe',
        'Weight_in_lbs': 2220,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 92,
        'Miles_per_Gallon': 25,
        'Name': 'capri ii',
        'Origin': 'USA',
        'Weight_in_lbs': 2572,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.7,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 79,
        'Miles_per_Gallon': 26,
        'Name': 'dodge colt',
        'Origin': 'USA',
        'Weight_in_lbs': 2255,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 15.3,
        'Cylinders': 4,
        'Displacement': 101,
        'Horsepower': 83,
        'Miles_per_Gallon': 27,
        'Name': 'renault 12tl',
        'Origin': 'Europe',
        'Weight_in_lbs': 2202,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 305,
        'Horsepower': 140,
        'Miles_per_Gallon': 17.5,
        'Name': 'chevrolet chevelle malibu classic',
        'Origin': 'USA',
        'Weight_in_lbs': 4215,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 16,
        'Name': 'dodge coronet brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4190,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 13.9,
        'Cylinders': 8,
        'Displacement': 304,
        'Horsepower': 120,
        'Miles_per_Gallon': 15.5,
        'Name': 'amc matador',
        'Origin': 'USA',
        'Weight_in_lbs': 3962,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 12.8,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 152,
        'Miles_per_Gallon': 14.5,
        'Name': 'ford gran torino',
        'Origin': 'USA',
        'Weight_in_lbs': 4215,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 15.4,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 100,
        'Miles_per_Gallon': 22,
        'Name': 'plymouth valiant',
        'Origin': 'USA',
        'Weight_in_lbs': 3233,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 105,
        'Miles_per_Gallon': 22,
        'Name': 'chevrolet nova',
        'Origin': 'USA',
        'Weight_in_lbs': 3353,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.6,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 81,
        'Miles_per_Gallon': 24,
        'Name': 'ford maverick',
        'Origin': 'USA',
        'Weight_in_lbs': 3012,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.6,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 90,
        'Miles_per_Gallon': 22.5,
        'Name': 'amc hornet',
        'Origin': 'USA',
        'Weight_in_lbs': 3085,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 22.2,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 52,
        'Miles_per_Gallon': 29,
        'Name': 'chevrolet chevette',
        'Origin': 'USA',
        'Weight_in_lbs': 2035,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 22.1,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 60,
        'Miles_per_Gallon': 24.5,
        'Name': 'chevrolet woody',
        'Origin': 'USA',
        'Weight_in_lbs': 2164,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 14.2,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 70,
        'Miles_per_Gallon': 29,
        'Name': 'vw rabbit',
        'Origin': 'Europe',
        'Weight_in_lbs': 1937,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.4,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 53,
        'Miles_per_Gallon': 33,
        'Name': 'honda civic',
        'Origin': 'Japan',
        'Weight_in_lbs': 1795,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.7,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 100,
        'Miles_per_Gallon': 20,
        'Name': 'dodge aspen se',
        'Origin': 'USA',
        'Weight_in_lbs': 3651,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 21,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 78,
        'Miles_per_Gallon': 18,
        'Name': 'ford granada ghia',
        'Origin': 'USA',
        'Weight_in_lbs': 3574,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 16.2,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 110,
        'Miles_per_Gallon': 18.5,
        'Name': 'pontiac ventura sj',
        'Origin': 'USA',
        'Weight_in_lbs': 3645,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17.8,
        'Cylinders': 6,
        'Displacement': 258,
        'Horsepower': 95,
        'Miles_per_Gallon': 17.5,
        'Name': 'amc pacer d/l',
        'Origin': 'USA',
        'Weight_in_lbs': 3193,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 12.2,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 71,
        'Miles_per_Gallon': 29.5,
        'Name': 'volkswagen rabbit',
        'Origin': 'Europe',
        'Weight_in_lbs': 1825,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 70,
        'Miles_per_Gallon': 32,
        'Name': 'datsun b-210',
        'Origin': 'Japan',
        'Weight_in_lbs': 1990,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 75,
        'Miles_per_Gallon': 28,
        'Name': 'toyota corolla',
        'Origin': 'Japan',
        'Weight_in_lbs': 2155,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 13.6,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 72,
        'Miles_per_Gallon': 26.5,
        'Name': 'ford pinto',
        'Origin': 'USA',
        'Weight_in_lbs': 2565,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 15.7,
        'Cylinders': 4,
        'Displacement': 130,
        'Horsepower': 102,
        'Miles_per_Gallon': 20,
        'Name': 'volvo 245',
        'Origin': 'Europe',
        'Weight_in_lbs': 3150,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 13,
        'Name': 'plymouth volare premier v8',
        'Origin': 'USA',
        'Weight_in_lbs': 3940,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 21.9,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 88,
        'Miles_per_Gallon': 19,
        'Name': 'peugeot 504',
        'Origin': 'Europe',
        'Weight_in_lbs': 3270,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 6,
        'Displacement': 156,
        'Horsepower': 108,
        'Miles_per_Gallon': 19,
        'Name': 'toyota mark ii',
        'Origin': 'Japan',
        'Weight_in_lbs': 2930,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 16.7,
        'Cylinders': 6,
        'Displacement': 168,
        'Horsepower': 120,
        'Miles_per_Gallon': 16.5,
        'Name': 'mercedes-benz 280s',
        'Origin': 'Europe',
        'Weight_in_lbs': 3820,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 12.1,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 180,
        'Miles_per_Gallon': 16.5,
        'Name': 'cadillac seville',
        'Origin': 'USA',
        'Weight_in_lbs': 4380,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 12,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 145,
        'Miles_per_Gallon': 13,
        'Name': 'chevy c10',
        'Origin': 'USA',
        'Weight_in_lbs': 4055,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 130,
        'Miles_per_Gallon': 13,
        'Name': 'ford f108',
        'Origin': 'USA',
        'Weight_in_lbs': 3870,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 150,
        'Miles_per_Gallon': 13,
        'Name': 'dodge d100',
        'Origin': 'USA',
        'Weight_in_lbs': 3755,
        'Year': '1976-01-01T00:00:00'
      },
      {
        'Acceleration': 18.5,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 68,
        'Miles_per_Gallon': 31.5,
        'Name': 'honda Accelerationord cvcc',
        'Origin': 'Japan',
        'Weight_in_lbs': 2045,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.8,
        'Cylinders': 4,
        'Displacement': 111,
        'Horsepower': 80,
        'Miles_per_Gallon': 30,
        'Name': 'buick opel isuzu deluxe',
        'Origin': 'USA',
        'Weight_in_lbs': 2155,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 18.6,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 58,
        'Miles_per_Gallon': 36,
        'Name': 'renault 5 gtl',
        'Origin': 'Europe',
        'Weight_in_lbs': 1825,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 96,
        'Miles_per_Gallon': 25.5,
        'Name': 'plymouth arrow gs',
        'Origin': 'USA',
        'Weight_in_lbs': 2300,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 16.8,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 70,
        'Miles_per_Gallon': 33.5,
        'Name': 'datsun f-10 hatchback',
        'Origin': 'Japan',
        'Weight_in_lbs': 1945,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 8,
        'Displacement': 305,
        'Horsepower': 145,
        'Miles_per_Gallon': 17.5,
        'Name': 'chevrolet caprice classic',
        'Origin': 'USA',
        'Weight_in_lbs': 3880,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 8,
        'Displacement': 260,
        'Horsepower': 110,
        'Miles_per_Gallon': 17,
        'Name': 'oldsmobile cutlass supreme',
        'Origin': 'USA',
        'Weight_in_lbs': 4060,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 13.7,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 145,
        'Miles_per_Gallon': 15.5,
        'Name': 'dodge monaco brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4140,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 130,
        'Miles_per_Gallon': 15,
        'Name': 'mercury cougar brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 4295,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 110,
        'Miles_per_Gallon': 17.5,
        'Name': 'chevrolet concours',
        'Origin': 'USA',
        'Weight_in_lbs': 3520,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 16.9,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 105,
        'Miles_per_Gallon': 20.5,
        'Name': 'buick skylark',
        'Origin': 'USA',
        'Weight_in_lbs': 3425,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 17.7,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 100,
        'Miles_per_Gallon': 19,
        'Name': 'plymouth volare custom',
        'Origin': 'USA',
        'Weight_in_lbs': 3630,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 6,
        'Displacement': 250,
        'Horsepower': 98,
        'Miles_per_Gallon': 18.5,
        'Name': 'ford granada',
        'Origin': 'USA',
        'Weight_in_lbs': 3525,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 11.1,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 180,
        'Miles_per_Gallon': 16,
        'Name': 'pontiac grand prix lj',
        'Origin': 'USA',
        'Weight_in_lbs': 4220,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 11.4,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 170,
        'Miles_per_Gallon': 15.5,
        'Name': 'chevrolet monte carlo landau',
        'Origin': 'USA',
        'Weight_in_lbs': 4165,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 12.2,
        'Cylinders': 8,
        'Displacement': 400,
        'Horsepower': 190,
        'Miles_per_Gallon': 15.5,
        'Name': 'chrysler cordoba',
        'Origin': 'USA',
        'Weight_in_lbs': 4325,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 149,
        'Miles_per_Gallon': 16,
        'Name': 'ford thunderbird',
        'Origin': 'USA',
        'Weight_in_lbs': 4335,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 78,
        'Miles_per_Gallon': 29,
        'Name': 'volkswagen rabbit custom',
        'Origin': 'Europe',
        'Weight_in_lbs': 1940,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 88,
        'Miles_per_Gallon': 24.5,
        'Name': 'pontiac sunbird coupe',
        'Origin': 'USA',
        'Weight_in_lbs': 2740,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 18.2,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 75,
        'Miles_per_Gallon': 26,
        'Name': 'toyota corolla liftback',
        'Origin': 'Japan',
        'Weight_in_lbs': 2265,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 89,
        'Miles_per_Gallon': 25.5,
        'Name': 'ford mustang ii 2+2',
        'Origin': 'USA',
        'Weight_in_lbs': 2755,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 63,
        'Miles_per_Gallon': 30.5,
        'Name': 'chevrolet chevette',
        'Origin': 'USA',
        'Weight_in_lbs': 2051,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 15.9,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 83,
        'Miles_per_Gallon': 33.5,
        'Name': 'dodge colt m/m',
        'Origin': 'USA',
        'Weight_in_lbs': 2075,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 67,
        'Miles_per_Gallon': 30,
        'Name': 'subaru dl',
        'Origin': 'Japan',
        'Weight_in_lbs': 1985,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.1,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 78,
        'Miles_per_Gallon': 30.5,
        'Name': 'volkswagen dasher',
        'Origin': 'Europe',
        'Weight_in_lbs': 2190,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 6,
        'Displacement': 146,
        'Horsepower': 97,
        'Miles_per_Gallon': 22,
        'Name': 'datsun 810',
        'Origin': 'Japan',
        'Weight_in_lbs': 2815,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 12.8,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 110,
        'Miles_per_Gallon': 21.5,
        'Name': 'bmw 320i',
        'Origin': 'Europe',
        'Weight_in_lbs': 2600,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 13.5,
        'Cylinders': 3,
        'Displacement': 80,
        'Horsepower': 110,
        'Miles_per_Gallon': 21.5,
        'Name': 'mazda rx-4',
        'Origin': 'Japan',
        'Weight_in_lbs': 2720,
        'Year': '1977-01-01T00:00:00'
      },
      {
        'Acceleration': 21.5,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 48,
        'Miles_per_Gallon': 43.1,
        'Name': 'volkswagen rabbit custom diesel',
        'Origin': 'Europe',
        'Weight_in_lbs': 1985,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.4,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 66,
        'Miles_per_Gallon': 36.1,
        'Name': 'ford fiesta',
        'Origin': 'USA',
        'Weight_in_lbs': 1800,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 19.4,
        'Cylinders': 4,
        'Displacement': 78,
        'Horsepower': 52,
        'Miles_per_Gallon': 32.8,
        'Name': 'mazda glc deluxe',
        'Origin': 'Japan',
        'Weight_in_lbs': 1985,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 18.6,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 70,
        'Miles_per_Gallon': 39.4,
        'Name': 'datsun b210 gx',
        'Origin': 'Japan',
        'Weight_in_lbs': 2070,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 60,
        'Miles_per_Gallon': 36.1,
        'Name': 'honda civic cvcc',
        'Origin': 'Japan',
        'Weight_in_lbs': 1800,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 8,
        'Displacement': 260,
        'Horsepower': 110,
        'Miles_per_Gallon': 19.9,
        'Name': 'oldsmobile cutlass salon brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 3365,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 140,
        'Miles_per_Gallon': 19.4,
        'Name': 'dodge diplomat',
        'Origin': 'USA',
        'Weight_in_lbs': 3735,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 12.8,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 139,
        'Miles_per_Gallon': 20.2,
        'Name': 'mercury monarch ghia',
        'Origin': 'USA',
        'Weight_in_lbs': 3570,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 19.2,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 105,
        'Miles_per_Gallon': 19.2,
        'Name': 'pontiac phoenix lj',
        'Origin': 'USA',
        'Weight_in_lbs': 3535,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 18.2,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 95,
        'Miles_per_Gallon': 20.5,
        'Name': 'chevrolet malibu',
        'Origin': 'USA',
        'Weight_in_lbs': 3155,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 85,
        'Miles_per_Gallon': 20.2,
        'Name': 'ford fairmont (auto)',
        'Origin': 'USA',
        'Weight_in_lbs': 2965,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.4,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 88,
        'Miles_per_Gallon': 25.1,
        'Name': 'ford fairmont (man)',
        'Origin': 'USA',
        'Weight_in_lbs': 2720,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 17.2,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 100,
        'Miles_per_Gallon': 20.5,
        'Name': 'plymouth volare',
        'Origin': 'USA',
        'Weight_in_lbs': 3430,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 17.2,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 90,
        'Miles_per_Gallon': 19.4,
        'Name': 'amc concord',
        'Origin': 'USA',
        'Weight_in_lbs': 3210,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 105,
        'Miles_per_Gallon': 20.6,
        'Name': 'buick century special',
        'Origin': 'USA',
        'Weight_in_lbs': 3380,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 16.7,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 85,
        'Miles_per_Gallon': 20.8,
        'Name': 'mercury zephyr',
        'Origin': 'USA',
        'Weight_in_lbs': 3070,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 18.7,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 110,
        'Miles_per_Gallon': 18.6,
        'Name': 'dodge aspen',
        'Origin': 'USA',
        'Weight_in_lbs': 3620,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.1,
        'Cylinders': 6,
        'Displacement': 258,
        'Horsepower': 120,
        'Miles_per_Gallon': 18.1,
        'Name': 'amc concord d/l',
        'Origin': 'USA',
        'Weight_in_lbs': 3410,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 8,
        'Displacement': 305,
        'Horsepower': 145,
        'Miles_per_Gallon': 19.2,
        'Name': 'chevrolet monte carlo landau',
        'Origin': 'USA',
        'Weight_in_lbs': 3425,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 13.4,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 165,
        'Miles_per_Gallon': 17.7,
        'Name': 'buick regal sport coupe (turbo)',
        'Origin': 'USA',
        'Weight_in_lbs': 3445,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 11.2,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 139,
        'Miles_per_Gallon': 18.1,
        'Name': 'ford futura',
        'Origin': 'USA',
        'Weight_in_lbs': 3205,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 13.7,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 140,
        'Miles_per_Gallon': 17.5,
        'Name': 'dodge magnum xe',
        'Origin': 'USA',
        'Weight_in_lbs': 4080,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 68,
        'Miles_per_Gallon': 30,
        'Name': 'chevrolet chevette',
        'Origin': 'USA',
        'Weight_in_lbs': 2155,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.2,
        'Cylinders': 4,
        'Displacement': 134,
        'Horsepower': 95,
        'Miles_per_Gallon': 27.5,
        'Name': 'toyota corona',
        'Origin': 'Japan',
        'Weight_in_lbs': 2560,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.7,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 97,
        'Miles_per_Gallon': 27.2,
        'Name': 'datsun 510',
        'Origin': 'Japan',
        'Weight_in_lbs': 2300,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 75,
        'Miles_per_Gallon': 30.9,
        'Name': 'dodge omni',
        'Origin': 'USA',
        'Weight_in_lbs': 2230,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.8,
        'Cylinders': 4,
        'Displacement': 134,
        'Horsepower': 95,
        'Miles_per_Gallon': 21.1,
        'Name': 'toyota celica gt liftback',
        'Origin': 'Japan',
        'Weight_in_lbs': 2515,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 16.7,
        'Cylinders': 4,
        'Displacement': 156,
        'Horsepower': 105,
        'Miles_per_Gallon': 23.2,
        'Name': 'plymouth sapporo',
        'Origin': 'USA',
        'Weight_in_lbs': 2745,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 17.6,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 85,
        'Miles_per_Gallon': 23.8,
        'Name': 'oldsmobile starfire sx',
        'Origin': 'USA',
        'Weight_in_lbs': 2855,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 97,
        'Miles_per_Gallon': 23.9,
        'Name': 'datsun 200-sx',
        'Origin': 'Japan',
        'Weight_in_lbs': 2405,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.9,
        'Cylinders': 5,
        'Displacement': 131,
        'Horsepower': 103,
        'Miles_per_Gallon': 20.3,
        'Name': 'audi 5000',
        'Origin': 'Europe',
        'Weight_in_lbs': 2830,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 13.6,
        'Cylinders': 6,
        'Displacement': 163,
        'Horsepower': 125,
        'Miles_per_Gallon': 17,
        'Name': 'volvo 264gl',
        'Origin': 'Europe',
        'Weight_in_lbs': 3140,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.7,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 115,
        'Miles_per_Gallon': 21.6,
        'Name': 'saab 99gle',
        'Origin': 'Europe',
        'Weight_in_lbs': 2795,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 6,
        'Displacement': 163,
        'Horsepower': 133,
        'Miles_per_Gallon': 16.2,
        'Name': 'peugeot 604sl',
        'Origin': 'Europe',
        'Weight_in_lbs': 3410,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 4,
        'Displacement': 89,
        'Horsepower': 71,
        'Miles_per_Gallon': 31.5,
        'Name': 'volkswagen scirocco',
        'Origin': 'Europe',
        'Weight_in_lbs': 1990,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 16.6,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 68,
        'Miles_per_Gallon': 29.5,
        'Name': 'honda Accelerationord lx',
        'Origin': 'Japan',
        'Weight_in_lbs': 2135,
        'Year': '1978-01-01T00:00:00'
      },
      {
        'Acceleration': 15.4,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 115,
        'Miles_per_Gallon': 21.5,
        'Name': 'pontiac lemans v6',
        'Origin': 'USA',
        'Weight_in_lbs': 3245,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 18.2,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 85,
        'Miles_per_Gallon': 19.8,
        'Name': 'mercury zephyr 6',
        'Origin': 'USA',
        'Weight_in_lbs': 2990,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 17.3,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 88,
        'Miles_per_Gallon': 22.3,
        'Name': 'ford fairmont 4',
        'Origin': 'USA',
        'Weight_in_lbs': 2890,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 18.2,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 90,
        'Miles_per_Gallon': 20.2,
        'Name': 'amc concord dl 6',
        'Origin': 'USA',
        'Weight_in_lbs': 3265,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 16.6,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 110,
        'Miles_per_Gallon': 20.6,
        'Name': 'dodge aspen 6',
        'Origin': 'USA',
        'Weight_in_lbs': 3360,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 15.4,
        'Cylinders': 8,
        'Displacement': 305,
        'Horsepower': 130,
        'Miles_per_Gallon': 17,
        'Name': 'chevrolet caprice classic',
        'Origin': 'USA',
        'Weight_in_lbs': 3840,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 13.4,
        'Cylinders': 8,
        'Displacement': 302,
        'Horsepower': 129,
        'Miles_per_Gallon': 17.6,
        'Name': 'ford ltd landau',
        'Origin': 'USA',
        'Weight_in_lbs': 3725,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 138,
        'Miles_per_Gallon': 16.5,
        'Name': 'mercury grand marquis',
        'Origin': 'USA',
        'Weight_in_lbs': 3955,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 15.2,
        'Cylinders': 8,
        'Displacement': 318,
        'Horsepower': 135,
        'Miles_per_Gallon': 18.2,
        'Name': 'dodge st. regis',
        'Origin': 'USA',
        'Weight_in_lbs': 3830,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 155,
        'Miles_per_Gallon': 16.9,
        'Name': 'buick estate wagon (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4360,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.3,
        'Cylinders': 8,
        'Displacement': 351,
        'Horsepower': 142,
        'Miles_per_Gallon': 15.5,
        'Name': 'ford country squire (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 4054,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 8,
        'Displacement': 267,
        'Horsepower': 125,
        'Miles_per_Gallon': 19.2,
        'Name': 'chevrolet malibu classic (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 3605,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 8,
        'Displacement': 360,
        'Horsepower': 150,
        'Miles_per_Gallon': 18.5,
        'Name': 'chrysler lebaron town @ country (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 3940,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14,
        'Cylinders': 4,
        'Displacement': 89,
        'Horsepower': 71,
        'Miles_per_Gallon': 31.9,
        'Name': 'vw rabbit custom',
        'Origin': 'Europe',
        'Weight_in_lbs': 1925,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 15.2,
        'Cylinders': 4,
        'Displacement': 86,
        'Horsepower': 65,
        'Miles_per_Gallon': 34.1,
        'Name': 'maxda glc deluxe',
        'Origin': 'Japan',
        'Weight_in_lbs': 1975,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.4,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 80,
        'Miles_per_Gallon': 35.7,
        'Name': 'dodge colt hatchback custom',
        'Origin': 'USA',
        'Weight_in_lbs': 1915,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 80,
        'Miles_per_Gallon': 27.4,
        'Name': 'amc spirit dl',
        'Origin': 'USA',
        'Weight_in_lbs': 2670,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 20.1,
        'Cylinders': 5,
        'Displacement': 183,
        'Horsepower': 77,
        'Miles_per_Gallon': 25.4,
        'Name': 'mercedes benz 300d',
        'Origin': 'Europe',
        'Weight_in_lbs': 3530,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 17.4,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 125,
        'Miles_per_Gallon': 23,
        'Name': 'cadillac eldorado',
        'Origin': 'USA',
        'Weight_in_lbs': 3900,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 24.8,
        'Cylinders': 4,
        'Displacement': 141,
        'Horsepower': 71,
        'Miles_per_Gallon': 27.2,
        'Name': 'peugeot 504',
        'Origin': 'Europe',
        'Weight_in_lbs': 3190,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 22.2,
        'Cylinders': 8,
        'Displacement': 260,
        'Horsepower': 90,
        'Miles_per_Gallon': 23.9,
        'Name': 'oldsmobile cutlass salon brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 3420,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 70,
        'Miles_per_Gallon': 34.2,
        'Name': 'plymouth horizon',
        'Origin': 'USA',
        'Weight_in_lbs': 2200,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 70,
        'Miles_per_Gallon': 34.5,
        'Name': 'plymouth horizon tc3',
        'Origin': 'USA',
        'Weight_in_lbs': 2150,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 19.2,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 65,
        'Miles_per_Gallon': 31.8,
        'Name': 'datsun 210',
        'Origin': 'Japan',
        'Weight_in_lbs': 2020,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.7,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 69,
        'Miles_per_Gallon': 37.3,
        'Name': 'fiat strada custom',
        'Origin': 'Europe',
        'Weight_in_lbs': 2130,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 28.4,
        'Name': 'buick skylark limited',
        'Origin': 'USA',
        'Weight_in_lbs': 2670,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 11.3,
        'Cylinders': 6,
        'Displacement': 173,
        'Horsepower': 115,
        'Miles_per_Gallon': 28.8,
        'Name': 'chevrolet citation',
        'Origin': 'USA',
        'Weight_in_lbs': 2595,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 12.9,
        'Cylinders': 6,
        'Displacement': 173,
        'Horsepower': 115,
        'Miles_per_Gallon': 26.8,
        'Name': 'oldsmobile omega brougham',
        'Origin': 'USA',
        'Weight_in_lbs': 2700,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 13.2,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 33.5,
        'Name': 'pontiac phoenix',
        'Origin': 'USA',
        'Weight_in_lbs': 2556,
        'Year': '1979-01-01T00:00:00'
      },
      {
        'Acceleration': 14.7,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 76,
        'Miles_per_Gallon': 41.5,
        'Name': 'vw rabbit',
        'Origin': 'Europe',
        'Weight_in_lbs': 2144,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 18.8,
        'Cylinders': 4,
        'Displacement': 89,
        'Horsepower': 60,
        'Miles_per_Gallon': 38.1,
        'Name': 'toyota corolla tercel',
        'Origin': 'Japan',
        'Weight_in_lbs': 1968,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 70,
        'Miles_per_Gallon': 32.1,
        'Name': 'chevrolet chevette',
        'Origin': 'USA',
        'Weight_in_lbs': 2120,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 86,
        'Horsepower': 65,
        'Miles_per_Gallon': 37.2,
        'Name': 'datsun 310',
        'Origin': 'Japan',
        'Weight_in_lbs': 2019,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 16.5,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 28,
        'Name': 'chevrolet citation',
        'Origin': 'USA',
        'Weight_in_lbs': 2678,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 18.1,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 88,
        'Miles_per_Gallon': 26.4,
        'Name': 'ford fairmont',
        'Origin': 'USA',
        'Weight_in_lbs': 2870,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 20.1,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 24.3,
        'Name': 'amc concord',
        'Origin': 'USA',
        'Weight_in_lbs': 3003,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 18.7,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 90,
        'Miles_per_Gallon': 19.1,
        'Name': 'dodge aspen',
        'Origin': 'USA',
        'Weight_in_lbs': 3381,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 78,
        'Miles_per_Gallon': 34.3,
        'Name': 'audi 4000',
        'Origin': 'Europe',
        'Weight_in_lbs': 2188,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.5,
        'Cylinders': 4,
        'Displacement': 134,
        'Horsepower': 90,
        'Miles_per_Gallon': 29.8,
        'Name': 'toyota corona liftback',
        'Origin': 'Japan',
        'Weight_in_lbs': 2711,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 17.5,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 75,
        'Miles_per_Gallon': 31.3,
        'Name': 'mazda 626',
        'Origin': 'Japan',
        'Weight_in_lbs': 2542,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 92,
        'Miles_per_Gallon': 37,
        'Name': 'datsun 510 hatchback',
        'Origin': 'Japan',
        'Weight_in_lbs': 2434,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.2,
        'Cylinders': 4,
        'Displacement': 108,
        'Horsepower': 75,
        'Miles_per_Gallon': 32.2,
        'Name': 'toyota corolla',
        'Origin': 'Japan',
        'Weight_in_lbs': 2265,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 17.9,
        'Cylinders': 4,
        'Displacement': 86,
        'Horsepower': 65,
        'Miles_per_Gallon': 46.6,
        'Name': 'mazda glc',
        'Origin': 'Japan',
        'Weight_in_lbs': 2110,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 14.4,
        'Cylinders': 4,
        'Displacement': 156,
        'Horsepower': 105,
        'Miles_per_Gallon': 27.9,
        'Name': 'dodge colt',
        'Origin': 'USA',
        'Weight_in_lbs': 2800,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 19.2,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 65,
        'Miles_per_Gallon': 40.8,
        'Name': 'datsun 210',
        'Origin': 'Japan',
        'Weight_in_lbs': 2110,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 21.7,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 48,
        'Miles_per_Gallon': 44.3,
        'Name': 'vw rabbit c (diesel)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2085,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 23.7,
        'Cylinders': 4,
        'Displacement': 90,
        'Horsepower': 48,
        'Miles_per_Gallon': 43.4,
        'Name': 'vw dasher (diesel)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2335,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 19.9,
        'Cylinders': 5,
        'Displacement': 121,
        'Horsepower': 67,
        'Miles_per_Gallon': 36.4,
        'Name': 'audi 5000s (diesel)',
        'Origin': 'Europe',
        'Weight_in_lbs': 2950,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 21.8,
        'Cylinders': 4,
        'Displacement': 146,
        'Horsepower': 67,
        'Miles_per_Gallon': 30,
        'Name': 'mercedes-benz 240d',
        'Origin': 'Europe',
        'Weight_in_lbs': 3250,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 13.8,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 67,
        'Miles_per_Gallon': 44.6,
        'Name': 'honda civic 1500 gl',
        'Origin': 'Japan',
        'Weight_in_lbs': 1850,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 17.3,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': null,
        'Miles_per_Gallon': 40.9,
        'Name': 'renault lecar deluxe',
        'Origin': 'Europe',
        'Weight_in_lbs': 1835,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 67,
        'Miles_per_Gallon': 33.8,
        'Name': 'subaru dl',
        'Origin': 'Japan',
        'Weight_in_lbs': 2145,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.3,
        'Cylinders': 4,
        'Displacement': 89,
        'Horsepower': 62,
        'Miles_per_Gallon': 29.8,
        'Name': 'vokswagen rabbit',
        'Origin': 'Europe',
        'Weight_in_lbs': 1845,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 11.4,
        'Cylinders': 6,
        'Displacement': 168,
        'Horsepower': 132,
        'Miles_per_Gallon': 32.7,
        'Name': 'datsun 280-zx',
        'Origin': 'Japan',
        'Weight_in_lbs': 2910,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 12.5,
        'Cylinders': 3,
        'Displacement': 70,
        'Horsepower': 100,
        'Miles_per_Gallon': 23.7,
        'Name': 'mazda rx-7 gs',
        'Origin': 'Japan',
        'Weight_in_lbs': 2420,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.1,
        'Cylinders': 4,
        'Displacement': 122,
        'Horsepower': 88,
        'Miles_per_Gallon': 35,
        'Name': 'triumph tr7 coupe',
        'Origin': 'Europe',
        'Weight_in_lbs': 2500,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 14.3,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': null,
        'Miles_per_Gallon': 23.6,
        'Name': 'ford mustang cobra',
        'Origin': 'USA',
        'Weight_in_lbs': 2905,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 4,
        'Displacement': 107,
        'Horsepower': 72,
        'Miles_per_Gallon': 32.4,
        'Name': 'honda Accelerationord',
        'Origin': 'Japan',
        'Weight_in_lbs': 2290,
        'Year': '1980-01-01T00:00:00'
      },
      {
        'Acceleration': 15.7,
        'Cylinders': 4,
        'Displacement': 135,
        'Horsepower': 84,
        'Miles_per_Gallon': 27.2,
        'Name': 'plymouth reliant',
        'Origin': 'USA',
        'Weight_in_lbs': 2490,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 84,
        'Miles_per_Gallon': 26.6,
        'Name': 'buick skylark',
        'Origin': 'USA',
        'Weight_in_lbs': 2635,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.4,
        'Cylinders': 4,
        'Displacement': 156,
        'Horsepower': 92,
        'Miles_per_Gallon': 25.8,
        'Name': 'dodge aries wagon (sw)',
        'Origin': 'USA',
        'Weight_in_lbs': 2620,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 12.6,
        'Cylinders': 6,
        'Displacement': 173,
        'Horsepower': 110,
        'Miles_per_Gallon': 23.5,
        'Name': 'chevrolet citation',
        'Origin': 'USA',
        'Weight_in_lbs': 2725,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 12.9,
        'Cylinders': 4,
        'Displacement': 135,
        'Horsepower': 84,
        'Miles_per_Gallon': 30,
        'Name': 'plymouth reliant',
        'Origin': 'USA',
        'Weight_in_lbs': 2385,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.9,
        'Cylinders': 4,
        'Displacement': 79,
        'Horsepower': 58,
        'Miles_per_Gallon': 39.1,
        'Name': 'toyota starlet',
        'Origin': 'Japan',
        'Weight_in_lbs': 1755,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 86,
        'Horsepower': 64,
        'Miles_per_Gallon': 39,
        'Name': 'plymouth champ',
        'Origin': 'USA',
        'Weight_in_lbs': 1875,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.1,
        'Cylinders': 4,
        'Displacement': 81,
        'Horsepower': 60,
        'Miles_per_Gallon': 35.1,
        'Name': 'honda civic 1300',
        'Origin': 'Japan',
        'Weight_in_lbs': 1760,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.8,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 67,
        'Miles_per_Gallon': 32.3,
        'Name': 'subaru',
        'Origin': 'Japan',
        'Weight_in_lbs': 2065,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 19.4,
        'Cylinders': 4,
        'Displacement': 85,
        'Horsepower': 65,
        'Miles_per_Gallon': 37,
        'Name': 'datsun 210',
        'Origin': 'Japan',
        'Weight_in_lbs': 1975,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.3,
        'Cylinders': 4,
        'Displacement': 89,
        'Horsepower': 62,
        'Miles_per_Gallon': 37.7,
        'Name': 'toyota tercel',
        'Origin': 'Japan',
        'Weight_in_lbs': 2050,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 68,
        'Miles_per_Gallon': 34.1,
        'Name': 'mazda glc 4',
        'Origin': 'Japan',
        'Weight_in_lbs': 1985,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.9,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 63,
        'Miles_per_Gallon': 34.7,
        'Name': 'plymouth horizon 4',
        'Origin': 'USA',
        'Weight_in_lbs': 2215,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.2,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 65,
        'Miles_per_Gallon': 34.4,
        'Name': 'ford escort 4w',
        'Origin': 'USA',
        'Weight_in_lbs': 2045,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 20.7,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 65,
        'Miles_per_Gallon': 29.9,
        'Name': 'ford escort 2h',
        'Origin': 'USA',
        'Weight_in_lbs': 2380,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.2,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 74,
        'Miles_per_Gallon': 33,
        'Name': 'volkswagen jetta',
        'Origin': 'Europe',
        'Weight_in_lbs': 2190,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 4,
        'Displacement': 100,
        'Horsepower': null,
        'Miles_per_Gallon': 34.5,
        'Name': 'renault 18i',
        'Origin': 'Europe',
        'Weight_in_lbs': 2320,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.4,
        'Cylinders': 4,
        'Displacement': 107,
        'Horsepower': 75,
        'Miles_per_Gallon': 33.7,
        'Name': 'honda prelude',
        'Origin': 'Japan',
        'Weight_in_lbs': 2210,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.8,
        'Cylinders': 4,
        'Displacement': 108,
        'Horsepower': 75,
        'Miles_per_Gallon': 32.4,
        'Name': 'toyota corolla',
        'Origin': 'Japan',
        'Weight_in_lbs': 2350,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.8,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 100,
        'Miles_per_Gallon': 32.9,
        'Name': 'datsun 200sx',
        'Origin': 'Japan',
        'Weight_in_lbs': 2615,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18.3,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 74,
        'Miles_per_Gallon': 31.6,
        'Name': 'mazda 626',
        'Origin': 'Japan',
        'Weight_in_lbs': 2635,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 20.4,
        'Cylinders': 4,
        'Displacement': 141,
        'Horsepower': 80,
        'Miles_per_Gallon': 28.1,
        'Name': 'peugeot 505s turbo diesel',
        'Origin': 'Europe',
        'Weight_in_lbs': 3230,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.4,
        'Cylinders': 4,
        'Displacement': 121,
        'Horsepower': 110,
        'Miles_per_Gallon': null,
        'Name': 'saab 900s',
        'Origin': 'Europe',
        'Weight_in_lbs': 2800,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 19.6,
        'Cylinders': 6,
        'Displacement': 145,
        'Horsepower': 76,
        'Miles_per_Gallon': 30.7,
        'Name': 'volvo diesel',
        'Origin': 'Europe',
        'Weight_in_lbs': 3160,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 12.6,
        'Cylinders': 6,
        'Displacement': 168,
        'Horsepower': 116,
        'Miles_per_Gallon': 25.4,
        'Name': 'toyota cressida',
        'Origin': 'Japan',
        'Weight_in_lbs': 2900,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 13.8,
        'Cylinders': 6,
        'Displacement': 146,
        'Horsepower': 120,
        'Miles_per_Gallon': 24.2,
        'Name': 'datsun 810 maxima',
        'Origin': 'Japan',
        'Weight_in_lbs': 2930,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.8,
        'Cylinders': 6,
        'Displacement': 231,
        'Horsepower': 110,
        'Miles_per_Gallon': 22.4,
        'Name': 'buick century',
        'Origin': 'USA',
        'Weight_in_lbs': 3415,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 19,
        'Cylinders': 8,
        'Displacement': 350,
        'Horsepower': 105,
        'Miles_per_Gallon': 26.6,
        'Name': 'oldsmobile cutlass ls',
        'Origin': 'USA',
        'Weight_in_lbs': 3725,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.1,
        'Cylinders': 6,
        'Displacement': 200,
        'Horsepower': 88,
        'Miles_per_Gallon': 20.2,
        'Name': 'ford granada gl',
        'Origin': 'USA',
        'Weight_in_lbs': 3060,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.6,
        'Cylinders': 6,
        'Displacement': 225,
        'Horsepower': 85,
        'Miles_per_Gallon': 17.6,
        'Name': 'chrysler lebaron salon',
        'Origin': 'USA',
        'Weight_in_lbs': 3465,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 19.6,
        'Cylinders': 4,
        'Displacement': 112,
        'Horsepower': 88,
        'Miles_per_Gallon': 28,
        'Name': 'chevrolet cavalier',
        'Origin': 'USA',
        'Weight_in_lbs': 2605,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18.6,
        'Cylinders': 4,
        'Displacement': 112,
        'Horsepower': 88,
        'Miles_per_Gallon': 27,
        'Name': 'chevrolet cavalier wagon',
        'Origin': 'USA',
        'Weight_in_lbs': 2640,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 112,
        'Horsepower': 88,
        'Miles_per_Gallon': 34,
        'Name': 'chevrolet cavalier 2-door',
        'Origin': 'USA',
        'Weight_in_lbs': 2395,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.2,
        'Cylinders': 4,
        'Displacement': 112,
        'Horsepower': 85,
        'Miles_per_Gallon': 31,
        'Name': 'pontiac j2000 se hatchback',
        'Origin': 'USA',
        'Weight_in_lbs': 2575,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16,
        'Cylinders': 4,
        'Displacement': 135,
        'Horsepower': 84,
        'Miles_per_Gallon': 29,
        'Name': 'dodge aries se',
        'Origin': 'USA',
        'Weight_in_lbs': 2525,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 27,
        'Name': 'pontiac phoenix',
        'Origin': 'USA',
        'Weight_in_lbs': 2735,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 92,
        'Miles_per_Gallon': 24,
        'Name': 'ford fairmont futura',
        'Origin': 'USA',
        'Weight_in_lbs': 2865,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 20.5,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': null,
        'Miles_per_Gallon': 23,
        'Name': 'amc concord dl',
        'Origin': 'USA',
        'Weight_in_lbs': 3035,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.3,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 74,
        'Miles_per_Gallon': 36,
        'Name': 'volkswagen rabbit l',
        'Origin': 'Europe',
        'Weight_in_lbs': 1980,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18.2,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 68,
        'Miles_per_Gallon': 37,
        'Name': 'mazda glc custom l',
        'Origin': 'Japan',
        'Weight_in_lbs': 2025,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.6,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 68,
        'Miles_per_Gallon': 31,
        'Name': 'mazda glc custom',
        'Origin': 'Japan',
        'Weight_in_lbs': 1970,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.7,
        'Cylinders': 4,
        'Displacement': 105,
        'Horsepower': 63,
        'Miles_per_Gallon': 38,
        'Name': 'plymouth horizon miser',
        'Origin': 'USA',
        'Weight_in_lbs': 2125,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.3,
        'Cylinders': 4,
        'Displacement': 98,
        'Horsepower': 70,
        'Miles_per_Gallon': 36,
        'Name': 'mercury lynx l',
        'Origin': 'USA',
        'Weight_in_lbs': 2125,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 88,
        'Miles_per_Gallon': 36,
        'Name': 'nissan stanza xe',
        'Origin': 'Japan',
        'Weight_in_lbs': 2160,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 107,
        'Horsepower': 75,
        'Miles_per_Gallon': 36,
        'Name': 'honda Accelerationord',
        'Origin': 'Japan',
        'Weight_in_lbs': 2205,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.9,
        'Cylinders': 4,
        'Displacement': 108,
        'Horsepower': 70,
        'Miles_per_Gallon': 34,
        'Name': 'toyota corolla',
        'Origin': 'Japan',
        'Weight_in_lbs': 2245,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 67,
        'Miles_per_Gallon': 38,
        'Name': 'honda civic',
        'Origin': 'Japan',
        'Weight_in_lbs': 1965,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.7,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 67,
        'Miles_per_Gallon': 32,
        'Name': 'honda civic (auto)',
        'Origin': 'Japan',
        'Weight_in_lbs': 1965,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.2,
        'Cylinders': 4,
        'Displacement': 91,
        'Horsepower': 67,
        'Miles_per_Gallon': 38,
        'Name': 'datsun 310 gx',
        'Origin': 'Japan',
        'Weight_in_lbs': 1995,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 16.4,
        'Cylinders': 6,
        'Displacement': 181,
        'Horsepower': 110,
        'Miles_per_Gallon': 25,
        'Name': 'buick century limited',
        'Origin': 'USA',
        'Weight_in_lbs': 2945,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17,
        'Cylinders': 6,
        'Displacement': 262,
        'Horsepower': 85,
        'Miles_per_Gallon': 38,
        'Name': 'oldsmobile cutlass ciera (diesel)',
        'Origin': 'USA',
        'Weight_in_lbs': 3015,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.5,
        'Cylinders': 4,
        'Displacement': 156,
        'Horsepower': 92,
        'Miles_per_Gallon': 26,
        'Name': 'chrysler lebaron medallion',
        'Origin': 'USA',
        'Weight_in_lbs': 2585,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 14.7,
        'Cylinders': 6,
        'Displacement': 232,
        'Horsepower': 112,
        'Miles_per_Gallon': 22,
        'Name': 'ford granada l',
        'Origin': 'USA',
        'Weight_in_lbs': 2835,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 13.9,
        'Cylinders': 4,
        'Displacement': 144,
        'Horsepower': 96,
        'Miles_per_Gallon': 32,
        'Name': 'toyota celica gt',
        'Origin': 'Japan',
        'Weight_in_lbs': 2665,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 13,
        'Cylinders': 4,
        'Displacement': 135,
        'Horsepower': 84,
        'Miles_per_Gallon': 36,
        'Name': 'dodge charger 2.2',
        'Origin': 'USA',
        'Weight_in_lbs': 2370,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 17.3,
        'Cylinders': 4,
        'Displacement': 151,
        'Horsepower': 90,
        'Miles_per_Gallon': 27,
        'Name': 'chevrolet camaro',
        'Origin': 'USA',
        'Weight_in_lbs': 2950,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 15.6,
        'Cylinders': 4,
        'Displacement': 140,
        'Horsepower': 86,
        'Miles_per_Gallon': 27,
        'Name': 'ford mustang gl',
        'Origin': 'USA',
        'Weight_in_lbs': 2790,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 24.6,
        'Cylinders': 4,
        'Displacement': 97,
        'Horsepower': 52,
        'Miles_per_Gallon': 44,
        'Name': 'vw pickup',
        'Origin': 'Europe',
        'Weight_in_lbs': 2130,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 11.6,
        'Cylinders': 4,
        'Displacement': 135,
        'Horsepower': 84,
        'Miles_per_Gallon': 32,
        'Name': 'dodge rampage',
        'Origin': 'USA',
        'Weight_in_lbs': 2295,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 18.6,
        'Cylinders': 4,
        'Displacement': 120,
        'Horsepower': 79,
        'Miles_per_Gallon': 28,
        'Name': 'ford ranger',
        'Origin': 'USA',
        'Weight_in_lbs': 2625,
        'Year': '1982-01-01T00:00:00'
      },
      {
        'Acceleration': 19.4,
        'Cylinders': 4,
        'Displacement': 119,
        'Horsepower': 82,
        'Miles_per_Gallon': 31,
        'Name': 'chevy s-10',
        'Origin': 'USA',
        'Weight_in_lbs': 2720,
        'Year': '1982-01-01T00:00:00'
      }
    ]
  }
};

export const moviesAltairPreset = {
  'config': {'view': {'width': 400, 'height': 300}},
  'data': {
    'url': 'https://vega.github.io/vega-datasets/data/movies.json',
    'format': {'type': 'json'}
  },
  'mark': 'circle',
  'encoding': {
    'size': {'type': 'quantitative', 'aggregate': 'count'},
    'x': {'type': 'quantitative', 'bin': true, 'field': 'IMDB_Rating'},
    'y': {
      'type': 'quantitative',
      'bin': true,
      'field': 'Rotten_Tomatoes_Rating'
    }
  },
  '$schema': 'https://vega.github.io/schema/vega-lite/v2.6.0.json'
};