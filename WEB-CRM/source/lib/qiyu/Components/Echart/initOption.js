/**
 * 根据配置生成Echart直接能够使用的option
 * @type {String}
 */

import _ from 'lodash';

import {
  day2hourlable,
  number2fixed,
  timesection2daylabel,
  timestamp2date,
  crossYears,
  WEEK_MAP,
  DAY,
  isToday,
  isYesterday
} from '../../utils';

/**
 * 线图Series使用的颜色，按顺序使用，譬如图表有三个系列，
 * 颜色依次指定为ECHART_SERIES_COLORS[0],ECHART_SERIES_COLORS[1],ECHART_SERIES_COLORS[2]
 * 后续如果需要，继续增加
 * @type {Array}
 */
export const  ECHART_SERIES_COLORS = new Proxy([
  '#337EFF',
  '#26BD71',
  '#FFAF0F',
  'rgba(242, 166, 84,1)',
  'rgba(28, 112, 153,1)',
  'rgba(87, 199, 212, 1)',
  'rgba(249,104,104,1)',
  'rgba(141, 102, 88, 1)',
  'rgba(103,122,228,1)',
], {
  get: function(target, index){
    return target[index % target.length];
  }
});

export const ECHART_REQUEST_PARAMS = 'ECHART_REQUEST_PARAMS';

/**
 * 满意度图表配置
 * @type {Object}
 */
export const ECHART_SATISFITION_CONFIG = {
  verySatisfied: {
    name: '非常满意',
    color: ECHART_SERIES_COLORS[0]
  },
  satisfied: {
    name: '满意',
    color: ECHART_SERIES_COLORS[1]
  },
  normal: {
    name: '一般',
    color: ECHART_SERIES_COLORS[2]
  },
  unsatisfied: {
    name: '不满意',
    color: ECHART_SERIES_COLORS[3]
  },
  veryUnsatisfied: {
    name: '非常不满意',
    color: ECHART_SERIES_COLORS[4]
  },
  unevaluated: {
    name: '未评价',
    color: ECHART_SERIES_COLORS[5]
  }
};

/**
 * 问题解决率图表配置
 * @type {Object}
 */
export const ECHART_STAFFRESOLVED_CONFIG = {
  resolved: {
    name: '已解决',
    color: ECHART_SERIES_COLORS[0]
  },
  unresolved: {
    name: '未解决',
    color: ECHART_SERIES_COLORS[1]
  }
};

/**
 * 获取百分比
 * @param  {[type]}   key                 字段名   'resolved'
 * @param  {[type]}   data                数据 {resolve:12,unresolved:5}
 * @param  {Number}   [fixed=0]           精确位数
 * @param  {function} [selector = v => v] 值嵌套在内层时使用，如 v => v.amount
 * @return {[type]}                       12/(12+5)
 */
export const getRatio = (key, data, fixed = 0, selector = v => v) => {
  const sum = _.sumBy(_.values(data), selector); //计算总值
  return ((selector(data[key]) / sum) * 100).toFixed(fixed);
};

/**
 * 根据图表配置和图表数据生成饼图直接可用的option
 * @param  {[type]} config        [description]图表的业务层级配置
 * @param  {[type]} config        [description]
 * @param  {Array}   [series=[]}] 饼图的数据序列
 * series[0].name 序列名
 * series[0].color 序列颜色
 * series[0].field 序列对应data中的数据字段
 * series[0].fixed 该序列需要精确到的小数点位数
 * @param  {[type]} [formatter= ] [description]tooltip的格式化函数
 * @param  {String} [radius='70%'}] [description]
 * @param  {[type]} data          [description]
 * @return {[type]}               [description]
 */
export const initPieOption = ({
  config,
  config: {
    series = [],
    formatter = p => `${p.data.legend}${p.data.value}个(${p.data.name})`,
    radius = '70%'
  },
  title,
  data
}, options = {}) => {
  if (_.sum(_.values(data)) === 0)
    return false; //所有值都为0,图表显示暂无数据

  let labelLineCount = 0;
  const seriesData = config.series.filter(s => data[s.field] !== undefined).map(({field, fixed, name, color, ...others}) => {
    const ratio = getRatio(field, data, fixed);
    if (ratio < 5 && ratio >= 1)
      labelLineCount++;
    const d = {
      name: ratio + '%',
      legend: name,
      value: data[field],
      itemStyle: {
        color: color
      },
      label: {
        show: ratio != 0,
        position: ratio < 5 && ratio >= 1
          ? 'outer'
          : 'inner'
      },
      labelLine: {
        show: ratio < 5 && ratio >= 1,
        length: 0
      },
      ...others
    };
    return d;
  });

  // 解决labelLine特别多的时候显示不下的情况
  if (labelLineCount > 15) {
    radius = '40%';
  } else if (labelLineCount > 10) {
    radius = '50%';
  } else if (labelLineCount > 5) {
    radius = '58%';
  } else if (labelLineCount > 2) {
    radius = '63%';
  } else if (labelLineCount > 0) {
    radius = '66%';
  }

  const option = {
    "tooltip": {
      "show": true,
      "trigger": "item",
      position: function(p) { //调整tooltip位置，解决tooltip很快消失的问题，p为当前鼠标的位置
        return [
          p[0] + 15,
          p[1] - 4
        ];
      },
      formatter: formatter
    },
    title: title
      ? {
        text: title,
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.65)',
          fontFamily: '"Monospace Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
        }
      }
      : {},
    "series": [
      {
        "type": "pie",
        "radius": radius,
        "center": [
          "50%", "50%"
        ],
        "itemStyle": {
          "borderWidth": 2,
          "borderColor": "#fff"
        },
        "data": seriesData
      }
    ],
    ...options
  };
  return option;
};


/**
 * 生成饼图的option，呼叫中心重构中的样式，之后其它地方会陆续使用
 * 第一个参数就是echarts的options参数，可以根据需要自己进行相应配置，这里会默认配置一些参数，你传进来的参数会覆盖相应的默认参数
 * 第二个参数也是个Object，用于一些额外的配置，目前只有一项：
 * @param  {func}   showLabel   回调函数，判断每一条数据的label是否显示。默认逻辑是只显示由大到小Top10的且占比大于1%的。
 */
export const initPieOption_new = ({
  // echarts的options参数
  series: {
    data: seriesData,
    label: {
      normal: {
        rich = {},
        ...otherNormalOptions
      } = {},
      ...otherLabelOptions
    } = {},
    ...otherSeriesOptions
  } = {},
  tooltip: {
    show = false,
    ...otherTooltipOptions
  } = {},
  radius = '60%',
  title,
  title: {
    text,
    ...otherTitleOptions
  } = {},
  ...otherOptions,
}, {
  // 额外参数
  showLabel = (data, index, valueSum) => data.value / valueSum > .01 && index < 10
} = {}) => {
  if (seriesData.length < 1) return false;

  let valueSum = seriesData.reduce((pre, cur) => pre + cur.value, 0);
  seriesData = seriesData.sort((d1, d2) => d2.value - d1.value);
  seriesData.forEach((data, i) => {
    if (!_.get(data, '.itemStyle.color')) {
      data.itemStyle = {
        ...data.itemStyle,
        color: ECHART_SERIES_COLORS[i]
      };
    }
    const show = showLabel(data, i, valueSum);
    data.label = show ? {
      show,
      // lable目前不像tooltip那样支持html，能设置的样式有限
      normal: {
        formatter: ({data: {name, value, chain}, percent}) => {
          if (name.length > 8) {
            name = `${name.slice(0, 7)}...`;
          }

          const arr = [
            `{top|${name}}`,
            `{hr|}`,
            `{left|数量}  {right|${number2fixed(value, 0)}个}`,
            `{left|占比}  {rightWithBg|${percent}%}{space|}`,
          ];

          if (chain != undefined) {
            if (chain > 9.99) chain = '>999';
            else if (chain < -9.99) chain = '<999';
            else chain = parseFloat((chain * 100).toFixed(2));
          
            arr.push(`{left|环比}  {rightWithBg|${chain}%}{space|}`);
          }

          return arr.join('\n');
        },
        backgroundColor: 'white',
        color: '#333',
        borderColor: '#E1E3E6',
        borderWidth: 1,
        borderRadius: 2,
        lineHeight: 20,
        shadowColor: 'rgba(23,23,26,0.10)',
        shadowBlur: 6,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        padding: [0, 0, 2, 0],
        rich: {
          top: {
            align: 'center',
            color: '#333',
            fontSize: 12,
            width: 100
          },
          hr: {
            borderColor: '#E1E3E6',
            width: '100%',
            borderWidth: 0.5,
            height: 0,
            lineHeight: 0,
          },
          left: {
            align: 'left',
            color: '#333',
            fontSize: 12,
            padding: [0, 0, 0, 5]
          },
          right: {
            align: 'right',
            color: '#333',
            fontSize: 12,
            padding: [0, 5, 0, 0]
          },
          rightWithBg: {
            align: 'right',
            color: 'white',
            borderRadius: 2,
            backgroundColor: '#666',
            padding: [2, 3],
            fontSize: 11,
          },
          space: {
            width: 5,
            align: 'right',
          },
          ...rich
        },
        ...otherNormalOptions
      },
      ...otherLabelOptions,
    } : {show},
    data.labelLine = {
      show,
      lineStyle: show ? {} : {
        color: 'white'
      }
    };
  });

  const option = {
    tooltip: {
      show,
      ...otherTooltipOptions
    },
    title: title ? {} : {
      text,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.65)',
        fontFamily: '"Monospace Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
      },
      ...otherTitleOptions,
    },
    series: {
      type: 'pie',
      radius,
      cursor: 'normal',
      center: [
        '50%', '50%'
      ],
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff'
      },
      data: seriesData,
      ...otherSeriesOptions
    },
    ...otherOptions
  };

  return option;
};

/**
 * 生成环形图的option
 * 第一个参数就是echarts的options参数，可以根据需要自己进行相应配置，这里会默认配置一些参数，你传进来的参数会覆盖相应的默认参数
 * 第二个参数也是个Object，用于一些额外的配置，目前只有一项：
 * @param  {func}   showLabel   回调函数，判断每一条数据的label是否显示。默认逻辑是只显示由大到小Top10的且占比大于1%的。
 */
export const initDoughnutOption = ({
  // echarts的options参数
  series: {
    data: seriesData,
    label: {
      normal: {
        rich = {},
        ...otherNormalOptions
      } = {},
      ...otherLabelOptions
    } = {},
    ...otherSeriesOptions
  } = {},
  tooltip: {
    show = false,
    ...otherTooltipOptions
  } = {},
  radius = ['42%', '60%'],
  title,
  title: {
    text,
    ...otherTitleOptions
  } = {},
  ...otherOptions,
},  {
  // 额外参数
  showLabel = (data, index, valueSum) => data.value / valueSum > .01 && index < 10
} = {}) => {
  if (seriesData.length < 1) return false;

  let valueSum = seriesData.reduce((pre, cur) => pre + cur.value, 0);
  seriesData = seriesData.sort((d1, d2) => d2.value - d1.value);
  seriesData.forEach((data, i) => {
    if (!_.get(data, '.itemStyle.color')) {
      data.itemStyle = {
        ...data.itemStyle,
        color: ECHART_SERIES_COLORS[i]
      };
    }
    const show = showLabel(data, i, valueSum);
    data.label = show ? {
      show,
      normal: {
        formatter: ({data: {name, value, chain, clickable}, percent}) => {
          if (name.length > 8) {
            name = `${name.slice(0, 7)}...`;
          }

          const arr = [
            `{top|${name}}`,
            `{hr|}`,
            `{left|数量}  {right|${number2fixed(value, 0)}个}`,
            `{left|占比}  {rightWithBg|${percent}%}{space|}`,
          ];

          if (chain != undefined) {
            if (chain > 9.99) chain = '>999';
            else if (chain < -9.99) chain = '<999';
            else chain = parseFloat((chain * 100).toFixed(2));
            arr.push(`{left|环比}  {rightWithBg|${chain}%}{space|}`);
          }

          return arr.join('\n');
        },
        backgroundColor: 'white',
        color: '#333',
        borderColor: '#E1E3E6',
        borderWidth: 1,
        borderRadius: 2,
        lineHeight: 20,
        shadowColor: 'rgba(23,23,26,0.10)',
        shadowBlur: 6,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        padding: [0, 0, 2, 0],
        rich: {
          top: {
            align: 'center',
            color: '#333',
            fontSize: 12,
            width: 100
          },
          hr: {
            borderColor: '#E1E3E6',
            width: '100%',
            borderWidth: 0.5,
            height: 0,
            lineHeight: 0,
          },
          left: {
            align: 'left',
            color: '#333',
            fontSize: 12,
            padding: [0, 0, 0, 5]
          },
          right: {
            align: 'right',
            color: '#333',
            fontSize: 12,
            padding: [0, 5, 0, 0]
          },
          rightWithBg: {
            align: 'right',
            color: 'white',
            borderRadius: 2,
            backgroundColor: '#666',
            padding: [2, 3],
            fontSize: 11,
          },
          space: {
            width: 5,
            align: 'right',
          },
          ...rich
        },
        ...otherNormalOptions
      },
      ...otherLabelOptions,
    } : {show},
    data.labelLine = {
      show,
      lineStyle: show ? {} : {
        color: 'white'
      }
    };
  });

  const option = {
    tooltip: {
      show,
      ...otherTooltipOptions
    },
    title: title ? {} : {
      text,
      left: 'center',
      bottom: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.65)',
        fontFamily: '"Monospace Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
      },
      ...otherTitleOptions,
    },
    series: {
      type: 'pie',
      radius,
      center: [
        '50%', '50%'
      ],
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff'
      },
      data: seriesData,
      ...otherSeriesOptions
    },
    ...otherOptions
  };

  return option;
};

/**
 * 根据图表配置和图表数据生成图表直接可用的option
 * @param  {[type]}  config                [description] 图表的业务层级配置
 * @param  {[type]}  config                [description]
 * @param  {String} [type=line]       [description] 类型 bar
 * @param  {Array}   [series=[]                          }] 线性图的数据序列
 * series[0].name 序列名
 * series[0].color 序列颜色
 * series[0].field 序列对应data中的数据字段
 * series[0].fixed 该序列需要精确到的小数点位数
 * @param  {[type]}  data                  [description] 图表的数据
 * @return {[type]}                        [description]
 */
export const initHorizontalLineOption = ({
  config,
  config: {
    type = 'bar',
    markPoint = false,
    markLine = false,
    yAxisLabel = [],
    series = []
  },
  data = []
}) => {

  const sum = _.sum(data[series[0].field]);
  const option = {
    "grid": {
      "x": 80,
      "y": 0,
      "x2": 70,
      "y2": 0,
      "borderWidth": 0
    },
    "xAxis": [
      {
        "type": "value",
        "max": sum,
        "splitNumber": sum,
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#CCCCCC",
            "width": 1,
            "type": "solid"
          }
        },
        "splitLine": {
          "show": false
        },
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "show": false,
          "textStyle": {
            "color": "#666"
          }
        }
      }
    ],
    "yAxis": [
      {
        "type": "category",
        "data": yAxisLabel,
        "axisLine": {
          "show": false
        },
        "axisTick": {
          "show": false
        },
        "splitArea": {
          "show": false
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": "rgb(240, 243, 237)"
          }
        },
        "axisLabel": {
          "show": true,
          "textStyle": {
            "color": "#666"
          },
          "margin": 20
        }
      }, {
        "type": "category",
        "axisLine": {
          "show": false
        },
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "show": true,
          "textStyle": {
            "color": "#666"
          },
          formatter: value => value + '%',
          "margin": 20
        },
        "splitArea": {
          "show": false
        },
        "splitLine": {
          "show": false
        },
        "data": data[series[0].field].map(d => {
          if (sum == 0)
            return 0;
          else
            return Math.round((d / sum) * 100);
          }
        )
      }
    ],
    "series": series.map(({
      name,
      color,
      field,
      fixed = 0
    }, index) => {
      const ss = {
        name,
        type,
        stack: 'sum',
        barWidth: 10,
        yAxisIndex: index,
        data: data[field].map(d => d.toFixed(fixed)),
        itemStyle: {
          normal: {
            color,
            label: {
              show: false
            }
          }
        }
      };

      if (markPoint) {
        ss['markPoint'] = {
          data: [
            {
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }
          ]
        };
      }

      if (markLine) {
        ss['markLine'] = {
          data: [
            {
              type: 'average',
              name: '平均值'
            }
          ]
        };
      }

      return ss;
    })
  };

  return option;
};

/**
 * 根据图表配置和图表数据生成图表直接可用的option
 * @param  {[type]}  config                [description] 图表的业务层级配置
 * @param  {[type]}  config                [description]
 * @param  {String} [type=line]       [description] 类型 line bar
 * @param  {Object|Boolean} [isRatio={left: false, right: false}]   左右轴是否是百分值。如果传进来的是Boolean类型，则表示左右y轴都为该值
 * @param  {Boolean} [showToolbox=false]   [description] 是否显示工具条
 * @param  {Boolean} [showRightYAxis=false]   [description] 是否显示右侧y轴
 * @param  {Array}   [series=[]                          }] 线性图的数据序列
 * 当有左右两个y轴时，可在series中每个对象里设置yAxisIndex的值，0为对应左轴，1位对应右轴（就是echart本身的配置项）
 *
 * series[0].name 序列名
 * series[0].color 序列颜色
 * series[0].field 序列对应data中的数据字段
 * series[0].fixed 该序列需要精确到的小数点位数
 * @param  {[type]}  data                  [description] 图表的数据
 * @param  {[type]}  data                  [description]
 * @param  {[type]}  ECHART_REQUEST_PARAMS [description] 图表数据对应的请求参数
 * @param  {Number}  [startTime=0]         [description]
 * @param  {[type]}  [endTime=0                                           }  }}] [description]
 * @return {[type]}                        [description]
 */
export const initLineOption = ({
  config,
  config: {
    type = 'line',
    isRatio = {left: false, right: false},
    showToolbox = false,
    showRightYAxis = false,
    grid = {},
    series = [],
    boundaryGap = false,
  },
  data,
  data: {
    ECHART_REQUEST_PARAMS,
    ECHART_REQUEST_PARAMS: {
      inHour = 0,
      startTime = 0,
      endTime = 0
    }
  }
}) => {
  if (typeof isRatio === 'boolean') {
    isRatio = {left: isRatio, right: isRatio};
  }
  let hasBarType = type === 'bar' || series.some(s => s.type === 'bar');
  const option = {
    "legend": {
      "bottom": 0,
      "data": series.map(s => s.name),
      "itemGap": 20,
      "padding": 0
    },
    "tooltip": {
      "axisPointer": {
        "type": "shadow",
        "shadowStyle": {
          "color": "rgba(204,213,216,0.5)",
          "type": "default"
        }
      },
      "borderWidth": 0,
      "padding": 0,
      "trigger": "axis",
      formatter: params => {

        const format = ['<div class="m-tooltip-chart">'];

        if (inHour) { //以小时为纬度显示
          let label = '';
          let labelR = params[0].name.replace(/^\d{1,2}/, function(item) {
            return (Number(item) - 1) + ':00 - ' + item;
          });
          if (endTime - startTime <= DAY) { //当天时间范围的
            label = timestamp2date(endTime, 'yyyy.MM.dd');
            if (isToday(endTime)) {
              label += '(今天)';
            } else if (isYesterday(endTime)) {
              label += '(昨天)';
            } else {
              label += `(${WEEK_MAP[new Date(endTime).getDay()]})`;
            }
          }

          format.push(`<div class="tooltip_title"><span class="left">${label}</span><span class="right">${labelR}</span></div>`);

        } else {
          let names = params[0].name.split('/');
          if (!crossYears(startTime, endTime)) //如果没有跨年，把年份补上
            names.unshift(new Date(endTime).getFullYear());

          let name = names.join('-');

          format.push(`<div class="tooltip_title"><span class="left">${name}(${WEEK_MAP[new Date(name).getDay()]})</span ></div>`);

        }
        params.forEach(function(item, index) {
          const yAxisIndex = _.get(series, `${index}.yAxisIndex`, 0);
          let showRatio = isRatio.left;
          if (yAxisIndex === 1) {
            showRatio = isRatio.right;
          }
          format.push(
            `<div class="tooltip_title tooltip_item">
              <span class="left">${item.seriesName}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span class="right" style="background-color:${item.color}"> ${item.value}${showRatio
            ? '%'
            : ''} </span>
            </div>`);
        });

        format.push('</div>');
        return format.join('');
      }
    },
    "grid": {
      "borderWidth": 0,
      "x": 60,
      "y": 50,
      "x2": showRightYAxis ? 60 : 30,
      "y2": 60,
      "boundaryGap": false,
      ...grid
    },
    "xAxis": [
      {
        "type": "category",
        "boundaryGap": boundaryGap != undefined ? boundaryGap : hasBarType, // 柱状图需要两侧留Gap，否则会溢出去
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#e6e6e6",
            "width": 1,
            "type": "solid"
          }
        },
        "axisLabel": {
          "show": true,
          "textStyle": {
            "color": "#666"
          }
        },
        "axisTick": {
          "show": false
        },
        "splitArea": {
          "show": false
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": "#e6e6e6",
            "type": "dotted"
          }
        },
        "data": inHour
          ? day2hourlable()
          : timesection2daylabel(startTime, endTime)
      }
    ],
    "yAxis": [
      {
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#e6e6e6",
            "width": 0,
            "type": "solid"
          }
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": "#e6e6e6",
            "width": 1,
            "type": "dotted"
          }
        },
        "axisLabel": {
          "show": true,
          "textStyle": {
            "color": "#666"
          },
          formatter: value => isRatio.left
            ? value + '%'
            : value
        },
        "type": "value"
      },
    ],
    "series": config.series.map(({
      name,
      field,
      color,
      fixed,
      ...others
    }, index) => {
      let showRatio = isRatio.left;
      if (others && others.yAxisIndex === 1) {
        showRatio = isRatio.right;
      }
      const ss = {
        name,
        type: type,
        data: data[field].map(d => {
          if (showRatio)
            d = d * 100;
          return d.toFixed(fixed || 0);
        }),
        color,
        smooth: true,
        symbol: 'emptycircle',
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: color,
            lineStyle: {
              width: 3
            }
          }
        },
        z: config.series.length - index,
        ...others
      };

      if (config.markPoint) {
        ss['markPoint'] = {
          data: [
            {
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }
          ]
        };
      }

      if (config.markLine) {
        ss['markLine'] = {
          data: [
            {
              type: 'average',
              name: '平均值'
            }
          ]
        };
      }

      return ss;
    }),
    "toolbox": {
      "show": showToolbox,
      "right": 22,
      "feature": {
        "magicType": {
          "type": ["line", "bar"]
        }
      }
    }
  };

  if (showRightYAxis) {
    option.yAxis.push({
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#e6e6e6",
          "width": 0,
          "type": "solid"
        }
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": "#e6e6e6",
          "width": 1,
          "type": "dotted"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#666"
        },
        formatter: value => isRatio.right
            ? value + '%'
            : value
      },
      "type": "value"
    });
  }
  return option;
};
