import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { header } from '../../../reducers/reducer';
import index from './reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  header,
  index
});

export default rootReducer;
