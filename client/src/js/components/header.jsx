/**
 * Header
 * Just shows the currently active Standup
 */

import React from 'react';
import moment from 'moment';

import AuthHeader from './auth-header';

const Header = (props) => {
  const { activeStandup, activeTeam } = props;

  const title = activeStandup ?
    moment(activeStandup.date).format('dddd Do MMMM')
    : '';

  return (
    <header id="header">
      <h1
        className="logo"
        onClick={props.onLogoClick}
      >🐕 Scrumdog</h1>
      <h2
        className="standup-title"
      >{title}</h2>
      <h2
        className="team-name"
        onClick={props.toggleRightSidebar}
      >{ activeTeam.name }</h2>
      <AuthHeader auth={props.auth} />
    </header>
  );
};

export default Header;
