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

    return (<div className="list-table__list__item">
      <header className="list-table__list__item__header">
        <a
          onClick={this.setActive}
          className="list-table__list__item__title"
        >{name}</a>
        <small>
          <a
            onClick={this.toggleShow}
            className="list-table__list__item__btn-edit"
          >edit</a>
        </small>
      </header>

      {showDetail && (
        <div className="team-list-item__detail">
          <div className="team-edit edit-section">
            <h2 className="edit-section__title">Edit Team</h2>
            <section className="edit-section__content">
              <form onSubmit={this.editSubmitHandler}>
                <input
                  type="text"
                  className="input"
                  value={this.state.teamName}
                  onChange={this.nameChangeHandler}
                />
                <button className="btn">Save</button>
              </form>
            </section>
          </div>

          <div className="team-users edit-section">
            <h2 className="edit-section__title">Users</h2>
            <section className="edit-section__content">
              <TeamUsers {...this.props} />
            </section>
          </div>

          <div className="team-remove edit-section">
            <h2 className="edit-section__title">Remove Team</h2>
            <section className="edit-section__content">
              <button onClick={this.toggleConfirmRemove} className="btn">Remove team</button>
              {confirmRemove && (
                <button onClick={this.removeTeam} className="btn alt">I am serious.</button>
              )}
            </section>
          </div>
        </div>
      )}

    </div>);
  }
}

export default TeamListItem;
