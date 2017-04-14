/**
 * actions.js
 * Redux actions
*/

import { normalize, arrayOf } from 'normalizr';
import pick from 'lodash/pick';

import normalizerSchemas from './normalizers';
import fetcher from './lib/fetcher';


// properties of each model that we want to _pick before syncing
// todo - this should be in api.js
const modelProps = {
  entry: ['lastDayTasks', 'blockers', 'todayTasks', 'UserId'],
  standup: ['title'],
};


const ajaxHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};


// update one of the properties
export function changeEntryValue(payload) {
  return {
    type: 'CHANGE_ENTRY_VALUE',
    id: payload.id,
    key: payload.key,
    value: payload.value,
  };
}

function requestCreateEntry({ teamId, standupId, userId }) {
  return {
    type: 'REQUEST_CREATE_ENTRY',
    standupId,
    userId,
    teamId,
  };
}

// a request to save entry data to the server is in progress
function requestSaveEntry(id) {
  return {
    type: 'REQUEST_SAVE_ENTRY_VALUE',
    id,
  };
}

function requestLastStandup() {
  return {
    type: 'REQUEST_LAST_STANDUP',
  };
}


function receiveLastStandup({ error, data }) {
  return {
    type: 'RECEIVE_LAST_STANDUP',
    data,
    error,
  };
}

function receiveEntry({ data, error }) {
  return {
    type: 'RECEIVE_ENTRY',
    data,
    error,
  };
}

function receiveSaveEntry({ data, error }) {
  return {
    type: 'RECEIVE_SAVE_ENTRY',
    data,
    error,
  };
}

function requestUsers() {
  return {
    type: 'REQUEST_USERS',
  };
}

function requestTeamUsers(teamId) {
  return {
    type: 'REQUEST_TEAM_USERS',
    teamId,
  };
}


function receiveUsers(data) {
  return {
    type: 'RECEIVE_USERS',
    data,
  };
}

function requestRemoveEntry(id, standupId) {
  return {
    type: 'REQUEST_REMOVE_ENTRY',
    id,
    standupId,
  };
}

function receiveRemoveEntry(id, standupId) {
  return {
    type: 'RECEIVE_REMOVE_ENTRY',
    id,
    standupId,
  };
}


function requestCreateUser() {
  return {
    type: 'REQUEST_CREATE_USER',
  };
}

function requestUpdateUser() {
  return {
    type: 'REQUEST_UPDATE_USER',
  };
}

function receiveCreateUser(payload) {
  return {
    type: 'RECEIVE_CREATE_USER',
    payload,
  };
}

function receiveUpdateUser(payload) {
  return {
    type: 'RECEIVE_UPDATE_USER',
    payload,
  };
}

function requestRemoveUser(id) {
  return {
    type: 'REQUEST_REMOVE_USER',
    id,
  };
}

function receiveRemoveUser(id) {
  return {
    type: 'RECEIVE_REMOVE_USER',
    id,
  };
}

function requestRemoveStandup(id) {
  return {
    type: 'REQUEST_REMOVE_STANDUP',
    id,
  };
}

function receiveRemoveStandup(id) {
  return {
    type: 'RECEIVE_REMOVE_STANDUP',
    id,
  };
}

function requestStandupTitles(teamId) {
  return {
    type: 'REQUEST_STANDUP_TITLES',
    teamId,
  };
}

function receiveStandupTitles({ data, err }) {
  return {
    type: 'RECEIVE_STANDUP_TITLES',
    data,
    err,
  };
}

function requestStandup(id) {
  return {
    type: 'REQUEST_STANDUP',
    id,
  };
}

function requestCreateStandup() {
  return {
    type: 'REQUEST_CREATE_STANDUP',
  };
}

function receiveCreateStandup({ data, error }) {
  return {
    type: 'RECEIVE_CREATE_STANDUP',
    data,
    error,
  };
}

function receiveStandup({ data, error }) {
  return {
    type: 'RECEIVE_STANDUP',
    data,
    error,
  };
}


function requestFetchNotes() {
  return {
    type: 'REQUEST_FETCH_NOTES',
  };
}

function receiveFetchNotes({ err, data }) {
  return {
    type: 'RECEIVE_FETCH_NOTES',
    err,
    data,
  };
}

function requestSendNotes(notes) {
  return {
    type: 'REQUEST_SEND_NOTES',
    notes,
  };
}

function receiveSendNotes({ err, data }) {
  return {
    type: 'RECEIVE_SEND_NOTES',
    err,
    data,
  };
}


export function fetchStandup(id) {
  return (dispatch) => {
    dispatch(requestStandup(id));

    return fetcher(`/api/v1/standups/${id}`)
    .catch(error => dispatch(receiveStandup({ error })))
    .then(data => dispatch(receiveStandup({ data })));
  };
}

export function setActiveStandup(id) {
  return (dispatch) => {
    // fetch it first
    dispatch(fetchStandup(id));

    return dispatch({
      type: 'SET_ACTIVE_STANDUP',
      id,
    });
  };
}


/**
 * Sync an entry value with the server
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function saveEntry(entry) {
  return (dispatch) => {
    // let the UI know we've requested a save
    dispatch(requestSaveEntry(entry.id));

    const entryProps = pick(entry, modelProps.entry);

    return fetcher(`/api/v1/entries/${entry.id}`, {
      method: 'PUT',
      body: JSON.stringify(entryProps),
    })
    .catch(error => dispatch(receiveSaveEntry({ error })))
    .then(data => dispatch(receiveSaveEntry({ data })));
  };
}

// Add an entry to a standup
export function createEntry(props) {
  return (dispatch) => {
    const { standupId, userId, teamId } = props;

    dispatch(requestCreateEntry({
      standupId,
      userId,
      teamId,
    }));

    const entryProps = {
      StandupId: standupId,
      UserId: userId,
    };

    return fetcher(`/api/v1/teams/${teamId}/entries`, {
      method: 'POST',
      body: JSON.stringify(entryProps),
    })
    .catch(error => dispatch(receiveEntry({ error })))
    .then(data => dispatch(receiveEntry({ data })));
  };
}


export function removeEntry(entryId, standupId) {
  return (dispatch) => {
    dispatch(requestRemoveEntry(entryId, standupId));

    return fetch(`/api/v1/entries/${entryId}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('ERROR');
      }
      dispatch(receiveRemoveEntry(entryId, standupId));
    });
  };
}


// fetch the last standup for a given team
export function fetchLastStandup(teamId) {
  return (dispatch) => {
    dispatch(requestLastStandup(teamId));

    return fetcher(`/api/v1/teams/${teamId}/laststandup`)
    .catch(error => dispatch(receiveStandup({ error })))
    .then((data) => {
      // last standup doesn't always exist
      if (data && data.id) {
        return dispatch(receiveStandup({ data }));
      }
      return false;
    });
  };
}


export function fetchStandupTitles(teamId) {
  return (dispatch) => {
    dispatch(requestStandupTitles(teamId));

    return fetch(`/api/v1/teams/${teamId}/standuptitles`)
    .then(response => response.json())
    .then(data => dispatch(receiveStandupTitles({ data })))
    .catch(err => dispatch(receiveStandupTitles({ err })));
  };
}


export function fetchUsers() {
  return (dispatch) => {
    dispatch(requestUsers());

    return fetch('/api/v1/users')
    .then(response => response.json())
    .then(json => normalize(json, arrayOf(normalizerSchemas.user)))
    .then(normalized => dispatch(receiveUsers(normalized)));
  };
}

export function fetchTeamUsers(teamId) {
  return (dispatch) => {
    dispatch(requestTeamUsers(teamId));

    return fetch(`/api/v1/teams/${teamId}/users`)
    .then(response => response.json())
    .then(json => normalize(json, arrayOf(normalizerSchemas.user)))
    .then(normalized => dispatch(receiveUsers(normalized)))
    .catch(error => console.error(error));
  };
}

export function createStandup(teamId) {
  return (dispatch) => {
    dispatch(requestCreateStandup(teamId));

    return fetcher(`/api/v1/teams/${teamId}/standups`, {
      method: 'POST',
    })
    .catch(error => dispatch(receiveCreateStandup({ error })))
    .then(data => dispatch(receiveCreateStandup({ data })));
  };
}

export function createUser(props) {
  return (dispatch) => {
    dispatch(requestCreateUser());

    return fetcher('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(props),
    })
    .then(json => normalize(json, normalizerSchemas.user))
    .then(normalized => dispatch(receiveCreateUser(normalized)));
  };
}

export function updateUser(props) {
  return (dispatch) => {
    dispatch(requestUpdateUser());
    return fetch(`/api/v1/users/${props.id}`, {
      method: 'PUT',
      body: JSON.stringify(props),
      headers: ajaxHeaders,
    })
    .then(response => response.json())
    .then(json => normalize(json, normalizerSchemas.user))
    .then(normalized => dispatch(receiveUpdateUser(normalized)));
  };
}

export function removeUser(userId) {
  return (dispatch) => {
    dispatch(requestRemoveUser(userId));

    return fetch(`/api/v1/users/${userId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      dispatch(receiveRemoveUser(userId));
    });
  };
}

export function removeStandup(standupId) {
  return (dispatch) => {
    dispatch(requestRemoveStandup(standupId));

    return fetch(`/api/v1/standups/${standupId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => dispatch(receiveRemoveStandup(standupId)));
  };
}

export function fetchNotes() {
  return (dispatch) => {
    dispatch(requestFetchNotes());

    return fetch('/api/v1/notes')
    .then(response => response.json())
    .then((data) => {
      dispatch(receiveFetchNotes({ data }));
    })
    .catch((err) => {
      dispatch(receiveFetchNotes({ err }));
    });
  };
}

export function sendNotes(notes) {
  return (dispatch) => {
    dispatch(requestSendNotes());

    return fetch('/api/v1/notes', {
      method: 'PUT',
      body: JSON.stringify({
        notes,
      }),
      headers: ajaxHeaders,
    })
    .then(response => response.json())
    .then((data) => {
      dispatch(receiveSendNotes({ data }));
      return data.notes;
    })
    .catch((err) => {
      dispatch(receiveSendNotes({ err }));
    });
  };
}
