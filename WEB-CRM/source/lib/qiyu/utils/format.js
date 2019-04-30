import { text2object } from './type2type';
import * as _ from 'lodash';


/**
 * 找到每个级联数据的父节点id，返回一个Map映射{子节点id:父节点id}
 * @param {array} cascaderData 
 */
export const findCategoryArray = (cascaderData) => {
    let cascaderObj = {};
    const findFatherId = (array, parentId) => {
        array.forEach(item => {
        cascaderObj[item.id] = parentId;
        if(item.children) {
            findFatherId(item.children, item.id);
        }         
        });
    };
    cascaderData.forEach(item => {
        cascaderObj[item.id] = -1;
        if(item.children) {
        findFatherId(item.children, item.id);
        }
    });
    return cascaderObj;
};

/**
 * 通过最后一级categoryId找到五级分类id数组[id1,id2,...]以及name和path的信息
 * （此方法为选中ppfish级联组件数据做转换）
 * @param {*} data         后端返回的初始分类数据
 * @param {*} categoryId   最后一级分类Id 
 * 此方法取代findCategoryIdArray方法，不光提供idArray还提供最后一级的name以及path(不包括最后一级的未分类)
 */
export const findCategory = (data, categoryId) => {

  if (!data || !Array.isArray(data) || !data.length || !String(categoryId) || categoryId == 0) {
    return {
      idAarray: [0],
      name: '未分类',
      path: '未分类'
    };
  }


  let categoryArr = []; //五级分类id数组[id1,id2,...]
  let cascaderObj = findCategoryArray(data); //转换初始数据
  let itemId = categoryId;
  categoryArr.push(itemId);

  while (cascaderObj[itemId] && cascaderObj[itemId] != -1) { //存在父节点
    categoryArr.unshift(cascaderObj[itemId]);
    itemId = cascaderObj[itemId];
  }
  //判断最后一级是否是未分类
  let childrenlist = [];
  let categoryNameArr = [];
  for (let i = 0; i < categoryArr.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (categoryArr[i] == data[j].id) {
        categoryNameArr.push(data[j].name);
        childrenlist = data[j].children || [];
        break;
      }
    }
    data = childrenlist;
  }
  if (childrenlist.length) {
    categoryArr.push(0);
  }


  return {
    idAarray: categoryArr,
    name: categoryNameArr[categoryNameArr.length -1],
    path: categoryNameArr.join('/')
  };

};

/**
 * 根据最后一级categoryId找到五级分类id[id1,id2,...]   *** 逐步废弃 使用findCategory ***
 * （此方法为选中ppfish级联组件数据做转换）
 * @param {array} data 后端返回的初始分类数据
 * @param {*} categoryId 最后一级分类Id 
 */
export const findCategoryIdArray = (data, categoryId) => {
    if(!data || !Array.isArray(data) || !String(categoryId)) return;
  
    let categoryArr = []; //五级分类id数组[id1,id2,...]
    if(categoryId == 0) { //未分类
      categoryArr.push(0);
    } else {
      if(data.length) {
        let cascaderObj = findCategoryArray(data); //转换初始数据
        let itemId = categoryId;
        categoryArr.push(itemId); 
  
        while(cascaderObj[itemId] && cascaderObj[itemId] != -1) { //存在父节点
          categoryArr.unshift(cascaderObj[itemId]); 
          itemId = cascaderObj[itemId];
        }
        //判断最后一级是否是未分类
        let childrenlist = [];
        for(let i = 0;i< categoryArr.length;i++) {
          for(let j = 0;j < data.length;j++) {
            if(categoryArr[i] == data[j].id) {
              childrenlist = data[j].children || [];
              break;
            }
          }
          data = childrenlist;
        }
        if(childrenlist.length) { 
          categoryArr.push(0);
        } 
      } else {
        categoryArr.push(0);
      }
    } 
    return categoryArr;
};

/**
 * 文件后缀映射到图标
 * @param {string} string 
 */
export const spliceSuffix = (string) => {
  let temp = string.split('.'),
    map = {
      'bmp': 'imgflag',
      'png': 'imgflag',
      'jpg': 'imgflag',
      'jpeg': 'imgflag',
      'gif': 'imgflag',
      'exif': 'imgflag',
      'pdf': 'pdf',
      'txt': 'doc',
      'doc': 'doc',
      'docx': 'doc',
      'xls': 'excel',
      'xlsx': 'excel',
      'csv': 'excel',
      'zip': 'zip',
      'rar': 'zip',
      '7z': 'zip',
      'ppt': 'ppt',
      'pptx': 'ppt',
      'key': 'key',
      'mp3': 'audio',
      'wma': 'audio',
      'ape': 'audio',
      'flac': 'audio',
      'wav': 'audio',
      'aac': 'audio',
      'ogg': 'audio',
      'avi': 'video',
      'mov': 'video',
      'mkv': 'video',
      'rmvb': 'video',
      'wmv': 'video',
      '3gp': 'video',
      'flv': 'video',
      'mp4': 'video',
      'mpg': 'video'
    },
    realIcon = map[temp[temp.length - 1].toLowerCase()];
  if (!realIcon) return 'unknown';
  return realIcon;
};

/**
 * 文件大小显示规则
 * @param  {number} size - 文件大小，单位bytes
 * @param {string} format - 显示格式，'GB'/'MB'/'KB'/'B'
 * @return {string}      文件大小展示信息
 */
export const fileSizeFormat = (size, format) => {
  format = format && format.toUpperCase();
  switch (format) {
    case 'GB':
      return (size / Math.pow(1024, 3)).toFixed(1);
    case 'MB':
      return (size / Math.pow(1024, 2)).toFixed(1);
    case 'KB':
      return Math.round(size / 1024);
    case 'B':
      return size;
    default:
      if (size >= Math.pow(1024, 3)) {
        return (size / Math.pow(1024, 3)).toFixed(1) + ' GB';
      } else if (size >= Math.pow(1024, 2)) {
        return (size / Math.pow(1024, 2)).toFixed(1) + ' MB';
      } else if (size >= 1024) {
        return Math.round(size / 1024) + ' KB';
      } else {
        return size + ' B';
      }
  }
};

/**
 * 在线消息列表格式化
 * @param {array} list - 消息列表
 */
export const formatMsgList = (list) => {
  // 过滤易盾消息
  filterTrashMsg(list);
  // 拆分转人工消息
  splitRgMsg(list);
  // 单条格式化
  list.forEach((item) => {
    item.kefu = item.kefu || {};
    item.user = item.user || {};
    formatMsgItem(item);
  });
  return list;
};

export const formatMsgItem = (item) => {
  // parse ext
  item.ext = text2object(item.ext) || {};
  // 前端单独一个字段维护撤回状态
  // withdraw: 0/undefined-正常，1-已撤回，2-正在撤回
  if (item.status == 2) {
    item.withdrawStatus = 1;
  }
  if (!item.content) {
    item.type = 'empty';
    return;
  }
  switch (item.type) {
    case 'image': {
      item.content = text2object(item.content);
      // format image url
      let url = item.content && item.content.url || '';
      if ((url.indexOf('nos.netease.com') >= 0 || url.indexOf('nosdn.127.net') >= 0) && url.indexOf('?') < 0) {
        item.content.origin = url;
        item.content.url = url + '?imageView&thumbnail=1500x850';
        item.content.thumb = url + '?imageView&thumbnail=120x120';
      }
      break;
    }
    case 'file':
    case 'video': {
      item.content = text2object(item.content);
      break;
    }
    case 'audio': {
      item.content = text2object(item.content);
      let url = item.content.url || '';
      if ((url.indexOf('nos.netease.com') >= 0 || url.indexOf('nosdn.127.net') >= 0)) {
        url += (url.indexOf('?') < 0 ? '?' : '&')
          + 'audioTrans&type=mp3';
        item.content.url = url;
      }
      break;
    }
    case 'richtext': {
      item.content = (text2object(item.content) || {}).content;
      break;
    }
    case 'qa': {
      const content = text2object(item.content);
      const answerList = text2object(content.answer_list) || [];
      // 答案+关联问题(特殊情况-访客分流)
      if (content.answer_label || answerList.length > 1) {
        item.content = {
          ...content,
          answer_list: answerList
        };
        // 仅答案
      } else {
        item.content = {
          ...content,
          answer_list: [],
          answer_label: (answerList[0] || {}).answer
        };
      }
      item.content.answer_label = filterRgLink(item.content.answer_label);
      break;
    }
    case 'rg': {
      const content = text2object(item.content);
      const rgDesc = content.operator_hint_desc;
      item.content = filterRgLink(rgDesc);
      break;
    }
    case 'workflow': {
      formatBotMsg(item);
      break;
    }
    case 'custom': {
      const content = text2object(item.content);
      switch (content.cmd) {
        case 121: {
          item.type = 'card';
          let tags = text2object(content.tags) || [];
          if (tags.length > 3) tags = tags.slice(0, 3);
          _.forEach(tags, (it) => {
            if (it.label) {
              if (it.label.length > 8) {
                it.label = it.label.substr(0, 8);
              }
              if (it.data) it.data = JSON.stringify(it.data);
            }
          });
          content.tags = tags;
          item.content = content;
          break;
        }
        case 122: {
          item.type = 'miniProgramCard';
          item.content = {
            ...content,
            title: content.title || content.Title,
            headImg: content.headimg || content.headImg,
            pagePath: content.pagepath || content.PagePath,
            thumbUrl: content.pic || content.thumburl || content.ThumbUrl,
            msgType: content.msgtype || content.MsgType
          };
          break;
        }
      }
      break;
    }
    default:

  }
};
/**
 * 过滤触发易盾的访客消息
 * @param  {array} list
 * @return {void}
 */
const filterTrashMsg = (list) => {
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (!item.fromUser) continue;
    if (item.ext) {
      let ext = text2object(item.ext);
      if (ext.auditResult == 1) {
        list.splice(i--, 1);
      }
    }
  }
};
/**
 * 拆分转人工消息
 * @param {array} list
 */
const splitRgMsg = (list) => {
  _.forInRight(list, (item, index) => {
    if (item.type === 'qa') {
      const content = text2object(item.content);
      const hasAnswer = content.answer_label || (content.answer_list && content.answer_list.length);
      // 包含转人工
      if (content.operator_hint) {
        const msg = {
          ...item,
          id: _.uniqueId(),
          type: 'rg',
        };
        list.splice(index, +(!hasAnswer), msg);
      }
    }
  });
};

/**
 * 格式化bot消息
 * @param {object} msg
 * @return {void}
 */
const formatBotMsg = (function () {
  let setStyle = function (td) {
    let style = {};
    if (td.width) {
      style['width'] = td.width;
    }
    if (td.color) {
      style['color'] = td.color;
    }
    if (td.align) {
      style['textAlign'] = td.align;
    }
    // bold, italic, underline, 单行多行按位取值
    let styleList = [{
      prop: 'WebkitLineClamp',
      value: '1'
    }, {
      prop: 'textDecoration',
      value: 'underline'
    }, {
      prop: 'fontStyle',
      value: 'italic'
    }, {
      prop: 'fontWeight',
      value: 'bold'
    }];
    if (td.flag) {
      var innerStyle = {};
      let flag = parseInt(td.flag).toString(2);
      // 补0
      flag = new Array(styleList.length - flag.length + 1).join('0') + flag;
      let flagArr = flag.split('');
      _.forEach(flagArr, (item, index) => {
        if (item == '1') {
          const styleItem = styleList[index];
          innerStyle[styleItem.prop] = styleItem.value;
        }
      });
    }
    td.style = style;
    td.innerStyle = innerStyle;
  };
  let fmap = {
    'card_layout': function (msg) {
      let tpl = msg.content.template;
      _.forEach(tpl.list, function (group) {
        _.forEach(group.list, function (tr) {
          _.forEach(tr, function (td) {
            td.width = 100 / tr.length + '%';
            setStyle(td);
          });
        });
      });
    },
    'detail_view': function (msg) {
      let tpl = msg.content.template;
      _.forEach(tpl.thumbnail.list, function (tr) {
        _.forEach(tr, function (td) {
          td.width = 100 / tr.length + '%';
          setStyle(td);
        });
      });
      _.forEach(tpl.detail.list, function (group) {
        _.forEach(group, function (tr) {
          setStyle(tr.left);
          setStyle(tr.right);
        });
      });
    },
    'static_union': function (msg) {
      let tpl = msg.content.template;
      _.forEach(tpl.unions, function (item) {
        if (item.type == 'richText') {
          item.detail.label = filterRgLink(item.detail.label);
        }
      });
    }
  };
  return function (msg) {
    msg.content = text2object(msg.content) || {};
    if (msg.content.template == null) {
      msg.type = 'unkown';
      return;
    }
    let tplId = msg.content.template.id;
    switch (msg.content.type) {
      //文本
      case '01': {
        msg.type = 'text';
        msg.content = msg.content.template;
        break;
      }
      case '02':
      case '03':
        break;
      //默认处理为模板
      default: {
        let func = fmap[tplId];
        if (_.isFunction(func)) {
          func.call(this, msg);
        }
      }
    }
  };
})();
/**
 * 过滤转人工消息中的链接
 * @param {string} str 
 */
const filterRgLink = (str) => {
  let reg = /<a.+href\s*=\s*('|")qiyu:\/\/action\..+\.com\?command=(.+?)\1\s*>(.+?)<\/a>/gi;
  return (str || '').replace(reg, '$3');
};


/**
 * 解析后端iframe数据
 * @param tabServices  array  -- 后端同步返回的iframe配置数据
 * @param key  string  -- 维度取值  callcenter  worksheet 等
 */

export const formatIframe2TabList = (tabServices, tabKey) => {
  let tabItem = tabServices.filter(({ key }) => key == tabKey)[0];

  if (tabItem && tabItem["tabName"] && tabItem["tabName"].length) {
    return tabItem["tabName"].map((t, index) => ({
      key: tabItem['iframeIdList'][index],
      text: t
    }));
  }

  return [];
};