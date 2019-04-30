/**
 * 数字相关的通用方法
 */

import _ from 'lodash';

/**
 * 把数值转化为百分比的字符串
 * @param  {Number} value         要转化的数值
 * @param  {Number} [fix=1]       保留的位数
 * @param  {String} [format='--']  值不存在时，显示的内容
 * @return {String}
 */
export const number2ratio = (value, fix = 1, format = '--') => {

  if (value === undefined || value == -1) {
    return format;
  } else if (value * 100 > 999) {
    return '>999%';
  } else {
    return (value * 100).toFixed(fix) + '%';
  }
};

/**
 * 不满两位的整数，左侧补一个零
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export const paddingZero = (value) => {
  return _.padStart(value, 2, '0');
};

/**
 * 把数值转化为文本展示的字符串   废弃了，使用number2string
 * @param  {Number} value         要转化的数值
 * @param  {Number} [fix=2]       保留的位数 默认保留两位
 * @param  {String} [format='--']  值不存在时，显示的内容
 * @return {String}
 */
export const number2fixed = (value, fix = 2, format = '--') => {

  if (value == -1) {
    return format;
  }
  let w = value / 10000,
    remain = value % 10000,
    ww = value / 10000 / 1000;

  // 1万 到 1000 万
  if (w >= 1 && ww < 1) {
    if (remain == 0) {
      return w + '万';
    } else {
      return w.toFixed(fix) + '万';
    }
    // 大于 1000 万
  } else if (ww >= 1) {
    return Math.round(value / 10000) + '万';
    // 小于 1万
  } else {
    return value;
  }
};

/**
 * 把数值转化为文本展示的字符串   逐步替换number2fixed的
 * @param  {Number} value         要转化的数值
 * @param  {Number} [fix=2]       保留的位数 默认保留两位
 * @param  {String} [format='--']  值不存在时，显示的内容
 * @param  {String} [unit= [10000,'万']]  单位，值为1000表示以千为单位，转化为xxxK的形式。值为10000时表示万为单位，转化为xxx万的形式
 * @return {String}
 */
export const number2string = ({
  value = 0,
  fix = 2,
  format = '--',
  unit = [10000, '万']
}) => {

  if (value == -1) {
    return format;
  }
  let v = value / unit[0],
    remain = value % unit[0],
    kv = value / unit[0] / 1000;

  // 1单位 到 1000 单位
  if (v >= 1 && kv < 1) {
    if (remain == 0) {
      return v + unit[1];
    } else {
      return v.toFixed(fix) + unit[1];
    }
    // 大于 1000 单位
  } else if (kv >= 1) {
    return Math.round(v) + unit[1];
    // 小于 1单位
  } else {
    return String(value);
  }
};

/**
 * 默认的时长格式化函数 不对外暴露
 * @param  {[type]} hours                    [description]小时数
 * @param  {[type]} minutes                  [description]分钟数
 * @param  {[type]} seconds                  [description]秒数
 * @param  {String} [format='HH小时mm分ss秒']  [description] 默认格式  年：yyyy 月：MM 天：dd 小时：HH 分：mm 秒：ss
 * @return {[type]}                          [description] eg. 0,0,0=>'0秒'  0,1,15=>'1分15秒' 34,56,0=>'34小时56分0秒'
 */
const durationformatter = ({
  hours,
  minutes,
  seconds
}, format = 'HH小时mm分ss秒') => {
  let map = {
    HH: hours,
    mm: minutes,
    ss: seconds
  };

  format = format.replace(/(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g, function(value) {
    return map[value];
  }).match(/[1-9].*/);

  if (format)
    return format[0];

  return '0秒';
};

/**
 * 工作报表中使用的特殊格式化函数，当小时数大于1时，不显示秒
 * @param  {[type]} hours   [description]
 * @param  {[type]} minutes [description]
 * @param  {[type]} seconds [description]
 * @return {[type]}         [description]
 */
export const durationformatterStatistics = ({hours, minutes, seconds}) => {

  return hours >= 1
    ? durationformatter({
      hours,
      minutes,
      seconds
    }, 'HH小时mm分')
    : durationformatter({hours, minutes, seconds});

};

/**
 * 把时长的数值转化为时长
 * @param  {Number} value         要转化的数值
 * @param  {Function|String} [formatter=durationformatter]  格式化显示的函数  当fromatter为字符串时，为durationformatter的格式参数
 * @return {String}
 */
export const number2duration = (value, formatter = durationformatter) => {

  if (isNaN(value) || value <= 0)
    return '--';

  const hours = Math.floor(value / (1000 * 60 * 60));
  value = value - hours * (1000 * 60 * 60);
  const minutes = Math.floor(value / (1000 * 60));
  value = value - minutes * (1000 * 60);
  const seconds = Math.floor(value / 1000);

  return typeof formatter == 'string' ? durationformatter({hours, minutes, seconds}, formatter) : formatter({hours, minutes, seconds});

};

/**
 * 把number转成中文字符串
 * @param  {Number} num   要转化的数字
 * @return {String}       转化后的中文字符串
 */
export const number2Chinese = (num) => {
  const chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
  const chnUnitSection = ["","万","亿","万亿","亿亿"];
  const chnUnitChar = ["","十","百","千"];
  const Section2Chinese = (section) => {
    let strIns = '',
      chnStr = '';
    let unitPos = 0;
    let zero = true;
    while (section > 0) {
      let v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  };

  let unitPos = 0;
  let strIns = '',
    chnStr = '';
  let needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    let section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = Section2Chinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }

  // 如“一十二”应该为“十二”
  if (/^一十/.test(chnStr)) return chnStr.slice(1);

  return chnStr;
};
