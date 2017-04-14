/**
 * user-list.jsx
 * Standup user list component
 * A list of users who are currently not in the standup.
 * Click them to add them in.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { Link } from 'react-router-dom';

import { createEntry } from '../actions';

import UserIcon from './user-icon.jsx';

@autobind
class UserListComponent extends Component {

  createEntry(userId) {
    return this.props.dispatch(createEntry({
      teamId: this.props.team.id,
      standupId: this.props.standup.id,
      userId,
    }));
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
          <h3>Add someone to this standup:</h3>
        </header>
        <div className="users">
          {users}
        </div>
        <Link to="/users" className="link-manage-users">Manage users &raquo;</Link>
      </div>
    );
  }


}

export default connect((state, ownProps) => {
  // we show team users that don't have an entry in the standup
  const standupEntries = ownProps.standup.Entries;
  const standupUserIds = standupEntries.map(entry => entry.UserId);
  const teamUsers = ownProps.team.Users;
  const users = teamUsers.filter(user => !standupUserIds.includes(user.id));

  return {
    users,
    standup: ownProps.standup,
    activeTeamId: state.activeTeam ? state.activeTeam.id : null,
  };
})(UserListComponent);
