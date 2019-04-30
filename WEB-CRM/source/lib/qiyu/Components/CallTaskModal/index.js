
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
// import promiseMiddleware from '../../../../middleware/promise';

import reducers from './reducers';

import Create from './Create';
import Edit from './Edit';

function configureStore(rootReducer, preloadedState) {
  const enhancer = compose(
    applyMiddleware(
      thunk,
      // promiseMiddleware(),
    ),
  );
  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer
  );

  return store;
}

const store = configureStore(reducers);

export const CallTaskModal_Create = (props) => (
  <Provider store={store}>
    <Create {...props} />
  </Provider>
);

export const CallTaskModal_Edit = (props) => (
  <Provider store={store}>
    <Edit {...props} />
  </Provider>
);