/**
 * teams ducks
 * actions, action creators, reducers for teams
 */


import fetcher from '../lib/fetcher';
import store from '../store';
// import { tapLog } from '../utils';


function requestFetchTeams() {
  return {
    type: 'REQUEST_FETCH_TEAMS',
  };
}

function receiveFetchTeams({ data, error }) {
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

function receiveAddTeam({ data, error }) {
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

function requestAddUserToTeam(data) {
  return {
    type: 'REQUEST_ADD_USER_TO_TEAM',
    data,
  };
}

function receiveAddUserToTeam({ data, error }) {
  return {
    type: 'RECEIVE_ADD_USER_TO_TEAM',
    data,
    error,
  };
}

function requestRemoveUserFromTeam(data) {
  return {
    type: 'REQUEST_REMOVE_USER_FROM_TEAM',
    data,
  };
}

function receiveRemoveUserFromTeam({ data, error }) {
  return {
    type: 'RECEIVE_REMOVE_USER_FROM_TEAM',
    data,
    error,
  };
}

function requestUpdateTeam(data) {
  return {
    type: 'REQUEST_UPDATE_TEAM',
    data,
  };
}

function receiveUpdateTeam({ data, error }) {
  return {
    type: 'RECEIVE_UPDATE_TEAM',
    data,
    error,
  };
}

// set the active team
export function setActiveTeam(data) {
  return dispatch => dispatch({
    type: 'SET_ACTIVE_TEAM',
    data,
  });
}

// set the active team to null
export function resetActiveTeam() {
  return dispatch => dispatch({
    type: 'RESET_ACTIVE_TEAM',
  });
}


// fetch all teams
export function fetchTeams() {
  return (dispatch) => {
    dispatch(requestFetchTeams());
    return fetcher('/api/v1/teams')
    .then(data => dispatch(receiveFetchTeams({ data })))
    .catch(error => dispatch(receiveFetchTeams({ error })));
  };
}

// add a team. requires .name
export function addTeam(props) {
  return (dispatch) => {
    dispatch(requestAddTeam());
    return fetcher('/api/v1/teams', {
      method: 'POST',
      body: JSON.stringify(props),
    })
    .then(data => dispatch(receiveAddTeam({ data })))
    .catch(error => dispatch(receiveAddTeam({ error })));
  };
}

// remove a team by id
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

// add a user to the team.
// requires teamId, userId
export function addUserToTeam(props) {
  const { userId, teamId } = props;
  return (dispatch) => {
    dispatch(requestAddUserToTeam({
      userId,
      teamId,
    }));
    return fetcher(`api/v1/teams/${teamId}/users/${userId}`, {
      method: 'PUT',
    })
    .then(data => dispatch(receiveAddUserToTeam({ data })))
    .catch(error => dispatch(receiveAddUserToTeam({ error })));
  };
}

// remove a user from a team.
// requires teamId, userId
export function removeUserFromTeam(props) {
  const { userId, teamId } = props;
  return (dispatch) => {
    dispatch(requestRemoveUserFromTeam({
      userId,
      teamId,
    }));
    return fetcher(`/api/v1/teams/${teamId}/users/${userId}`, {
      method: 'DELETE',
    })
    .then(data => dispatch(receiveRemoveUserFromTeam({ data })))
    .catch(error => dispatch(receiveRemoveUserFromTeam({ error })));
  };
}

// update a team. you can only change the name.
export function updateTeam(props) {
  const { id, name } = props;
  return (dispatch) => {
    dispatch(requestUpdateTeam({
      id,
      name,
    }));
    return fetcher(`/api/v1/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
      }),
    })
    .then(data => dispatch(receiveUpdateTeam({ data })))
    .catch(error => dispatch(receiveUpdateTeam({ error })));
  };
}


// todo - skip data, just make this an array?
const DEFAULT_STATE = {
  data: [],
};

export const teamsReducer = (state = DEFAULT_STATE, action) => {
  // errors no-op here, they get handled by
  // the errors reducer in reducers.js
  if (action.error) {
    return state;
  }

  switch (action.type) {

    case 'RECEIVE_FETCH_TEAMS': {
      return {
        data: action.data,
      };
    }

    case 'RECEIVE_ADD_TEAM': {
      const { data } = action;
      const teams = state.data.slice();
      data.Users = data.Users || [];
      teams.push(data);
      return {
        data: teams,
      };
    }

    case 'RECEIVE_REMOVE_TEAM': {
      // filter out the removed one
      const { id } = action;
      const teams = state.data.filter(team => team.id !== id);
      return {
        data: teams,
      };
    }

    // actions that update/replace a team
    case 'RECEIVE_UPDATE_TEAM':
    case 'RECEIVE_ADD_USER_TO_TEAM':
    case 'RECEIVE_REMOVE_USER_FROM_TEAM': {
      const { data } = action;
      const teams = state.data.map(team => (team.id === data.id ? data : team));
      return {
        data: teams,
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
