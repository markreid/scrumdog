/**
 * Standup List Item component
 */

import React from 'react';
import { Component } from 'react';
import store from '../store';
import moment from 'moment';

import { setActiveStandup } from '../actions';

export default class StandupListItem extends Component {
    constructor() {
        super();

        this.setAsActive = this.setAsActive.bind(this);
    }

    render () {

        const cleanDate = moment(this.props.date).format('dddd D MMM');

        return (
            <li onClick={ this.setAsActive }>
                { cleanDate }
            </li>
        );
    }

    setAsActive () {
        return store.dispatch(setActiveStandup(this.props.id));
    }
}
