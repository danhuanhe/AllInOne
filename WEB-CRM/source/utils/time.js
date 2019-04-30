/**
 * @module utils/time
 */
/* eslint-disable no-console */
import format from 'date-fns/format';
import classNames from 'classnames';
import differenceInDays from 'date-fns/difference_in_days';
import isSameYear from 'date-fns/is_same_year';

/**
 * 时间戳转换
 * @method getTimeStamp
 * @param {number} timestamp 时间戳
 * @param {number} showSecond 秒
 * @returns {string} - 特定规则的时间显示
 */
export const getTimeStamp = (timestamp, showSecond = false) => {
  //当日
  const today = new Date().setHours(0, 0, 0, 0);
  const diffTime = timestamp - today;

  //当年
  const toYear = new Date(`${new Date().getFullYear()}-01-01`).setHours(0, 0, 0, 0);
  const diffDate = timestamp - toYear;

  const oneDay = 24 * 60 * 60 * 1000;

  // 今天
  if (timestamp >= today && Math.abs(diffTime) <= oneDay) {
    return `今天 ${format(timestamp, `HH:mm${showSecond ? ':ss' : ''}`)}`;
    // 昨天
  } else if (timestamp < today && Math.abs(diffTime) <= oneDay) {
    return `昨天 ${format(timestamp, `HH:mm${showSecond ? ':ss' : ''}`)}`;
    // 今年
  } else if (timestamp >= toYear && Math.abs(diffDate) <= oneDay * 365) {
    return format(timestamp, `MM-DD HH:mm${showSecond ? ':ss' : ''}`);
    // 其余
  } else {
    return format(timestamp, `YYYY-MM-DD HH:mm${showSecond ? ':ss' : ''}`);
  }
};

// 获取动态classNames
export const getDynamicCls = (clsArr, addCls, condition) => {
  let clsObj = {};
  if (typeof clsArr === 'string') {
    clsArr = [clsArr];
  }
  clsArr.forEach((item) => {
    clsObj[item] = true;
  });
  if (addCls && condition()) {
    clsObj[addCls] = true;
  }
  return classNames(clsObj);
};

/**
 * 将时间转换为时间段
 * @method getBizDateRange
 * @param {number|string|object} param - 当传入参数为数字N，代表从过去N天到 endDate 23：59：59 的时间段,当传入参数为日期范围字符2017/10/04 ~ 2017/11/10，代表 开始时间 ~ 结束时间
 * @returns {array| * } - [开始时间，结束时间]
 */
export const getBizDateRange = (param) => {
  let startTime = 0;
  let endTime = 0;
  if (Object.prototype.toString.call(param) === "[object Object]") {
    if ("days" in param && "until" in param) {
      const N = param.days;
      const until = param.until;
      // 今天的23:59:59
      const today = new Date().setHours(23, 59, 59, 999);
      // 昨天的23:59:59
      const yesterday = new Date().setHours(0, 0, 0, 0) - 1;
      // 前天的23:59:59
      const beforeYesterday = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0) - 1;

      if (until === '前天') {
        startTime = new Date(new Date().setDate(new Date().getDate() - N - 1)).setHours(0, 0, 0, 0);
        endTime = beforeYesterday;
      } else if (until === '今天') {
        startTime = new Date(new Date().setDate(new Date().getDate() - N + 1)).setHours(0, 0, 0, 0);
        endTime = today;
      } else if (until === '昨天') {
        startTime = new Date(new Date().setDate(new Date().getDate() - N)).setHours(0, 0, 0, 0);
        endTime = yesterday;
      }
    }
  } else if (Object.prototype.toString.call(param) === "[object String]") {
    let arr = param.split('~');
    if (arr && arr.length === 2) {
      startTime = new Date(arr[0]).setHours(0, 0, 0, 0);
      endTime = new Date(arr[1]).setHours(23, 59, 59, 999);
    }
  }
  return [new Date(startTime), new Date(endTime)];
};

/**
 * 由时间戳转为显示的日期
 * @method getTimeFromTimestamp
 * @param {number} startTime 开始时间
 * @param {number} endTime 终止时间
 * @returns {string | *} - 日期
 */
export const getTimeFromTimestamp = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return null;
  } else {
    return new Date(parseInt(startTime)).toLocaleDateString() + ' ~ ' + new Date(parseInt(endTime)).toLocaleDateString();
  }
};

/**
 * 获取表单横坐标
 * @method getTimePointArray
 * @description 规则:一天内：1小时/格 一天以上：1天/格
 * @param {array} currentValue
 * @returns {array}
 */
export const getTimePointArray = (currentValue) => {
  const pointArray = [];
  const perDay = 1000 * 60 * 60 * 24;
  if (currentValue[1] - currentValue[0] < perDay) {
    for (let i = 1; i <= 24; i++) {
      let startClock = `${i < 10 ? `0${i}` : i}:00`;
      pointArray.push(`${startClock}`);
    }
  } else {
    let startTime = currentValue[0];
    const endTime = currentValue[1];
    for (startTime; startTime <= endTime; startTime += perDay) {
      const day = new Date(startTime);
      const year = day.getFullYear();
      const month = day.getMonth() + 1;
      const date = day.getDate();
      pointArray.push(`${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`);
    }
  }
  return pointArray;
};

/**
 * @method getTimeRange 获取时间范围的表示
 * @param {number} startTime
 * @param {number} endTime
 * @returns {string} str - 如：2018.04.20-04.30（10天）
 */
export const getTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  const diffDays = Math.abs(differenceInDays(startTime, endTime)) + 1;
  return `${format(startTime, 'YYYY.MM.DD')}-${format(endTime, isSameYear(startTime, endTime) ? 'MM.DD' : 'YYYY.MM.DD')}（${diffDays}天）`;
};
