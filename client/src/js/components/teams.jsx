/**
 * Teams component
 * List the teams, allow you to set one as active
 */


import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { fetchTeams, addTeam } from '../ducks/teams';


import TeamListItem from './team-list-item';

@autobind
class Teams extends Component {

  constructor() {
    super();
    this.state = {
      teamName: '',
      showAdd: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchTeams());
  }

  setTeamName(evt) {
    const teamName = evt.currentTarget.value;
    this.setState({
      teamName,
    });
  }

  toggleShowAdd() {
    this.setState({
      showAdd: !this.state.showAdd,
    });
  }

  addTeam(evt) {
    evt.preventDefault();
    this.props.dispatch(addTeam({
      name: this.state.teamName,
    }));
    this.setState({
      teamName: '',
    });
  }

  render() {
    const { teams } = this.props;
    const { showAdd } = this.state;

    return (<div className="teams">
      <div className="list-table">
        <header className="list-table__header">
          <h1 className="list-table__header__title">Select a Team</h1>
        </header>

        <div className="list-table__list">
          {teams.map(team => <TeamListItem key={team.id} {...team} />)}
        </div>

        <a
          onClick={this.toggleShowAdd}
          className="list-table__btn-add"
        >Add a team...</a>

        {showAdd && (
          <form
            onSubmit={this.addTeam}
            className="list-table__form-add"
          >
            <input
              className="input"
              onChange={this.setTeamName}
              value={this.state.teamName}
              placeholder="Team Name"
            />
            <button type="submit" className="btn alt">Add Team</button>
          </form>
        )}
      </div>

    </div>);
  }
}

export default connect(state => ({
  teams: state.teams.data,
}))(Teams);
