/**
 * Header
 * Just shows the currently active Standup
 */

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class Header extends Component {
    render (){
        const title = moment(this.props.activeStandup.date).format('dddd Do MMMM');
        return <header id="header"><b>Scrumdog</b> { title }</header>;
    }
}

export default connect(state => ({
    activeStandup: state.standups[state.activeStandup],
}))(Header);
