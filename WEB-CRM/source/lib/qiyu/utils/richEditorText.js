/**
 * 判断是否为富文本内容
 * @param {string} value
 */
export const isRichContent = (value) => {
  if(value == '<p><br></p>' || !value) return false; //内容为空
  const tagList = value.match(/(<\s*?[^<>]*\s*?>)/gi);
  let labelCount = Array.isArray(tagList) ?  value.match(/(<\s*?[^<>]*\s*?>)/gi).length : 0;  //判断标签数量
  let regExp = /(&amp;|&lt;|&gt;|&quot;|&#39;|<br\/>)/g;
  let escapeFlag = regExp.test(value);  //判断文本是否包含转义字符
  if(labelCount > 2 || escapeFlag) {    //富文本
    return true;
  } else {    //纯文本
    return false;
  }
};

/**
 * 富文本保存将emoji<img>标签转换成emoji文本
 * @param {string} string
 */
export const emojiImageToText = (string) => {
  if(!_.isString(string)) return '';
  let imgReg = /<img.*?(?:>|\/>)/gi;
  let altReg = /alt=['"]?([^'"]*)['"]?/i;
  
  return string.replace(imgReg, function(all) {
    let alt = all.match(altReg);
    if(alt && alt[1]){
      if(alt[1].indexOf('[') > -1) {
        return alt[1];
      } else {
        return `[${alt[1]}]`;
      }
    } else {
      return all;
    }
  });
};

/**
 * PPfish富文本编辑器内容转化为七鱼可识别的富文本内容格式
 * 替换Emoji表情、替换strong->b、替换em->i
 * @param {string} value
 */
export const richContentToQiyu = (value) => {
  if(!value || value == '<p><br></p>') return '';
  if(isRichContent(value)) {  //富文本
    return (
      emojiImageToText(value)
      .replace(/(<\s*?\/?\s*?)strong([^<>]*\s*?>)/gi, "$1b$2")
      .replace(/(<\s*?\/?\s*?)em([^<>]*\s*?>)/gi, "$1i$2")
    );
  } else {  //非富文本
    return value.replace(/^(<\s*?p\s*?[^<>]*?>)(.*)(<\s*?\/\s*?p\s*?>)$/gi, "$2");
  }
};

/**
 * 判断富文本编辑器内容长度
 * @param {string} value
 */
export const richContentLen = (value) => {
  if(value == '<p><br></p>' || !value) return 0;  //内容为空
  
  if(isRichContent(value)) {  //富文本
    return value.length;
  } else {  //纯文本（去掉首尾标签）
    let newText = value.replace(/^(<\s*?p\s*?[^<>]*?>)(.*)(<\s*?\/\s*?p\s*?>)$/gi, "$2");
    return newText.length;
  }
};