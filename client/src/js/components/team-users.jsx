/**
 * Team Users component.
 * List and edit the Users in a Team.
 */

import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';

import { fetchUsers } from '../actions';
import { addUserToTeam, removeUserFromTeam } from '../ducks/teams';

import UserIcon from './user-icon';

@autobind
class TeamUsers extends Component {
  componentWillMount() {
    this.props.dispatch(fetchUsers());
  }

  addToTeam(userId) {
    const teamId = this.props.id;
    this.props.dispatch(addUserToTeam({
      userId,
      teamId,
    }));
  }

  removeFromTeam(userId) {
    const teamId = this.props.id;
    this.props.dispatch(removeUserFromTeam({
      userId,
      teamId,
    }));
  }

  render() {
    const { Users, nonTeamUsers } = this.props;

    return (<div className="team-users">
      <div className="on-team">
        <p>Users on this team (click to remove)</p>
        {Users.map(user => (
          <UserIcon
            key={user.id}
            {...user}
            onClick={this.removeFromTeam}
          />
        ))}
      </div>

      <div className="not-on-team">
        <p>Other Users (click to add)</p>
        {nonTeamUsers.map(user => (
          <UserIcon
            key={user.id}
            {...user}
            onClick={this.addToTeam}
          />
        ))}
      </div>
    </div>);
  }
}

export default connect((state, ownProps) => {
  const { Users } = ownProps;

  const teamUserIds = Users.map(user => user.id);
  const allUsers = Object.keys(state.users).map(key => state.users[key]);
  const nonTeamUsers = allUsers.filter(user => !teamUserIds.includes(user.id));

  return {
    Users,
    allUsers,
    nonTeamUsers,
  };
})(TeamUsers);
