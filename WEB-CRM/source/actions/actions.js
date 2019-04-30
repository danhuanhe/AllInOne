// 网站头部菜单选中状态
import { message } from 'ppfish';
import {
  SET_NAME,
} from '../actions/actionTypes';

// 设置姓名
export const setName = (name) => {
  return {
    type: SET_NAME,
    name,
  };
};
