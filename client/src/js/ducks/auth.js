/**
 * auth ducks
 * actions, action creators & reducers for auth
 */

import fetcher from '../lib/fetcher';
import store from '../store';


function requestWhoami() {
  return {
    type: 'REQUEST_WHOAMI',
  };
}

function receiveWhoami({ data, error }) {
  return {
    type: 'RECEIVE_WHOAMI',
    data: data.user,
    error,
  };
}

export const whoami = () => (dispatch) => {
  dispatch(requestWhoami());
  return fetcher('/api/v1/whoami')
  .then(data => dispatch(receiveWhoami({ data })))
  .catch(error => dispatch(receiveWhoami({ error })));
}

const DEFAULT_STATE = {
  syncing: true,
  error: null,
  user: null,
};

export const authReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'REQUEST_WHOAMI':
      return {
        syncing: true,
        error: null,
        user: null,
      };

    case 'RECEIVE_WHOAMI':
      return {
        syncing: false,
        error: action.error,
        user: action.data,
      };
  }
  return state;
}
