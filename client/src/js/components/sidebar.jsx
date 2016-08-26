/**
 * Sidebar component
 */

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Loader from './loader.jsx';
import StandupListItem from './standup-list-item.jsx';
import { createStandup, fetchStandupTitles, removeStandup } from '../actions';

class Sidebar extends Component {
    constructor() {
        super();

        this.createStandup = this.createStandup.bind(this);
        this.deleteActiveStandup = this.deleteActiveStandup.bind(this);
    }

    componentWillMount() {
    this.props.dispatch(fetchStandupTitles());
    }

    render () {
        const standupItems = this.props.standupTitles.map((standup, key) => <StandupListItem { ...standup } key={ key }/>);

        return (
            <div id="sidebar">

                <div className="actions">
                    <button onClick={ this.createStandup }>New Standup</button>
                    <button onClick={ this.deleteActiveStandup }>Delete Current</button>
                </div>

                <ul className="standup-list">
                    { standupItems }
                </ul>
            </div>
        );
    }

    createStandup() {
        this.props.dispatch(createStandup());
    }

    deleteActiveStandup() {
        this.props.dispatch(removeStandup(this.props.activeStandup.id));
    }

}

export default connect((state, ownProps) => {
    return {
        standupTitles: Object.keys(state.standupTitles).map(id => state.standupTitles[id]),
        activeStandup: state.standups[state.activeStandup],
    }
})(Sidebar);
