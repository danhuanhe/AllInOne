import mockData from './__mock__';
import { formatMsgList } from '../../utils';

export const name = '消息列表组件';
export const deps = {
  'msgList': formatMsgList(mockData.msgList)
};
