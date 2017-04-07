/**
 * reducers.js
 * Redux reducers
 */

import { combineReducers } from 'redux';
import _ from 'lodash';

// todo - cleanup
const defaultState = {
  standups: {
    null: {
      syncState: {
        fetching: false,
        fetched: false,
        failed: false,
      },
    },
  },
  standupTitles: [],
  entries: {},
  users: {},
  activeStandup: null,
  components: {},
  notes: {
    notes: 'loading notes...',
  },
};


// return an unique array
function unique(arr) {
  const set = new Set();
  const unique = [];
  arr.forEach(el => set.add(el));
  set.forEach(el => unique.push(el));
  return unique;
}

const newEntryId = -1;

/**
 * Entries reducer
 * @param  {Array}  state
 * @param  {Object} action
 * @return {Array}
 */
function entries(state = defaultState.entries, action) {
  switch (action.type) {

    case 'CHANGE_ENTRY_VALUE':
      var freshState = Object.assign({}, state);
      var updatedField = {};
      updatedField[action.key] = action.value;
      freshState[action.id] = Object.assign({}, freshState[action.id], updatedField);
      return freshState;
      break;

    case 'REQUEST_SAVE_ENTRY_VALUE':
      var freshState = Object.assign({}, state);
      freshState[action.id] = attachSingleSyncState(freshState[action.id], {
        fetching: true,
        fetched: false,
      });
      return freshState;
      break;

    case 'RECEIVE_SAVE_ENTRY_VALUE':
      var freshState = Object.assign({}, state);
      freshState[action.id] = attachSingleSyncState(action.data);
      return freshState;
      break;

    case 'FAIL_SAVE_ENTRY':
      var freshState = Object.assign({}, state);
      freshState[action.id] = attachSingleSyncState(freshState[action.id], {
        fetched: false,
        failed: true,
      });
      return freshState;
      break;

    case 'RECEIVE_LAST_STANDUP':
      return attachSyncStates(action.data.entities.entries || {});
      break;

    case 'RECEIVE_STANDUP':
      return attachSyncStates(action.data.entities.entries || {});
      break;

    case 'RECEIVE_ENTRY':
      var freshState = Object.assign({}, state);
      freshState[action.data.result] = attachSingleSyncState(action.data.entities.entries[action.data.result]);
      return freshState;
      break;

    case 'REQUEST_REMOVE_ENTRY':
      var freshState = Object.assign({}, state);
      freshState[action.id] = attachSingleSyncState(freshState[action.id], {
        fetching: true,
        fetched: false,
      });
      return freshState;
      break;

        // case 'RECEIVE_REMOVE_ENTRY':
        //     var freshState = Object.assign({}, state);
        //     delete freshState[action.id];
        //     return freshState;
        //     break;


    default:
      return state;
      break;
  }
}


function users(state = defaultState.users, action) {
  switch (action.type) {

    case 'RECEIVE_LAST_STANDUP':
            // merge
      return Object.assign({}, state, attachSyncStates(action.data.entities.users || {}));
      break;

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
      break;

    default:
      return state;
      break;
  }
}

function activeStandup(state = defaultState.activeStandup, action) {
  switch (action.type) {
    case 'RECEIVE_LAST_STANDUP':
      return action.data.result;
      break;

    case 'REQUEST_STANDUP_FAILED':
      return null;
      break;

    case 'SET_ACTIVE_STANDUP':
      return action.id;
      break;

    case 'RECEIVE_REMOVE_STANDUP':
            // if you removed the active standup, reset to null
      return action.id === state ? null : state;
      break;

    case 'RECEIVE_CREATE_STANDUP':
            // created a new standup, set it as active
      return action.data.result;
      break;


    default:
      return state;
      break;

  }
}

function standups(state = defaultState.standups, action) {
    // for now, we're only working with a single standup in the store
    // at any point.  moving ahead we can investigate caching etc.

  switch (action.type) {

    case 'RECEIVE_REMOVE_STANDUP':
            // removed the standup, nuke it
      return Object.assign({}, defaultState.standups);
      break;

        // request a single standup
        // create an empty object with a 'fetching' sync state
    case 'REQUEST_STANDUP':
      return Object.assign({}, state, {
        [action.id]: attachSingleSyncState({}, {
          fetching: true,
          fetched: false,
        }),
      });
      break;

    case 'REQUEST_LAST_STANDUP_FAILED':
      return {
        null: attachSingleSyncState({}, {
          fetching: false,
          fetched: false,
          failed: true,
          error: action.err,
        }),
      };
      break;


        // receiving a single standup.
        // overwrite the standups object
    case 'RECEIVE_STANDUP':
    case 'RECEIVE_LAST_STANDUP':
    case 'RECEIVE_CREATE_STANDUP':
      return {
        [action.data.result]: attachSingleSyncState(action.data.entities.standups[action.data.result]),
      };

      break;


        // when receiving an entry, add/update on its parent standup
    case 'RECEIVE_ENTRY':
      const entryId = action.data.result;
      const standupId = action.data.entities.entries[entryId].StandupId;
      let standup = state[standupId];
      return Object.assign({}, state, {
        [standupId]: Object.assign({}, standup, {
          Entries: unique(standup.Entries.concat(entryId)),
        }),
      });
      break;

        // entry has been removed, needs to be pulled from the parent standup
    case 'RECEIVE_REMOVE_ENTRY':
      const freshState = Object.assign({}, state);
      standup = freshState[action.standupId];
      standup.Entries = _.without(standup.Entries, action.id);
      return freshState;
      break;

    default:
      return state;
      break;
  }
}

function standupTitles(state = defaultState.standupTitles, action) {
  switch (action.type) {

    case 'REQUEST_STANDUP_TITLES':
      return [];

    case 'RECEIVE_STANDUP_TITLES':
      return action.data;

    case 'RECEIVE_REMOVE_STANDUP':
      return state.filter(row => row.id !== action.id);

    case 'RECEIVE_CREATE_STANDUP':
      const standup = action.data.entities.standups[action.data.result];
      return [standup, ...state];

    default:
      return state;
      break;
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


/**
 * Find an element in an array, return a mutated copy of it
 * inside a copy of the aray.
 * @param  {Array} arr          array to search
 * @param  {function} test      findIndex function
 * @param  {function} transform transform function
 * @return {Array}              copied array with modified element
 */
function sliceAndReplace(arr, test, transform) {
  const elementIndex = _.findIndex(arr, test);
  const element = transform(arr[elementIndex]);
  return [
    ...arr.slice(0, elementIndex),
    element,
    ...arr.slice(elementIndex + 1),
  ];
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
export const rootReducer = combineReducers({
  entries,
  standups,
  users,
  standupTitles,
  activeStandup,
  notes,
});
