/**
 * entry.jsx
 * Component for a single entry
 */


import React, { Component } from 'react';
import autobind from 'autobind-decorator';

import Loader from './loader.jsx';
import UserIcon from './user-icon.jsx';
import EntryTextarea from './entry-textarea.jsx';

import { removeEntry, saveEntry } from '../actions';
import store from '../store';

@autobind
class EntryComponent extends Component {

  constructor(props) {
    super();
    const { lastDayTasks, todayTasks, blockers } = props.entry;
    this.state = {
      lastDayTasks,
      todayTasks,
      blockers,
    };
  }

  changeHandler(key, evt) {
    this.setState({
      [key]: evt.currentTarget.value,
    });
  }

  save() {
    const payload = Object.assign({}, this.state, {
      id: this.props.entry.id,
    });
    store.dispatch(saveEntry(payload));
  }

  remove() {
    const { id, standupId } = this.props.entry;
    store.dispatch(removeEntry(id, standupId));
  }

  render() {
    const { lastDayTasks, todayTasks, blockers } = this.state;

    return (
      <div className="entry" onBlur={this.save}>
        <div className="entry-column user">
          <UserIcon {...this.props.entry.User} onClick={this.remove} />
        </div>
        <div className="entry-column text">
          <EntryTextarea onChange={evt => this.changeHandler('lastDayTasks', evt)} value={lastDayTasks} />
        </div>
        <div className="entry-column text">
          <EntryTextarea onChange={evt => this.changeHandler('todayTasks', evt)} value={todayTasks} />
        </div>
        <div className="entry-column text">
          <EntryTextarea onChange={evt => this.changeHandler('blockers', evt)} value={blockers} />
        </div>
        <div className="entry-column state">
          {this.props.syncState && this.props.syncState.fetching &&
            <Loader size="tiny" />
          }
        </div>
      </div>
    );
  }

}

export default EntryComponent;
