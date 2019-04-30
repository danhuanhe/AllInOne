import axios from 'axios';
import {message} from 'ppfish';
import {request,cachePromises} from "./ajax";

import {object2query} from './type2type';


const defaultConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};
const formConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

//通用方法，放在这里
const instance = axios.create(defaultConfig);
const instanceForm = axios.create(formConfig);
let apiCrmTokenTimer;  // 接口crm的token缓存计时器标识。

/**
* 基于Promise的ajax请求接口 (crm接口通用)
* @param {Object} config 参考axios的config，用于直接传递给axios
* @param {String} config.url  请求的接口url
* @param {String} config.method  请求的方法 GET|POST
* @param {String} config.params  请求的url参数。会被格式化到url中，主要用于GET请求
* @param {String} config.data  放到body中的参数。主要用于POST请求
* @param {String} configEx  请求的扩展参数 主要用于该文件。可选
* @param {Object} configEx.cache 是否缓存结果，如果缓存了，当下次请求时，如果参数一样，直接返回结果
* @param {String} configEx.json  是否使用json方式提交数据 仅用于POST请求，此参数为true会指定Content-Type 为application/json
* @param {Boolean} configEx.useMessageError 是否使用message.error显示错误信息， 默认显示，明确指定为false才不显示

* @return {Promise}
  */
export function requestApiCrm({
  url = '',
  method = 'GET',
  params = {},
  data = {}
  }, {
  json = false,
  useMessageError = true,
  cache = false,
} = {}) {

  // 先获取token
  request({
    url: '/api/product/token',
    method: 'GET'
  },{
    cache: true
  }).then(json => {

    let {appid,expires,token} = json.result;
    // 用户不指定，默认是两个小时
    expires ? null : expires = 7200000;

    // token的expires到期后将缓存删除，重新获取。
    let key = '/api/product/token::{}';

    if(!apiCrmTokenTimer){
      apiCrmTokenTimer = setTimeout(() => {
        delete cachePromises[key];
        clearTimeout(apiCrmTokenTimer);
        apiCrmTokenTimer = null;
      }, expires);
    }

    // 合并请求需要的appid，token参数
    method == 'GET' ? Object.assign(params, {appid}, {token}) : Object.assign(data, {appid}, {token});


    ((resolve, reject) => {

      const success = response => {
        const data = response.data;
        const rlt = data.rlt;
        // 0代表请求成功
        if (rlt == 0) {
          resolve(data);
        } else {
          // 失败的时候，如果有失败的msg，显示错误信息
          if (data.msg) {
            message.error(data.msg);
          }
          reject(data);
        }
      };
      const fail = error => {
        const errorMesg = error.response && error.response.data || '请求失败，请稍后再试';
        // 因网络等原因调用不成功，显示错误原因，reject({code, message})
        message.error(errorMesg);
        reject({
          code: -1,
          message: errorMesg
        });
      };

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

    })(subresolve,subreject);
  }).catch(err => {
    message.error('获取token错误，请稍后再试');
  });

  let subresolve,subreject;
  return new Promise((resolve, reject) => {
    subresolve = resolve;
    subreject = reject;
  });
}
