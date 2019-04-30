/**
 * ppfish table组件的util，用于计算scroll的x值
 * @param  {Object} columns  即传给Table的￼columns属性的值
 * @param  {Number} offset   scroll的x值应增加多少，一般用于留给自适应宽度的列，若没有则是0
 * @return {Number}
 */
export const scrollX = (columns, offset = 0) =>
  columns.reduce((prev, obj) => {
    if (obj.children) {
      return prev + scrollX(obj.children);
    }
    if (typeof obj.width === 'string' && obj.width.indexOf('%') > -1) return prev;
    return prev + Number((obj.width || '').split('px')[0]);

  }, offset);

/**
 * ppfish table 分页格式和文案
 * @param  {[type]} PAGE_SIZE [description]
 * @param  {[type]} total     [description]
 * @return {[type]}           [description]
 */
export const paginationTip = (PAGE_SIZE, total) => {
  return '每页显示' + PAGE_SIZE + '条，共' + Math.ceil(total / PAGE_SIZE) + '页，共' + total + '条';
};

/**
 * ppfish table组件的util，用于计算可隐藏列的组件的scroll的x值以及列减少到无需scroll时每一列的width
 * 这样无需设置某一列为自适应宽度（列很少时会不好看），width会自动调整
 *
 * 注意：这个util目前还是一个折中后的方案，可以避免各种极端情况或操作时ui上的bug，但请谨慎使用。
 * 建议参考web-statistics项目中WorkLoad的使用方式。
 * 注意：如果columns中有某列设置成了fixed，请在columnFiltrate的defaultColumns属性上加上相应的值，然后再使用此util。
 *
 * @param  {String|HTMLElement} ele table元素
 * @param  {Object} columns         传给Table的￼columns属性的值
 * @param  {Array} hideColumns      目前隐藏的列
 * @param  {Number} offset          scroll的x值应增加多少，一般是最右侧那个隐藏设置列的宽
 * @param  {Array} fixedWidthKeys   哪些列的宽度需要永远固定
 * @return {Number}
 */
export const FiltratedScrollXAndWidth = (ele, columns, {
  hideColumns = [],
  offset = 57,
  fixedWidthKeys = [],
} = {}) => {
  if (typeof ele === 'string') ele = document.querySelector(ele);
  const getWidthNum = (width) => Number((width || '').toString().split('px')[0]);

  // 正在展示的列
  const filteredColumns = columns.filter(({key, dataIndex}) => hideColumns.indexOf(key || dataIndex) < 0);
  // 正在展示的列中需要固定宽度的
  const filteredColumnsFixed = filteredColumns.filter(({key}) => fixedWidthKeys.includes(key));
  const curTotalWidth = filteredColumns.reduce((prev, {width}) => getWidthNum(width) + prev, 0);
  if (ele && curTotalWidth + offset < ele.offsetWidth) {
    // 列数减少到无需scroll时重新计算每列width
    let lastColumn;
    let fixedWidth = filteredColumnsFixed.reduce((prev, cur) => prev + getWidthNum(cur.width), 0);
    if (filteredColumnsFixed.length !== filteredColumns.length) {
      // 存在不需要永远固定宽度的列，计算这些列的宽度
      filteredColumns.forEach((column) => {
        if (!fixedWidthKeys.includes(column.key || column.dataIndex)) {
          column.width = (ele.offsetWidth - fixedWidth - offset) * (getWidthNum(column.width) / (curTotalWidth - fixedWidth)) + 'px';
          if (!(column.fixed)) lastColumn = column;
        }
      });
    } else {
      // 目前的列全都是需要永远固定宽度的列，因为会造成显示问题，必须重新计算宽度
      filteredColumns.forEach((column) => {
        column.width = (ele.offsetWidth - offset) / (filteredColumns.length) + 'px';
        if (!(column.fixed)) lastColumn = column;
      });
    }
    if (lastColumn) {
      // 最后一列设置成自适应宽度，防止改变浏览器宽度时出现问题
      lastColumn._widthForScrollX = getWidthNum(lastColumn.width);
      lastColumn.width = undefined;
      lastColumn.fixed = undefined;
    }
  } else {
    // 最后一列设置成自适应宽度，防止改变浏览器宽度时出现问题
    let i = filteredColumns.length - 1;
    while (filteredColumns[i].fixed) {
      i--;
    }
    let lastColumn = filteredColumns[i];
    lastColumn._widthForScrollX = getWidthNum(lastColumn.width);
    lastColumn.width = undefined;
    lastColumn.fixed = undefined;
  }

  const scrollX = filteredColumns.reduce((prev, {width, _widthForScrollX}) =>
    (_widthForScrollX || getWidthNum(width)) + prev, 0) + offset - 10;

  return scrollX;
};

/**
 * FiltratedScrollXAndWidth的纯函数版本，不修改传入的columns而是返回一个新的columns
 *
 * @param  {String|HTMLElement} ele table元素
 * @param  {Object} columns         即传给Table的￼columns属性的值
 * @param  {Object} config          配置项。见FiltratedScrollXAndWidth方法
 * @return {Object} { scrollX, newColumns}
 */
export const FiltratedScrollXAndWidthPure = (ele, columns, config) => {
  const newColumns = columns.map((column) => {
    return {...column};
  });
  const scrollX = FiltratedScrollXAndWidth(ele, newColumns, config);
  return {
    scrollX,
    newColumns
  };
};


/**
 * ppfish table组件的util，根据每列title的字符长度计算该列width并修改该列width属性
 * @param  {Object}         columns         传给Table的￼columns属性的值
 * @param  {array}          excludeKeys     不需要计算并修改width的列
 * @param  {string|number}  padding         每列要增加的padding
 * @return {Number}
 */
export const figureWidthByTitleLength = (columns, {
  excludeKeys = [],
  padding = '0',
} = {}) => {
  columns.forEach((col, i) => {
    if (!excludeKeys.includes(col.key)) {
      if (col.sorter) {
        col.width = `${54 + Number(String(padding).split('px')[0]) + col.title.length * 15}px`;
      } else {
        col.width = `${32 + Number(String(padding).split('px')[0]) + col.title.length * 15}px`;
      }
    }
  });
};


/**
 * 表格每列宽度都是固定数值的情况下，当容器超过固定宽度计算等比拉长适应后的宽度
 * 主要是为了解决如果td或者th每一项被自动伸缩后，如果规定了fixed的列，会有可能对不齐的问题
 * @param className  表格容器
 * @param columns    table.columns
 * @param columnsWidth  固定的table每一列的宽度组成的数组
 */
export const calcWidthWithEveryColumnsFixedTable = ({
                                                      className = 'fishd-table-wrapper',
                                                      columns = [],
                                                      columnsWidth = []
                                                    }) => {
  // scrollW预留滚动条位置7px;
  let wrapperWidth, scrollW = 7;
  if (document.getElementsByClassName(className)[0]) {
    wrapperWidth = document.getElementsByClassName(className)[0].clientWidth;
  }

  if (!wrapperWidth)
    return;

  columns.forEach((item, index) => {
    let columnsPreWith = columnsWidth;
    let preWidth = columnsWidth[index];
    let newWidth = (wrapperWidth - scrollW) / (columnsPreWith.reduce((pre, cur) => pre + cur)) * preWidth;
    if (newWidth > item.width) {
      item.width = newWidth;
    }
  });
};
