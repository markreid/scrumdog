/**
 * checklist.jsx
 * Component for the Checklist view
 */


import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

import Loader from './loader.jsx'

import {createStandup, removeEntry, createEntry, changeEntryValue, saveEntry, fetchLastStandup, fetchUsers} from '../actions';


class Checklist extends Component {

    constructor() {
        super();

        this.state = {
            expand: true,
        };

        this.toggleExpand = this.toggleExpand.bind(this);
    }

    render () {
        return <div id="checklist" className={ this.state.expand ? 'expand' : '' }>
            <button className="btn-checklist-expand" onClick={ this.toggleExpand }>...</button>
            <ul>
                <li>Timesheets</li>
                <li>JIRA</li>
                <li>Pull Requests</li>
                <li>Unassigned tickets</li>
            </ul>
        </div>
    }

    toggleExpand () {
        const expand = !this.state.expand;
        this.setState({
            expand,
        });
    }
}


/**
 * Map the Redux store state to the props required for this component
 */
function StandupMapStateToProps(state, ownProps){

    return {
        standup: state.activeStandup.data,
    }
}

//export default connect(StandupMapStateToProps)(Standup);

export default Checklist;
