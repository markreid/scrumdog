/**
 * user-list.jsx
 * Standup user list component
 * A list of users who are currently not in the standup.
 * Click them to add them in.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import difference from 'lodash/difference';
import autobind from 'autobind-decorator';

import { fetchTeamUsers, createEntry } from '../actions';

import UserIcon from './user-icon.jsx';
import NewUserIcon from './new-user-icon.jsx';

@autobind
class UserListComponent extends Component {


  componentWillMount() {
    this.props.dispatch(fetchTeamUsers(this.props.activeTeamId));
  }

  createEntry(userId) {
    return this.props.dispatch(createEntry(this.props.standup.id, userId));
  }

  render() {
    const users = this.props.users.map(user => (
      <UserIcon
        key={user.id}
        {...user}
        onClick={this.createEntry}
      />
    ));

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


}

export default connect((state, ownProps) => {
  // the users is a list of users that aren't currently in the standup
  const standupEntries = ownProps.standup.Entries;
  const standupUserIds = standupEntries.map(entry => entry.UserId);
  const allUserIds = Object.keys(state.users).map(id => Number(id));
  const notStandupUserIds = difference(allUserIds, standupUserIds);

  return {
    users: notStandupUserIds.map(id => state.users[id]),
    standup: ownProps.standup,
    activeTeamId: state.activeTeam ? state.activeTeam.id : null,
  };
})(UserListComponent);
