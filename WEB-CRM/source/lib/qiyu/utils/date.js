/**
 * 所有与时间相关的通用方法写这里
 * @type {[type]}
 */

import { paddingZero } from './number';

/**
 * 获取起止时间
 * @param startOffset [timeStamp] 距离今天的时间偏移，ms
 * @param endOffset [timeStamp] 距离今天的时间偏移，ms
 * @return {[type]} [description]
 */
export const getRangeDays = (startOffset, endOffset) => {
  return [
    DAY_BEGIN(new Date(Date.now() + startOffset)),
    DAY_END(new Date(Date.now() + endOffset)),
  ];
};

/**
 * 一天的时间长度
 * @type {[type]}
 */
export const DAY = 24 * 60 * 60 * 1000;
/**
 * 一周的时间长度
 * @type {[type]}
 */
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;

export const WEEK_MAP = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
];

/**
 * 某时刻的当天零点，也就是一天的开始
 * @param {Date} [time=new Date()] [description]
 */
export const DAY_BEGIN = (time = new Date()) => {
  if (Number.isInteger(time)) time = new Date(time);
  time.setHours(0, 0, 0, 0);
  return time;
};

/**
 * 某时刻的当天23:59:59，也就是一天的结束
 * @param {Date} [time=new Date()] [description]
 */
export const DAY_END = (time = new Date()) => {
  if (Number.isInteger(time)) time = new Date(time);
  time.setHours(23, 59, 59, 999);
  return time;
};

/**
 * 对于指定日期增加天数
 * @param {*} count 增加的天数，可以为负值或者为0
 * @param {*} time Date对象，可选 不传时使用当前时间
 */
export const addDay = (count, time = new Date()) => {
  const date = new Date(time);
  date.setDate(date.getDate() + count);
  return date;
};

/**
 *
 * @param {*} count 增加的周数，可以为负值或者为0
 * @param {*} time  Date对象，可选 不传时使用当前时间
 */
export const addWeek = (count, time = new Date()) => {
  const date = new Date(time);
  date.setDate(date.getDate() + count * 7);
  return date;
};

/**
 *
 * @param {*} count 增加的月数，可以为负值或者为0
 * @param {*} time  Date对象，可选 不传时使用当前时间
 */
export const addMonth = (count, time = new Date()) => {
  const date = new Date(time);
  date.setMonth(date.getMonth() + count);
  return date;
};

/**
 *
 * @param {*} count 增加的年数 可以为负值或者为0
 * @param {*} time Date对象，可选，不传时使用当前时间
 */
export const addYear = (count, time = new Date()) => {
  const date = new Date(time);
  date.setFullYear(date.getFullYear() + count);
  return date;
};

/**
 * 获取过去一天的开始时间和结束时间
 * @return {[type]} [00:00:00,23:59:59:999]
 */
export const pastDay = () => {
  return [DAY_BEGIN(addDay(-1)), DAY_END(addDay(-1))];
};
/**
 * 获取最近一天的开始时间和结束时间 包括今天
 * @return {[type]} [00:00:00,23:59:59:999]
 */
export const recentDay = () => {
  return [DAY_BEGIN(addDay(0)), DAY_END(addDay(0))];
};
export const today = recentDay;
/**
 * 获取过去一周的起止时间
 * @return {[type]} [description]
 */
export const pastWeek = () => {
  return [DAY_BEGIN(addWeek(-1)), DAY_END(addDay(-1))];
};
/**
 * 获取最近一周的起止时间，包括今天
 * @return {[type]} [description]
 */
export const recentWeek = () => {
  return [DAY_BEGIN(addDay(1, addWeek(-1))), DAY_END(addDay(0))];
};
export const lastWeek = recentWeek;
/**
 * 获取过去N个月的起止时间
 * xxxx年(xx-N)月xx日 00:00:00.000～xxxx年xx月(xx-1)日 23:59:59.999
 * @return {[type]} [description]
 */
export const pastMonth = (diff=-1) => {
  return [DAY_BEGIN(addMonth(diff)), DAY_END(addDay(-1))];
};

/**
 * 获取最近N个月的起止时间，包括今天
 * xxxx年(xx-N)月xx+1日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 * @return {[type]} [description]
 */
export const recentMonth = (diff=-1) => {
  return [DAY_BEGIN(addDay(1, addMonth(diff))), DAY_END(addDay(0))];
};

export const lastMonth = recentMonth;
/**
 * 获取过去一年的起止时间
 * @return {[type]} [description]
 */
export const pastYear = () => {
  return [DAY_BEGIN(addYear(-1)), DAY_END(addDay(-1))];
};
/**
 * 获取最近一年的起止时间，包括今天
 * @return {[type]} [description]
 */
export const recentYear = () => {
  return [DAY_BEGIN(addDay(1, addYear(-1))), DAY_END(addDay(0))];
};
export const lastYear = recentYear;

/**
 * 获取明天一天的开始时间和结束时间
 * @return {Array.Date} [00:00:00,23:59:59:999]
 */
export const tomorrow = () => {
  return [DAY_BEGIN(addDay(1)), DAY_END(addDay(1))];
};

/**
 * 获取未来一周的起止时间，包括今天
 */
export const nextWeek = () => {
  return [DAY_BEGIN(new Date()), DAY_END(addDay(6))];
};

/**
 * 获取全部的起止时间，包括今天
 */
export const alltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(new Date())];
};

/**
 * 获取全部的起止时间，不包括今天
 */
export const pastAlltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(addDay(-1))];
};

/**
 * 是否是今天
 * @param  {[type]}  time [description]
 * @return {Boolean}      [description]
 */
export const isToday = time => {
  return (
    timestamp2date(time, 'yyyy-MM-dd') ===
    timestamp2date(+new Date(), 'yyyy-MM-dd')
  );
};

/**
 * 是否是昨天
 * @param  {[type]}  time [description]
 * @return {Boolean}      [description]
 */
export const isYesterday = time => {
  return (
    timestamp2date(time, 'yyyy-MM-dd') ===
    timestamp2date(+new Date() - DAY, 'yyyy-MM-dd')
  );
};

/**
 * 时间段选择组件，默认使用的快捷选项
 * @type {Array}
 */
export const defaultShortcuts = [
  {
    text: '昨天',
    section: pastDay(),
  },
  {
    text: '过去一周',
    section: pastWeek(),
  },
  {
    text: '过去一个月',
    section: pastMonth(),
  },
];

/**
 * 获取一天24小时的时间标签
 * @return {[type]} [description]
 */
export const day2hourlable = () => {
  const hoursLabel = [];
  for (let i = 1; i < 25; i++) hoursLabel.push(i + ':00');

  return hoursLabel;
};

/**
 * 根据起止时间，转为按天的时间标签
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const timesection2daylabel = (startTime, endTime) => {
  const dayLabels = [];
  let format = 'MM/dd';
  const len = Math.ceil((endTime - startTime) / DAY); //时间区间一共跨越多少天

  if (crossYears(startTime, endTime)) {
    //如果跨越年了，显示年的标签
    format = 'yyyy/MM/dd';
  }

  for (let l = 0; l < len; l++) {
    dayLabels.push(timestamp2date(startTime + l * DAY, format));
  }

  return dayLabels;
};

/**
 * 判断两个时间戳是否跨年了
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const crossYears = (startTime, endTime) => {
  return new Date(endTime).getFullYear() !== new Date(startTime).getFullYear();
};

/**
 * 时间戳转为日期的格式
 * @param value
 * @param format  可选 默认 'yyyy-MM-dd HH:mm'
 * @returns {*}
 */
export const timestamp2date = (value, format = 'yyyy-MM-dd HH:mm') => {
  if (!value) return '--';

  let maps = {
    yyyy: function(date) {
      return date.getFullYear();
    },
    MM: function(date) {
      return paddingZero(date.getMonth() + 1);
    },
    dd: function(date) {
      return paddingZero(date.getDate());
    },
    HH: function(date) {
      return paddingZero(date.getHours());
    },
    mm: function(date) {
      return paddingZero(date.getMinutes());
    },
    ss: function(date) {
      return paddingZero(date.getSeconds());
    },
  };

  let trunk = new RegExp(Object.keys(maps).join('|'), 'g');

  value = new Date(value || +new Date());

  return format.replace(trunk, function(capture) {
    return maps[capture] ? maps[capture](value) : '';
  });
};

/**
 * 时间戳转为固定日期格式：今年显示'MM-dd HH:mm', 非今年显示'yyyy-MM-dd HH:mm'
 * @param value
 * @param formatFromMonth 'MM-dd HH:mm:ss'
 * @param abbr 是否缩写成"昨天", "今天"
 * @returns {*}
 */
export const timestamp2fixedDate = (
  value,
  formatFromMonth = 'MM-dd HH:mm',
  abbr = false,
) => {
  if (!value) return '--';

  const nowTime = new Date().getTime();
  // 跨年
  if (crossYears(value, nowTime)) {
    return timestamp2date(value, `yyyy-${formatFromMonth}`);
  } else if (abbr) {
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();
    const nowDate = new Date().getDate();
    const newValue = new Date(value);
    const formatFromHour = formatFromMonth.replace(/^.+HH/, 'HH');
    // 同日
    if (
      nowYear === newValue.getFullYear() &&
      nowMonth === newValue.getMonth() &&
      nowDate === newValue.getDate()
    ) {
      return `今天 ${timestamp2date(value, formatFromHour)}`;
      // 昨日
    } else if (
      nowYear === newValue.getFullYear() &&
      nowMonth === newValue.getMonth() &&
      nowDate === newValue.getDate() + 1
    ) {
      return `昨天 ${timestamp2date(value, formatFromHour)}`;
    }
  }
  // 格式化日期
  return timestamp2date(value, formatFromMonth);
};

/**
 * 待废弃，使用timestamp2fixedDate(value, 'MM-dd HH:mm', true) 替代
 * 时间戳转为固定日期格式：今年显示'MM-dd HH:mm',非今年显示'yyyy-MM-dd HH:mm',今天显示'今天 HH:mm',昨天显示'昨天 HH:mm'
 * @deprecated
 * @param value
 * @returns {*}
 */
export const timestamp2fixedDate1 = value => {
  return timestamp2fixedDate(value, 'MM-dd HH:mm', true);
};
