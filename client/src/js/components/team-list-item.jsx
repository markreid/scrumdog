/**
 * Team List Item component.
 * Display a team, edit it, delete it.
 */

import React, { Component } from 'react';
import autobind from 'autobind-decorator';

import store from '../store';
import { setActiveTeam, removeTeam, updateTeam } from '../ducks/teams';
import { fetchLastStandup } from '../actions';

import TeamUsers from './team-users';

@autobind
class TeamListItem extends Component {

  constructor(props) {
    super();
    this.state = {
      showDetail: false,
      confirmRemove: false,
      teamName: props.name,
    };
  }

  setActive() {
    store.dispatch(setActiveTeam(this.props.id));
    store.dispatch(fetchLastStandup(this.props.id));
  }

  removeTeam() {
    store.dispatch(removeTeam(this.props.id));
  }

  toggleConfirmRemove() {
    this.setState({
      confirmRemove: !this.state.confirmRemove,
    });
  }

  toggleShow() {
    this.setState({
      showDetail: !this.state.showDetail,
    });
  }

  nameChangeHandler(evt) {
    this.setState({
      teamName: evt.currentTarget.value,
    });
  }

  editSubmitHandler(evt) {
    evt.preventDefault();
    store.dispatch(updateTeam({
      id: this.props.id,
      name: this.state.teamName,
    }));
  }


  render() {
    const { name } = this.props;
    const { showDetail, confirmRemove } = this.state;

    return (<div className="team-list-item">
      <header>
        <a
          onClick={this.setActive}
          className="team-list-item__name"
        >{name}</a>
        <small>
          <a
            onClick={this.toggleShow}
            className="btn-edit"
          >edit</a>
        </small>
      </header>

      {showDetail && (<div className="team-list-item__detail">
        <div className="team-edit">
          <h2>Edit Team</h2>
          <form onSubmit={this.editSubmitHandler}>
            <input
              type="text"
              className="input"
              value={this.state.teamName}
              onChange={this.nameChangeHandler}
            />
            <button className="btn">Save</button>
          </form>
        </div>

        <div className="team-users">
          <h2>Users</h2>
          <TeamUsers {...this.props} />
        </div>

        <div className="team-remove">
          <h2>Remove Team</h2>
          <button onClick={this.toggleConfirmRemove} className="btn">Remove team</button>
          {confirmRemove && (
            <button onClick={this.removeTeam} className="btn alt">I am serious.</button>
          )}
        </div>

      </div>)}

    </div>);
  }
}

export default TeamListItem;
