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
}


