/**
 * standup.jsx
 * Component for the standup view
 */


import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

import Loader from './loader.jsx'
import Entry from './entry.jsx';
import UserList from './user-list.jsx';

import {createStandup, removeEntry, createEntry, changeEntryValue, saveEntry, fetchLastStandup, fetchUsers} from '../actions';


class Standup extends Component {


    renderFetching(){
        return <div id="standup">
            <Loader />
        </div>
    }

    render (){
        if(!this.props.standup) return '';

        // standup failed to fetch.
        if(this.props.standup.syncState.failed) return <div id="standup">
                <h4>Unable to fetch standup ({this.props.standup.syncState.error}).</h4>
                <p>Select an existing standup or create a new one from the toolbar.</p>
            </div>;



        let entries = this.props.entries.map((entryId) => <Entry id={entryId} key={entryId} standupId={this.props.standup.id} />)




        return (<div id="standup">

            {this.props.standup.syncState.failed && (
                <div className="standup-failed">
                    <h4>Unable to fetch standup: {this.props.standup.syncState.error}.</h4>
                    <p>Select an existing standup or create a new one from the toolbar.</p>
                </div>
            )}

            {this.props.standup.syncState.fetching &&
                <div className="standup-fetching">
                    <Loader />
                </div>
            }

            {this.props.standup.syncState.fetched && (

                <div className="standup-view">
                    <div className="entries">
                        <div className="entry header">
                            <div className="entry-column user"></div>
                            <div className="entry-column text">Yesterday</div>
                            <div className="entry-column text">Today</div>
                            <div className="entry-column text">Blocked by</div>
                            <div className="entry-column state"></div>
                        </div>

                        {entries}

                    </div>

                    <UserList standup={this.props.standup} />
                </div>
            )}

        </div>)
    }

    createStandup(){
        this.props.dispatch(createStandup());
    }

    componentWillMount (){
        // by default we'll grab the last standup
        this.props.dispatch(fetchLastStandup());
    }

}



/**
 * Map the Redux store state to the props required for this component
 */
function StandupMapStateToProps(state, ownProps){

    return {
        standup: state.standups[state.activeStandup],
        entries: state.standups[state.activeStandup].Entries || [],
        tasks: state.standups[state.activeStandup].Tasks || []
    }
}

export default connect(StandupMapStateToProps)(Standup);
