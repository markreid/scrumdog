/**
 * Team List Item component.
 * Display a team, edit it, delete it.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import store from '../store';
import { setActiveTeam, removeTeam } from '../ducks/teams';


@autobind
class TeamListItem extends Component {

  constructor() {
    super();
    this.state = {
      showDetail: false,
      confirmRemove: false,
    };
  }

  setActive() {
    store.dispatch(setActiveTeam(this.props.id));
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


  render() {
    const { name, id } = this.props;
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
        <button onClick={this.toggleConfirmRemove} className="btn">Remove team</button>
        {confirmRemove && (
          <button onClick={this.removeTeam} className="btn alt">I am serious.</button>
        )}

      </div>)}

    </div>);
  }
}

export default TeamListItem;
