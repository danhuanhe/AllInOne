import {combineReducers} from 'redux';
import {
  SET_DATA_LIST,
  SET_LIST_LOADING,
  SET_TOTAL_NUM,
  SET_CURRENT,
  SET_LIST_PARAMS
} from "./actions";

const DailyList = (state = {
    list: [],
    isLoading: true,
    totalNum: null,
    current: 1,
    params: {}
  }, action) => {
  switch (action.type) {
    case SET_DATA_LIST:
        return {...state, list: action.list};
    case SET_LIST_LOADING:
        return {...state, isLoading: action.isLoading};
    case SET_TOTAL_NUM:
        return {...state, totalNum: action.totalNum};
    case SET_CURRENT:
        return {...state, current: action.current};
    case SET_LIST_PARAMS:
        return {...state, params: action.params};
    default:
      return state;
  }

};

export default combineReducers({DailyList});
