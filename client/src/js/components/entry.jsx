/**
 * entry.jsx
 * Component for a single entry
 */


import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import Loader from './loader.jsx'
import UserIcon from './user-icon.jsx';
import EntryTextarea from './entry-textarea.jsx';


import {removeEntry, createEntry, changeEntryValue, saveEntry, fetchStandup, fetchUsers} from '../actions';


class EntryComponent extends Component {
    constructor (){
        super();
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
    }

    render (){
        return (
            <div className="entry" onBlur={this.save}>
                <div className="entry-column user">
                    <UserIcon id={this.props.UserId} onClick={this.remove.bind(this)} />
                </div>
                <div className="entry-column text">
                    <EntryTextarea onChange={this.changeHandler.bind(this, 'lastDayTasks')} value={this.props.lastDayTasks} />
                </div>
                <div className="entry-column text">
                    <EntryTextarea onChange={this.changeHandler.bind(this, 'todayTasks')} value={this.props.todayTasks} />
                </div>
                <div className="entry-column text">
                    <EntryTextarea onChange={this.changeHandler.bind(this, 'blockers')} value={this.props.blockers} />
                </div>
                <div className="entry-column state">
                    {this.props.syncState.fetching &&
                        <Loader size="tiny" />
                    }
                </div>
            </div>
        );
    }

    changeHandler (key, evt){
        this.props.dispatch(changeEntryValue({
            id: this.props.id,
            key: key,
            value: evt.currentTarget.value
        }));
    }

    toggleHandler (key, evt){
        this.props.dispatch(changeEntryValue({
            id: this.props.id,
            key: key,
            value: !!evt.currentTarget.checked
        }));
    }

    save(){
        console.log('saving');
        this.props.dispatch(saveEntry(this.props))
    }

    remove(){
        this.props.dispatch(removeEntry(this.props.id, this.props.standupId));
    }


}
export default connect(function(state, ownProps){
    return state.entries[ownProps.id] || {};
})(EntryComponent);


