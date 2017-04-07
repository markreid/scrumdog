/**
 * store.js
 * Redux store implementation
 */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import { rootReducer } from './reducers';


const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
)(createStore);

function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}

export default configureStore();
