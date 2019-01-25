import {combineReducers} from 'redux';
import {
  SET_DAILY_LIST,
  SET_LIST_LOADING,
} from "./actions";

const DailyList = (state = {
    list:[],
    isLoading: true,
  }, action) => {
  switch (action.type) {
    case SET_DAILY_LIST:
        return {...state, list: action.list};
    case SET_LIST_LOADING:
        return {...state, isLoading: action.isLoading};
    default:
      return state;
  }

};

export default combineReducers({DailyList});
