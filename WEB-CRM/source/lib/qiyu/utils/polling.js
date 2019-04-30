import { object2query } from './type2type';
import { request } from "./ajax";


//使用Symbol实现封装私有方法的目的
const stopPolling = Symbol('stopPolling');
const startPolling = Symbol('startPolling');
const requestPollingKeys = Symbol('requestPollingKeys');
const beforeunload = Symbol('beforeunload');
const visibilitychange = Symbol('visibilitychange');

class Polling {

  source = null;//EventSource 实例

  pollingKeyMap = {};//缓存 prevRequest 获取到的key

  pollingRequest = {//polling请求的所有配置参数
    url: '',
    params: null,
    prevRequest: null,
    handle: null
  };

  onSuccess = null;

  /**
   * 由于EventSource只能使用GET方式，导致如果参数过多会引起URL超限的问题，所以增加一个前置POST请求用于将参数转化为polling的key,用于实际发起pollng请求。
   * 此种情况下才需要配置prevRequest参数，用于配置前置请求的参数。对于参数不多的polling的场景，直接将参数传到pollingRequest中的parmas即可。
   * 注意事项:
   * 1.一般情况直接配置pollingRequest即可，polling参数使用pollingRequest中的params传递
   * 2.当参数较多，可能会导致url超限时，才需要配置prevRequest，所以此时prevRequest一定为会POST方式提交请求，不需要配置method方法
   * 3.prevRequest中只存在data参数，因为是POST

  /**
   * 
   * @param {String} url          polling接口的url 必填
   * @param {Object} handle       polling接口的服务端推送的回调 key表示监听的事件，value为该事件对应的回调函数
   * @param {Function} onSuccess  polling接口的服务端推送成功返回结果。 选填
   * @param {Object} params       polling接口的参数。如果太多，可能会导致url超限，则通过配置prevRequest请求来处理
   * @param {Object} prevRequest  polling接口的预处理请求，当params太多时使用此参数，当有预处理请求时，不再需要params参数
   */
  constructor({
    url,
    handle,
    onSuccess,
    params,
    prevRequest
  }) {

    this.pollingRequest.url = url;
    this.pollingRequest.handle = handle;
    this.pollingRequest.params = params;
    this.pollingRequest.prevRequest = prevRequest;

    this.onSuccess = onSuccess;

    this[beforeunload] = this[beforeunload].bind(this);
    this[visibilitychange] = this[visibilitychange].bind(this);

    // window关闭前关闭polling。比如从呼叫中心切到别的页面时或刷新时，若不关闭，服务端仍会一直推送消息
    // window.addEventListener('beforeunload', this[beforeunload]);
    window.addEventListener('visibilitychange', this[visibilitychange]);
  }

  /**
   * 开始
   */
  start() {


    if (this.pollingRequest.prevRequest) {

      const { data } = this.pollingRequest.prevRequest;
      this[requestPollingKeys]({
        data
      }).then(() => {

        this[startPolling]();

      });

    } else {

      this[startPolling]();

    }

  }

  /**
  * 更新polling；
  * 若不传参就相当于刷新（polling参数不变，关闭之前的polling，建立新的polling）；
  * params与prevRequest是二选一的，参考构造函数中的说明
  */
  update({
    params = {},
    prevRequest: {
      // 请传仅需要更新的模块参数，这样其它模块就不会再向后端请求相应的polling key
      data = {},
    } = {}
  } = {}) {

    if (Object.keys(data).length > 0) {
      // 更新
      this[requestPollingKeys]({
        data
      }).then(() => {

        this[startPolling]();

      });

    } else {

      if (Object.keys(params).length > 0) this.pollingRequest.params = params;

      this[startPolling]();
    }

  }

  /**
   * 终止polling，终止该对象内一切行为。终止后则认为该对象不再被使用，不再被调用任何方法。
   */
  stop() {

    this[stopPolling]();
    // 移除监听
    window.removeEventListener('beforeunload', this[beforeunload]);
    window.removeEventListener('visibilitychange', this[visibilitychange]);
  }

  [beforeunload]() {
    this.stop();
  }

  [visibilitychange]() {
    if (document.hidden) {
      this[stopPolling]();
    } else {
      this[startPolling]();
    }
  }

  /**
   * 私有方法，请求polling keys
   * @param {*} param0 
   */
  [requestPollingKeys]({ data }) {

    return request({
      url: this.pollingRequest.prevRequest.url,
      method: 'POST',
      data
    }, {
        json: true
      }).then((json) => {

        this.pollingKeyMap = {
          ...this.pollingKeyMap,
          ...json.result
        };

      });

  }

  /**
   * 私有方法，开始polling
   * 
   */
  [startPolling]() {

    const { url, handle, params } = this.pollingRequest;


    //polling请求增加token 防止csrf攻击
    let pollingParams = {
      token: (window.setting && window.setting.token) || ''
    };

    //如果有params参数，直接使用params
    if (params) {
      pollingParams = { ...pollingParams, ...this.pollingRequest.params };
    } else if (Object.values(this.pollingKeyMap).length > 0) {//如果是通过prevRequest换取的key,通过ypoillngKeyMap取出相应的key
      pollingParams = { ...pollingParams, pollingKeyList: Object.values(this.pollingKeyMap).join(',') };
    }


    let checkBack = false;
    /**
     * shtnatrPolling具体实现。先停掉当前实例，然后新建EventSource实例，再添加事件监听函数
     */
    const startPollingImpl = () => {

      this[stopPolling]();//赋值之前，先把之前的停掉。如果之前实例存在的话
      this.source = new EventSource(`${url}?${object2query(pollingParams)}`);

      // 如果传入handle，绑定事件和回调
      if (handle) {
        for (const key in handle) {
          if (handle.hasOwnProperty(key)) {

            this.source.addEventListener(key, response => {

              if (checkBack === false && this.onSuccess) {//如果是第一次返回，调用onSuccess回调
                this.onSuccess();
              }

              checkBack = true;

              try {
                let data = JSON.parse(response.data);
                handle[key](data);
              } catch (e) {
                console.error(e);
              }
            }, !1);

          }
        }
      }

    };

    /**
     * 周期检查请求是否返回
     * @param {*} interval 
     */
    const checkInterval = (interval) => {
      this.timer = setTimeout(() => {
        //如果请求已经返回了，直接return，终止下一次检查
        if (checkBack) return;

        startPollingImpl();// 重新实例EventSource，并开始检查。第一次 5s后没返回就取消重新发请求，第二次 10s 第三次 15s  一直到30s
        checkInterval(interval < 30 * 1000 ? interval + 5000 : interval);

      }, interval);
    };

    startPollingImpl();
    checkInterval(5000);

  }

  /**
   * 私有方法，终止当前的polling
   */
  [stopPolling]() {
    
    this.source && this.source.close();
    this.source = null;
    clearTimeout(this.timer);//连续快速多次调用startPolling时(譬如d连续点击更新，upate)，清除之前的超时检查。

  }

}

export default Polling;
