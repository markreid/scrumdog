/**
 * actions.js
 * Redux actions
 */

import { normalize, arrayOf } from 'normalizr';
import pick from 'lodash/pick';

import normalizerSchemas from './normalizers';
import store from './store';



// properties of each model that we want to _pick before syncing
// todo - this should be in api.js
const modelProps = {
    entry: ['lastDayTasks', 'blockers', 'todayTasks', 'UserId'],
    standup: ['title']
};


const ajaxHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


// update one of the properties
export function changeEntryValue(payload){
    return {
        type: 'CHANGE_ENTRY_VALUE',
        id: payload.id,
        key: payload.key,
        value: payload.value
    }
}

// a request to save entry data to the server is in progress
function requestSaveEntry(id){
    console.log('requestSaveEntryValue!');
    return {
        type: 'REQUEST_SAVE_ENTRY_VALUE',
        id
    }
}

// a request to save entry data to the server has completed and we have the results
function receiveSaveEntry(data){
    console.log('receiveSaveEntryValue!');
    return {
        type: 'RECEIVE_SAVE_ENTRY_VALUE',
        id: data.id,
        key: data.key
    }
}

function failSaveEntry(id){
    return {
        type: 'FAIL_SAVE_ENTRY',
        id
    }
}

function requestLastStandup(){
    return {
        type: 'REQUEST_LAST_STANDUP'
    }
}

function receiveLastStandup(data){
    return {
        type: 'RECEIVE_LAST_STANDUP',
        data
    }
}

function requestLastStandupFailed(err){
    return {
        type: 'REQUEST_LAST_STANDUP_FAILED',
        err
    }
}




function receiveStandupUpdate(data){
    return {
        type: 'RECEIVE_STANDUP_UPDATE',
        data
    }
}

function receiveEntry(data){
    return {
        type: 'RECEIVE_ENTRY',
        data
    }
}

function requestUsers(data){
    return {
        type: 'REQUEST_USERS',
        data
    }
}

// asking the server to create a new entry
let requestCreateEntry = function(standupId, userId){
    return {
        type: 'REQUEST_CREATE_ENTRY',
        standupId,
        userId
    }
}


let receiveUsers = function(data){
    return {
        type: 'RECEIVE_USERS',
        data
    };
}

let requestRemoveEntry = function(id, standupId){
    return {
        type: 'REQUEST_REMOVE_ENTRY',
        id,
        standupId
    }
}

let receiveRemoveEntry = function(id, standupId){
    return {
        type: 'RECEIVE_REMOVE_ENTRY',
        id,
        standupId
    }
}

let requestSaveStandupTitle = function(){
    return {
        type: 'REQUEST_SAVE_STANDUP_TITLE'
    }
}

let requestCreateUser = function(){
    return {
        type: 'REQUEST_CREATE_USER'
    }
};

let requestUpdateUser = function() {
    return {
        type: 'REQUEST_UPDATE_USER'
    };
};

let receiveCreateUser = function(payload){
    return {
        type: 'RECEIVE_CREATE_USER',
        payload
    }
};

let receiveUpdateUser = (payload) => ({
    type: 'RECEIVE_UPDATE_USER',
    payload,
});

let requestRemoveUser = function(id){
    return {
        type: 'REQUEST_REMOVE_USER',
        id
    }
};

let receiveRemoveUser = function(id){
    return {
        type: 'RECEIVE_REMOVE_USER',
        id
    }
}

let requestRemoveStandup = function(id){
    return {
        type: 'REQUEST_REMOVE_STANDUP',
        id
    }
};

let receiveRemoveStandup = function(id){
    return {
        type: 'RECEIVE_REMOVE_STANDUP',
        id
    }
};

let requestStandupTitles = function(){
    return {
        type: 'REQUEST_STANDUP_TITLES'
    }
};

let receiveStandupTitles = function(data){
    return {
        type: 'RECEIVE_STANDUP_TITLES',
        data
    }
};

let requestStandup = function(id){
    return {
        type: 'REQUEST_STANDUP',
        id
    }
};

let requestCreateStandup = function(){
    return {
        type: 'REQUEST_CREATE_STANDUP'
    }
};

let receiveCreateStandup = function(data){
    return {
        type: 'RECEIVE_CREATE_STANDUP',
        data
    }
};

let receiveStandup = function(data){
    return {
        type: 'RECEIVE_STANDUP',
        data
    }
};


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


export function setActiveStandup(id){
    return dispatch => {

        // fetch it first
        dispatch(fetchStandup(id));

        return dispatch({
            type: 'SET_ACTIVE_STANDUP',
            id
        });
    }
};

export function fetchStandup(id){
    return dispatch => {
        dispatch(requestStandup(id));

        return fetch('/api/v1/standups/' + id)
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.standup))
        .then(normalized => dispatch(receiveStandup(normalized)));
    }
}

/**
 * Sync an entry value with the server
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function saveEntry(entry){
    return dispatch => {
        // let the UI know we've requested a save
        dispatch(requestSaveEntry(entry.id));

        var entryProps = pick(entry, modelProps.entry);

        return fetch('/api/v1/entries/' + entry.id, {
            method: 'PUT',
            body: JSON.stringify(entryProps),
            headers: ajaxHeaders
        })
        .then(function(response){
            if(response.status >= 400){
                throw new Error('CRAP');
            }
            return response;
        })
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.entry))
        .then(normalized => {
            dispatch(receiveEntry(normalized));
        }).catch(function(err){
            console.error(err);
            console.trace();
            dispatch(failSaveEntry(entry.id));
        });
    }
}


// create an entry on the server
export function createEntry(standupId, userId){
    return dispatch => {
        dispatch(requestCreateEntry(standupId, userId));

        var entryProps = {
            StandupId: standupId,
            UserId: userId
        };

        return fetch('/api/v1/entries', {
            method: 'POST',
            body: JSON.stringify(entryProps),
            headers: ajaxHeaders
        })
        .then(function(response){
            if(response.status >= 400){
                // todo - if the status is an error then we need to
                // parse the json and bubble that. not sure how...?
                throw new Error('ERROR');
            }
            return response;
        })
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.entry))
        .then(normalized => {
            dispatch(receiveEntry(normalized));
        });
    }
}


export function removeEntry(entryId, standupId){
    return dispatch => {
        dispatch(requestRemoveEntry(entryId, standupId));

        return fetch('/api/v1/entries/' + entryId, {
            method: 'DELETE'
        })
        .then(function(response){
            if(response.status >= 400){
                throw new Error('ERROR');
            }
            dispatch(receiveRemoveEntry(entryId, standupId));
        });
    }
}


// fetch standup data from the REST API
// dispatches normalized standup, entries and users data
export function fetchLastStandup(){
    return dispatch => {
        dispatch(requestLastStandup());

        return fetch('/api/v1/laststandup')
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.standup))
        .then(function(normalized){
            // if we got nothing...
            if(!normalized.result){
                return dispatch(requestLastStandupFailed(404));
            }
            return dispatch(receiveLastStandup(normalized));
        })
        .catch(err => {
            console.error(err.stack);
        });
    }
}


export function fetchStandupTitles(){
    return dispatch => {
        dispatch(requestStandupTitles());

        return fetch('/api/v1/standuptitles')
        .then(response => response.json())
        .then(json => normalize(json, arrayOf(normalizerSchemas.standupTitles)))
        .then(normalized => dispatch(receiveStandupTitles(normalized)));
    };
}


export function fetchUsers(){
    // todo - only do this once unless explicitly asked?
    return dispatch => {
        dispatch(requestUsers());

        return fetch('/api/v1/users')
        .then(response => response.json())
        .then(json => normalize(json, arrayOf(normalizerSchemas.user)))
        .then(normalized => dispatch(receiveUsers(normalized)));
    }
}

export function createStandup(){
    return dispatch => {
        dispatch(requestCreateStandup());

        return fetch('/api/v1/standups', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(function(json){
            // for now, set Entries to an empty array
            // but soon the API will populate it itself
            json.Entries = [];
            return normalize(json, normalizerSchemas.standup)
        })
        .then(normalized => dispatch(receiveCreateStandup(normalized)));
    }
}

export function createUser(modelProps){
    return dispatch => {
        dispatch(requestCreateUser());

        return fetch('/api/v1/users', {
            method: 'POST',
            body: JSON.stringify(modelProps),
            headers: ajaxHeaders
        })
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.user))
        .then(normalized => dispatch(receiveCreateUser(normalized)));
    }
}

export function updateUser(props){
    return dispatch => {
        dispatch(requestUpdateUser());
        return fetch(`/api/v1/users/${props.id}`, {
            method: 'PUT',
            body: JSON.stringify(props),
            headers: ajaxHeaders
        })
        .then(response => response.json())
        .then(json => normalize(json, normalizerSchemas.user))
        .then(normalized => dispatch(receiveUpdateUser(normalized)));
    }
}

export function removeUser(userId){
    return dispatch => {
        dispatch(requestRemoveUser(userId));

        return fetch('/api/v1/users/' + userId, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(function(json){
            return json;
        })
        .then(function(){
            dispatch(receiveRemoveUser(userId));
        });
    }
}

export function removeStandup(standupId){
    return dispatch => {
        dispatch(requestRemoveStandup(standupId));

        return fetch('/api/v1/standups/' + standupId, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(function(json){
            return json
        })
        .then(function(){
            dispatch(receiveRemoveStandup(standupId));
        });
    }
}

export function fetchNotes() {
    return dispatch => {
        dispatch(requestFetchNotes());

        return fetch('/api/v1/notes')
        .then(response => response.json())
        .then(data => {
            dispatch(receiveFetchNotes({ data }));
        })
        .catch(err => {
            dispatch(receiveFetchNotes({ err }));
        });
    }
}

export function sendNotes(notes) {
    return dispatch => {
        dispatch(requestSendNotes());

        return fetch('/api/v1/notes', {
            method: 'PUT',
            body: JSON.stringify({
                notes,
            }),
            headers: ajaxHeaders,
        })
        .then(response => response.json())
        .then(data => {
            dispatch(receiveSendNotes({ data }));
            return data.notes;
        })
        .catch(err => {
            dispatch(receiveSendNotes({ err }));
        });
    };
}
