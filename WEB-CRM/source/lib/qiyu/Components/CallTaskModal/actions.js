
import {request} from '../../utils';


export const SET_KEFU_IPCCLIST = 'Components/SET_KEFU_IPCCLIST';
export const SET_DIDLIST = 'Components/SET_DIDLIST';



const setKefuIpcclist = (value) => ({type: SET_KEFU_IPCCLIST, value});
const setDidList = value => ({type: SET_DIDLIST, value});


// 保存外呼任务-外部接口
// 呼损列表页面使用
export const saveCallTaskOpenapi = (data) => dispatch =>
  request({
    url: '/api/callcenter/calltask/openapi/save',
    method: 'POST',
    data
  }, {
    json: true,
    useMessageError: false
  });


// 保存/编辑外呼任务
// 外呼任务页面使用
export const saveCallTask = (data) => dispatch =>
  request({
    url: '/api/callcenter/calltask/save',
    method: 'POST',
    data
  }, {
    json: true,
    useMessageError: false
  });

  // 客服控件接口
export const getKefuIpcclist = () => dispatch => {
  dispatch(setKefuIpcclist({loading: true}));
  return request({
    url: '/api/kefu/ipcclist',
    method: 'GET',
  }).then((json) => {
    if (typeof json.result !== 'object' || !json.result.kefu) {
      throw new Error('');
    }
    json.result.kefu.forEach(val => val.id = `${val.id}`);
    json.result.kefuGroup.forEach(val => val.id = `${val.id}`);
    const kefuMap = new Map();
    json.result.kefu.map((obj) => {
      kefuMap.set(`${obj.id}`, obj);
    });
    let data = {
      ...json.result,
      kefuMap,
      kefuGroupSet: new Set(json.result.kefuGroup.map(({id}) => id)),
    };
    dispatch(setKefuIpcclist({data, loading: false}));
  }).catch((err) => {
    dispatch(setKefuIpcclist({loading: false}));
  });
};

// 获取did号码列表
export const getDidList = () => dispatch => {
  dispatch(setDidList({loading: true}));
  request({
    url: '/api/callcenter/did/list',
    method: 'GET',
  }).then(json => {
    dispatch(setDidList({loading: false, list: json.result, set: new Set(json.result)}));
  }).catch(err => {
    dispatch(setDidList({loading: false}));
  });
};


// 创建来源检测
export const checkCallTask = (data) => dispatch =>
  request({
    url: '/api/callcenter/calltask/check',
    method: 'POST',
    data
  }, {
    json: true,
    useMessageError: false
  });