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

  render() {
    const { Users, nonTeamUsers } = this.props;

    return (<div className="team-users">
      <h3>Users on this team</h3>

      {Users.map(user => (
        <p key={user.id}>
          {user.fullName}
          &nbsp;
          <button
            onClick={() => this.removeFromTeam(user.id)
          }>x</button>
        </p>)
      )}

      <h3>Add a user to this team</h3>
      {nonTeamUsers.map(user => (
        <UserIcon
          key={user.id}
          {...user}
          onClick={this.addToTeam}
        />
      ))}
    </div>);
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
