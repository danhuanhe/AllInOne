import {request} from '../../utils/';
import { message } from "ppfish";
import {
  SET_TOTAL_NUM,
  SET_LIST,
  SET_FILTER_FIELDS,
  SET_LEADER_USERLIST,
  SET_FILTER_LIST,
  SET_FILTER_DETAIL
} from './actionTypes';

// 设置列表
const setList = (list, offset) => {
  return {
    type: SET_LIST,
    list,
    offset,
  };
};

// 设置总数
export const setTotalNum = (totalNum) => {
  return {
    type: SET_TOTAL_NUM,
    totalNum,
  };
};

const setFilterFields = (data) => {
  return {
    type: SET_FILTER_FIELDS,
    data,
  };
};

const setLeaderUserList = (data) => {
  return {
    type: SET_LEADER_USERLIST,
    data,
  };
};

const setFilterList = (data) => {
  return {
    type: SET_FILTER_LIST,
    data,
  };
};


//获取设置客户群需要的字段
export const getFilterFields = () => {
  return dispatch => {
    request({
      url: '/crm/api/getfilters',
      method: 'GET',
      params: {}
    }).then(json => {
      dispatch(setFilterFields(json.result));
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};

//获取选择负责人为条件时，可选负责人列表
export const getLeaderList = () => {
  return dispatch => {
    request({
      url: '/api/kefu/list',
      method: 'GET',
      params: {}
    }).then(json => {
      dispatch(setLeaderUserList(json.result));
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};

//获取客户群列表
export const getFilterList = () => {
  return dispatch => {
    request({
      url: '/crm/api/filter/list',
      method: 'GET',
      params: {}
    }).then(json => {
      dispatch(setFilterList(json.result));
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};


//获取客户群详情，包含字段列表
export const getFilterDetail = (id,fn) => {
  return dispatch => {
    request({
      url: '/crm/api/filter/detail',
      method: 'GET',
      params: {id}
    }).then(json => {
      if(fn){
        fn(json.result);
      }
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};
//修改客户群名称
export const updateFilterName = (id,name,fn) => {
  return dispatch => {
    request({
      url: '/crm/api/filter/edit',
      method: 'POST',
      data: {id,name}
    }).then(json => {
      if(fn){
        fn(json);
      }
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};

//删除客户群
export const deleteFilter = (id,fn) => {
  return dispatch => {
    request({
      url: '/crm/api/filter/del',
      method: 'POST',
      data: {id}
    }).then(json => {
      if(fn){
        fn(json);
      }
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};

//保存客户群
export const saveFilter = (params,fn) => {
  return dispatch => {
    request({
      url: '/crm/api/filter/add',
      method: 'POST',
      data:params
     
    },{ json:true}).then(json => {
      if(fn){
        fn(json);
      }
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};

//修改客户群
export const updateFilter = (params,fn) => {
  return dispatch => {
    request({
      url: '/crm/api/filter/update',
      method: 'POST',
      data:params
     
    },{ json:true}).then(json => {
      if(fn){
        fn(json);
      }
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};