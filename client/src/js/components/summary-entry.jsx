/**
 * summary-entry.jsx
 * Component for a single entry in the summary view
 */


import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

import Loader from './loader.jsx'
import UserIcon from './user-icon.jsx';
import EntryTextarea from './entry-textarea.jsx';


import {fetchStandup, fetchUsers} from '../actions';


class EntryComponent extends Component {
    render (){

        var names = this.props.user.fullName.split(' ');
        var initials = names.length > 1 ? (names[0][0] + names[names.length-1][0]) : names[0][0] + names[0][names[0].length-1];

        var str = `
            ${initials.toUpperCase()}
            --

            ${this.props.todayTasks || 'no tasks'}
        `;

        if(this.props.blockers){
            str += `\nBLOCKED BY:
                ${this.props.blockers}
            `;
        }

        str += '\n';

        var cleanString = str.replace(/\n\ */gm, '\n').replace(/•/gm, '*');

        return (
            <div className="entry-summary">
                <pre>{cleanString}</pre>
            </div>
        );
    }

}
export default connect(function(state, ownProps){
    var entry = state.entries[ownProps.id] || {};
    var merged = Object.assign(entry, {
        user: state.users[entry.UserId] || {}
    });
    return merged;
})(EntryComponent);


