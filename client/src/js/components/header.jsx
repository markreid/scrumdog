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

    const title = moment(activeStandup.date).format('dddd Do MMMM');
    return (<header id="header">
      <b>Scrumdog</b> { title }
      <span onClick={this.resetActiveTeam}>{ activeTeam.name }</span>
    </header>);
  }
}

export default connect(state => ({
  activeStandup: state.standups[state.activeStandup],
  activeTeam: state.activeTeam,
}))(Header);
