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
        this.removeUser = this.removeUser.bind(this);
    }

    componentWillMount(){
        this.props.dispatch(fetchUsers());
    }

    render () {
        let users = this.props.users.map(user => <UserIcon key={user.id} id={user.id} onClick={this.clickHandler.bind(this, user.id)} />);
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

    clickHandler(userId, evt){
        // if they're not holding the shift key, it's an add entry
        if(!evt.shiftKey) return this.createEntry(userId);

        // if they are, we're deleting the user
        if(evt.shiftKey) return this.removeUser(userId);
    }

    createEntry(userId){
        this.props.dispatch(createEntry(this.props.standup.id, userId));
    }

    removeUser(userId){
        this.props.dispatch(removeUser(userId));
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
