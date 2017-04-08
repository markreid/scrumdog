/**
 * teams ducks
 * actions, action creators, reducers for teams
 */


import fetcher from '../lib/fetcher';
import store from '../store';

function requestFetchTeams() {
  return {
    type: 'REQUEST_FETCH_TEAMS',
  };
}

function receiveFetchTeams(payload) {
  const { data, error } = payload;
  return {
    type: 'RECEIVE_FETCH_TEAMS',
    data,
    error,
  };
}

function requestAddTeam() {
  return {
    type: 'REQUEST_ADD_TEAM',
  };
}

function receiveAddTeam(payload) {
  const { data, error } = payload;
  return {
    type: 'RECEIVE_ADD_TEAM',
    data,
    error,
  };
}

function requestRemoveTeam(id) {
  return {
    type: 'REQUEST_REMOVE_TEAM',
    id,
  };
}

function receiveRemoveTeam(id) {
  return {
    type: 'RECEIVE_REMOVE_TEAM',
    id,
  };
}

export function fetchTeams() {
  return (dispatch) => {
    dispatch(requestFetchTeams());
    return fetcher('/api/v1/teams')
    .then(data => dispatch(receiveFetchTeams({ data })))
    .catch(error => dispatch(receiveFetchTeams({ error })));
  };
}

export function addTeam(payload) {
  return (dispatch) => {
    dispatch(requestAddTeam());
    return fetcher('/api/v1/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .then(data => dispatch(receiveAddTeam({ data })))
    .catch(error => dispatch(receiveAddTeam({ error })));
  };
}

export function removeTeam(id) {
  return (dispatch) => {
    dispatch(requestRemoveTeam(id));
    return fetcher(`/api/v1/teams/${id}`, {
      method: 'DELETE',
    })
    .then(() => dispatch(receiveRemoveTeam(id)))
    .catch(error => dispatch(receiveRemoveTeam({ error })));
  };
}

export function setActiveTeam(data) {
  return dispatch => dispatch({
    type: 'SET_ACTIVE_TEAM',
    data,
  });
}

export function resetActiveTeam() {
  return dispatch => dispatch({
    type: 'RESET_ACTIVE_TEAM',
  });
}

const defaultState = {
  data: [],
  error: null,
};

export const teamsReducer = (state = defaultState, action) => {
  switch (action.type) {

    case 'RECEIVE_FETCH_TEAMS': {
      const { data, error } = action;
      return error ? {
        data: [],
        error,
      } : {
        data,
        error: null,
      };
    }

    case 'RECEIVE_ADD_TEAM': {
      const { data, error } = action;

      if (error) {
        return {
          data: state.data,
          error,
        };
      }

      const teams = state.data.slice();
      teams.push(data);
      return {
        data: teams,
        error: null,
      };
    }

    case 'RECEIVE_REMOVE_TEAM': {
      const { id, error } = action;

      if (error) {
        return {
          data: state.data,
          error,
        };
      }

      // filter out the removed one
      const teams = state.data.slice().filter(team => team.id !== id);
      return {
        data: teams,
        error: null,
      };
    }

    default: {
      return state;
    }

  }
};

export const activeTeamReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TEAM':
      try {
        return store.getState().teams.data.find(team => team.id === action.data);
      } catch (e) {
        console.error(e);
        return null;
      }

    case 'RESET_ACTIVE_TEAM':
      return null;

    default:
      return state;
  }
};
