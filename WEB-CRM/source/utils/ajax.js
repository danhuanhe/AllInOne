// ajax 辅助方法
import axios from 'axios';
import debug from 'debug';
import { message } from 'ppfish';
import { object2query } from './type2type';

const ajaxLog = debug('ajax:log');

const instance = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
export const cachePromises = {}; //缓存请求的实例。key为url+params，所以当请求的参数一样时，不需要再次发送请求。

/**
 * 基于Promise的ajax请求接口
 * @param {Object} config 参考axios的config，用于直接传递给axios
 * @param {String} config.url  请求的接口url
 * @param {String} config.method  请求的方法 GET|POST
 * @param {String} config.params  请求的url参数。会被格式化到url中，主要用于GET请求
 * @param {String} config.data  放到body中的参数。主要用于POST请求
 * @param {String} configEx  请求的扩展参数 主要用于该文件。可选
 * @param {Object} configEx.cache 是否缓存结果，如果缓存了，当下次请求时，如果参数一样，直接返回结果
 * @param {String} configEx.json  是否使用json方式提交数据 仅用于POST请求，此参数为true会指定Content-Type 为application/json
 * @param {Boolean|Number} configEx.useMessageError 是否使用message.error显示错误信息，
 * (接上文)默认显示，明确指定为false才不显示，使用Number类型表示code匹配时抑制错误信息

 * @return {Promise}
 */
export function request({
  url = '',
  method = 'GET',
  params = {},
  data = {}
}, {
  cache = false,
  json = false,
  useMessageError = true
} = {}) {

  return new Promise((resolve, reject) => {

    const success = response => {
      const data = response.data;
      const code = data.code;
      if (code == 200) {
        resolve(data);
      } else {
        // 调用成功后的异常，code!= 200，显示错误原因，reject({code, message})
        let isShowMessage = data.message;
        if ( useMessageError === code ) {
          isShowMessage = false;
        } else {
          isShowMessage = isShowMessage && useMessageError;
        }
        if (isShowMessage) {
          message.error(data.message);
        }
        reject(data);
      }
    };
    const fail = error => {
      if (axios.isCancel(error)) {
        ajaxLog(`ajax请求${url}被取消`, error);
        return;
      }
      const errorStatus = (error.response && error.response.status + '');
      let errorMesg = error.response && error.response.data || '请求失败，请稍后再试';
      if(errorStatus === void 0);
      else if (errorStatus.indexOf('4') != -1)  errorMesg = `请求${url}参数错误`;
      else if (errorStatus.indexOf('5') != -1) errorMesg = `请求${url}服务器错误`;

      message.error(errorMesg);

      reject({
        code: -1,
        message: errorMesg
      });
    };
    //使用url和参数生成key，用于缓存当前Promise对象，如果参数没变，可以不用重新发请求，直接使用之前数据
    let key = [url, object2query(params), JSON.stringify(data)].join(':');
    if (cache && cachePromises[key]) {
      cachePromises[key].then(success, fail);
      return;
    }
    let config = {
      url,
      method,
      params,
      data,
      paramsSerializer: function (params) {
        params.token = (window.setting && window.setting.token) || '';//添加鉴权的token
        return object2query(params);
      },
      transformRequest: [function (data, headers) {
        //依自己的需求对请求数据进行处理
        if (json) {
          headers['Content-Type'] = 'application/json';
          return JSON.stringify(data);
        } else {
          return object2query(data);
        }
      }]
    };

    let request = instance(config);
    request.then(success, fail);
    if (cache) {
      cachePromises[key] = request;
    }

  });
}
