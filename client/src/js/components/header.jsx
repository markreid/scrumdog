/**
 * Header
 * Just shows the currently active Standup
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import autobind from 'autobind-decorator';

import { resetActiveTeam } from '../ducks/teams';

@autobind
class Header extends Component {

  resetActiveTeam() {
    this.props.dispatch(resetActiveTeam());
  }

  render() {
    const { activeStandup, activeTeam } = this.props;

    const title = activeStandup ?
      moment(activeStandup.date).format('dddd Do MMMM')
      : '';
    return (<header id="header">
      <h1
        className="logo"
        onClick={this.props.onLogoClick}
      >Scrumdog</h1>
      <h2
        className="standup-title"
      >{title}</h2>
      <h2
        className="team-name"
        onClick={this.resetActiveTeam}
      >{ activeTeam.name }</h2>
    </header>);
  }
}

export default connect(state => ({
  activeStandup: state.activeStandup,
  activeTeam: state.activeTeam,
}))(Header);
