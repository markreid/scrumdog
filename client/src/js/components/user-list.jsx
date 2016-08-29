/**
 * user-list.jsx
 * Standup user list component
 * A list of users who are currently not in the standup.
 * Click them to add them in.
 */

import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import difference from 'lodash/difference';

import {removeUser, fetchUsers, createEntry} from '../actions';

import UserIcon from './user-icon.jsx';
import NewUserIcon from './new-user-icon.jsx';


class UserListComponent extends Component {
    constructor(){
        super();

        // no auto binding in ES6 classes, boooo.
        this.clickHandler = this.clickHandler.bind(this);
        this.createEntry = this.createEntry.bind(this);
    }

    componentWillMount(){
        this.props.dispatch(fetchUsers());
    }

    render () {
        let users = this.props.users.map(user => <UserIcon key={user.id} id={user.id} onClick={this.clickHandler} />);
        return (
            <div className="user-list">
                <header>
                    <h4>Add someone to this standup</h4>
                </header>
                <div className="users">
                    {users}
                    <NewUserIcon />
                </div>
            </div>
        );
    }

    clickHandler(userId){
        return this.createEntry(userId);
    }

    createEntry(userId){
        this.props.dispatch(createEntry(this.props.standup.id, userId));
    }
}

export default connect(function UserListMapStateToProps(state, ownProps){
    // the users is a list of users that aren't currently in the standup
    var standupEntries = ownProps.standup.Entries.map(id => state.entries[id]);
    var standupUserIds = standupEntries.map(entry => entry.UserId);
    var allUserIds = Object.keys(state.users).map(id => Number(id));
    var notStandupUserIds = difference(allUserIds, standupUserIds);

    return {
        users: notStandupUserIds.map(id => state.users[id]),
        standup: state.standups[state.activeStandup]
    }
})(UserListComponent);
