import {combineReducers} from 'redux';
import {
  SET_KEFU_IPCCLIST,
  SET_DIDLIST
} from './actions';

// 按客服组的所有客服
const KefuIpcclist = (state = {
  data: {
    kefu: [],
    kefuGroup: [],
    kefuMap: new Map(),
    kefuGroupSet: new Set()
  },
  loading: true,
}, action) => {
  switch (action.type) {
    case SET_KEFU_IPCCLIST:
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
};

const DidList = (state = {
  list: [],
  set: new Set(),
  loading: false,
}, action) => {
  switch (action.type) {
    case SET_DIDLIST:
      return {...state, ...action.value};
    default:
      return state;
  }
};


export default combineReducers({KefuIpcclist, DidList});
