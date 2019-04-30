import DEFAULT_STATE from './initialState';
import {
  SET_TOTAL_NUM,
  SET_LIST,
  SET_FILTER_FIELDS,
  SET_LEADER_USERLIST,
  SET_FILTER_LIST
} from '../actionTypes';

const index = (state = DEFAULT_STATE, action) => {
  let newState=Object.assign({},state);
  switch (action.type) {

    case SET_TOTAL_NUM:
     Object.assign({}, newState.UserDtaa, {
        totalNum: action.total,
      });
      return newState;
    case SET_LIST:
       Object.assign({}, newState.UserDtaa, {
        list: action.result,
        refreshTag: (new Date()).getTime()
      });
      return newState;
    case SET_FILTER_FIELDS:
      if(!newState.Filter.fieldsMap&&action.data){
        let fmps={};
        action.data.map((f)=>{
          fmps[f.id]=f;
          f.operator={};//默认给个已选操作的对象，避免UI渲染时需要判断存在或不存在。
        });
        newState.Filter.fieldsMap=fmps;
      }
      Object.assign(newState.Filter, {
        fields: action.data,
      });
      
      return newState;

    case SET_LEADER_USERLIST:
      Object.assign(newState.Filter, {
        leaders: action.data,
      });
      return newState;

    case SET_FILTER_LIST:
      Object.assign(newState.Filter, {
        list: action.data,
      });
      return newState;
    default:
      return state;
  }
};

export default index;
