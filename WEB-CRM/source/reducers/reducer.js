// 网站头部reducers
import initialState from './initialState';
import {
  SET_NAME
} from '../actions/actionTypes';

// 网站头部信息
export const header = (state = initialState.header, action) => {
  switch (action.type) {
    case SET_NAME:
      return Object.assign({}, state, {
        name: action.name
      });
    default:
      return state;
  }
};
