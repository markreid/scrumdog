/**
 * standup.jsx
 * Component for the standup view
 */


import React from 'react';
import { connect } from 'react-redux';

import Entry from './entry.jsx';
import UserList from './user-list.jsx';

const Standup = (props) => {
  const entries = (props.standup.Entries || []).map(entry => (
    <Entry
      key={entry.id}
      entry={entry}
      standupId={props.standup.id}
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

        <UserList standup={props.standup} team={props.activeTeam} />
      </div>

    </div>
  );
};


/**
 * Map the Redux store state to the props required for this component
 */
function StandupMapStateToProps(state) {
  return {
    activeTeam: state.activeTeam || null,
    activeTeamId: state.activeTeam ? state.activeTeam.id : null,
  };
}

export default connect(StandupMapStateToProps)(Standup);
