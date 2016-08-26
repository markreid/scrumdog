/**
 * standup-summary.jsx
 * Component for the standup summary view
 */


import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

import store from '../store';
import Loader from './loader.jsx'
import SummaryEntry from './summary-entry.jsx';
import UserList from './user-list.jsx';

import {createStandup, removeEntry, createEntry, changeEntryValue, saveEntry, fetchLastStandup, fetchUsers} from '../actions';


window.store = store;

class StandupSummary extends Component {

    renderFetching(){
        return <div id="standup">
            <Loader />
        </div>
    }

    render (){
        if(!this.props.standup) return '';

        let entries = this.props.entries.map(entryId => generateEntryString(entryId));
        let entriesString = entries.join('');

        return (<div id="standup-summary">

            {this.props.standup.syncState.fetching &&
                <div className="standup-fetching">
                    <Loader />
                </div>
            }

            {this.props.standup.syncState.fetched && (

                <div className="standup-summary-view">
                    <h4>Copy-Pasta summary</h4>
                    <button onClick={this.copy}>copy</button>
                    <pre>{entriesString}</pre>
                </div>
            )}

        </div>)
    }

    copy(){
        var range = document.createRange();
        range.selectNode(document.querySelector('.standup-summary-view pre'));
        window.getSelection().addRange(range);
        console.log(document.execCommand('copy'));
        window.getSelection().removeAllRanges();
    }

}

function generateEntryString(entryId){
    // this is probably not the right way to do this...

    var entry = store.getState().entries[entryId];
    var user = store.getState().users[entry && entry.User];

    if(!entry || !user) return '';

    // generate the user's initials
    var names = user.fullName.split(' ');
    var initials = names.length > 1 ? (names[0][0] + names[names.length-1][0]) : names[0][0] + names[0][names[0].length-1];

    // now create a string
    var str = `@${user.nickname}
        --
        ${entry.todayTasks || 'no tasks'}
    `;

    if(entry.blockers){
        str += `\nBLOCKED BY:
            ${entry.blockers}
        `;
    }

    str += '\n\n';

    // tidy it up a bit
    var cleanString = str.replace(/\n\ */gm, '\n').replace(/•/gm, '*');

    return cleanString;
}


/**
 * Map the Redux store state to the props required for this component
 */
function StandupSummaryMapStateToProps(state, ownProps){

    return {
        standup: state.standups[state.activeStandup],
        entries: state.standups[state.activeStandup].Entries || [],
        tasks: state.standups[state.activeStandup].Tasks || [],
        users: state.users || []
    }
}

export default connect(StandupSummaryMapStateToProps)(StandupSummary);
