/**
 * standup.jsx
 * Component for the standup view
 */


import React, { Component } from 'react';
import { connect } from 'react-redux';

import Entry from './entry.jsx';
import UserList from './user-list.jsx';

class Standup extends Component {

  render() {
    const entries = (this.props.standup.Entries || []).map(entry => (
      <Entry
        key={entry.id}
        entry={entry}
        standupId={this.props.standup.id}
      />
    ));

    return (
      <div id="standup">
        <div className="standup-view">
          <div className="entries">
            <div className="entry header">
              <div className="entry-column user" />
              <div className="entry-column text">Yesterday</div>
              <div className="entry-column text">Today</div>
              <div className="entry-column text">Blocked by</div>
              <div className="entry-column state" />
            </div>
            {entries}
          </div>

          <UserList standup={this.props.standup} />
        </div>

      </div>
    );
  }

}


/**
 * Map the Redux store state to the props required for this component
 */
function StandupMapStateToProps(state) {
  return {
    activeTeamId: state.activeTeam ? state.activeTeam.id : null,
  };
}

export default connect(StandupMapStateToProps)(Standup);
