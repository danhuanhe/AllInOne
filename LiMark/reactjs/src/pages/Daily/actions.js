import {request} from '../../utils/';
/**
 * ActionsTypes Begin
 */
export const SET_DAILY_LIST ='DAILY/SET_DAILY_LIST';

/**
 * ActionsTypes END
 */

const setDailyList = list => {
  return {type: SET_DAILY_LIST, list};
};

const setListLoading = isLoading => {
  return {type: SET_LIST_LOADING, isLoading};
};

export const getDailyList = (params = {}) => {
  return dispatch => {
    dispatch(setListLoading(true));
    request({
      url: '/api/callcenter/costinfo/list',
      method: 'GET',
      params: params
    }).then(json => {
      dispatch(setListLoading(false));
      dispatch(setDailyList(json.result));
    }).catch(err => {
      message.error(err.message || '网络错误，请刷新~');
    });
  };
};