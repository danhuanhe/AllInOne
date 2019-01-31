import {request} from '../../utils/';
/**
 * ActionsTypes Begin
 */
export const SET_DATA_LIST ='DAILY/SET_DATA_LIST';
export const SET_TOTAL_NUM ='DAILY/SET_TOTAL_NUM';
export const SET_CURRENT ='DAILY/SET_CURRENT';
export const SET_LIST_PARAMS ='DAILY/SET_LIST_PARAMS';
export const SET_LIST_LOADING ='DAILY/SET_LIST_PARAMS';
//setCurrent,setTotalNum,getDailyList,setListParams
/**
 * ActionsTypes END
 */

const setDailyList = list => {
  return {type: SET_DATA_LIST, list};
};

const setListLoading = isLoading => {
  return {type: SET_LIST_LOADING, isLoading};
};

export const setTotalNum = totalNum => {
  return {type: SET_TOTAL_NUM, totalNum};
};

export const setCurrent = current => {
  return {type: SET_CURRENT, current};
};

export const setListParams = params => {
  return {type: SET_LIST_PARAMS, params};
};

export const getDailyList = (params = {}) => {
  return dispatch => {
    dispatch(setListLoading(true));
    request({
      url: '/api/detailist',
      method: 'GET',
      params: params
    }).then(json => {
      dispatch(setListLoading(false));
      dispatch(setDailyList(json.data));
      dispatch(setTotalNum(json.total||json.data.length));
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};