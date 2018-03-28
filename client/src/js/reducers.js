/**
 * reducers.js
 * Redux reducers
 */

import { combineReducers } from 'redux';
import _ from 'lodash';

import { teamsReducer, activeTeamReducer } from './ducks/teams';

// todo - get rid of deprecated crap
const defaultState = {
  standupTitles: [],
  users: {},
  activeStandup: null, // Standup with Entries with Users
  activeTeam: null, // Team
  notes: {
    notes: 'loading notes...',
  },
};


function users(state = defaultState.users, action) {
  switch (action.type) {

    case 'RECEIVE_CREATE_USER':
    case 'RECEIVE_UPDATE_USER':
            // add
      return Object.assign({}, state, {
        [action.payload.result]: attachSingleSyncState(action.payload.entities.users[action.payload.result]),
      });
      break;

    case 'RECEIVE_USERS':
            // overwrite
      return attachSyncStates(action.data.entities.users || {});
      break;

    case 'REQUEST_REMOVE_USER':
      return Object.assign({}, state, {
        [action.id]: attachSingleSyncState(state[action.id], {
          fetching: true,
          fetched: false,
        }),
      });
      break;

    case 'RECEIVE_REMOVE_USER':
      var freshState = Object.assign({}, state);
      delete freshState[action.id];
      return freshState;

    default:
      return state;
  }
}

function activeStandup(state = defaultState.activeStandup, action) {
  // any errors, no-op. errors reducer will catch them.
  if (action.error) return state;

  switch (action.type) {
    case 'RECEIVE_STANDUP':
    case 'RECEIVE_CREATE_STANDUP': {
      return action.data;
    }

    case 'RECEIVE_REMOVE_STANDUP': {
      // if you removed the active standup (probably),
      // reset activestandup.
      const { id } = action;
      if (state.id === id) {
        return defaultState.activeStandup;
      }
      return state;
    }

    case 'SET_ACTIVE_TEAM':
    case 'RESET_ACTIVE_TEAM': {
      // changing the team blows this away
      return null;
    }

    case 'RECEIVE_ENTRY': {
      const { data } = action;

      // the entry doesn't belong on this standup, ignore it.
      if (data.StandupId !== state.id) {
        return state;
      }

      // entry does belong here, push it into Entries[]
      return Object.assign({}, state, {
        Entries: [...state.Entries, data],
      });
    }

    case 'RECEIVE_SAVE_ENTRY': {
      const { data } = action;

      // not this standup, ignore
      if (data.StandupId !== state.id) {
        return state;
      }

      return Object.assign({}, state, {
        Entries: state.Entries.map((entry) => {
          if (entry.id === data.id) {
            return data;
          }
          return entry;
        }),
      });
    }


    case 'RECEIVE_REMOVE_ENTRY': {
      // filter the removed Entry out of Entries[]

      const { id } = action;
      return Object.assign({}, state, {
        Entries: state.Entries.filter(entry => entry.id !== id),
      });
    }

    default:
      return state;
  }
}

function standupTitles(state = defaultState.standupTitles, action) {
  // errors are a no-op, picked up by the errors reducer
  if (action.error) {
    return state;
  }

  switch (action.type) {

    case 'REQUEST_STANDUP_TITLES':
      // reset
      return [];

    case 'RECEIVE_STANDUP_TITLES':
      // replace
      return action.data || null;

    case 'RECEIVE_REMOVE_STANDUP':
      // remove
      return state.filter(row => row.id !== action.id);

    case 'RECEIVE_CREATE_STANDUP':
      // add
      return [action.data, ...state];

    default:
      return state;
  }
}

function notes(state = defaultState.notes, action) {
  switch (action.type) {

    case 'RECEIVE_FETCH_NOTES':
      const { notes } = action.data;
      return {
        notes,
      };

    case 'REQUEST_FETCH_NOTES':
    default:
      return state;
      break;

  }
}


// errors reducer.
// for any action with an error,
// push it into the errors array.
function errors(state = [], action) {
  if (action.error) {
    return [...state, action.error];
  }

  return state;
}


/**
 * Attach syncStates to all keys on an object or
 * all elements of an array
 * @param  {Array/Object} target
 * @return {[type]}        [description]
 */
function attachSyncStates(target, syncStateOverwrite = {}) {
  if (!target) throw new Error('attachSyncStates called with no target');

  const obj = _.isArray(target) ? [] : {};
  Object.keys(target).forEach((key) => {
    obj[key] = attachSingleSyncState(target[key], syncStateOverwrite);
  });
  return obj;
}


/**
 * Add or reset a syncState on an object
 * @param  {Object} target
 * @param  {Object} syncStateOverwrite  overwrite default state
 * @return {Object}
 */
function attachSingleSyncState(target, syncStateOverwrite = {}) {
  const syncState = Object.assign({
    fetching: false,
    fetched: true,
    failed: false,
  }, syncStateOverwrite);

  return Object.assign({}, target, {
    syncState,
  });
}


/**
 * Combine the sub-reducers into one
 * @type {Object}
 */
export default combineReducers({
  users,
  standupTitles,
  activeStandup,
  notes,
  errors,
  teams: teamsReducer,
  activeTeam: activeTeamReducer,
});
