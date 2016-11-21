/**
 * Sidebar component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import StandupListItem from './standup-list-item.jsx';
import { createStandup, fetchStandupTitles, removeStandup } from '../actions';

@autobind
class Sidebar extends Component {

  static propTypes() {
    return {
      dispatch: React.PropTypes.function,
      activeStandup: React.PropTypes.object,
      standupTitles: React.PropTypes.array,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchStandupTitles());
  }

  createStandup() {
    this.props.dispatch(createStandup());
  }

  deleteActiveStandup() {
    this.props.dispatch(removeStandup(this.props.activeStandup.id));
  }

  render() {
    const { standupTitles } = this.props;
    const standupItems = standupTitles.map((standup, key) => (
      <StandupListItem {...standup} key={key} />
    ));

    return (
      <div id="sidebar">
        <div className="actions">
          <button onClick={this.createStandup}>New Standup</button>
          <button onClick={this.deleteActiveStandup}>Delete Current</button>
        </div>

        <ul className="standup-list">
          { standupItems }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({
  standupTitles: Object.keys(state.standupTitles).map(id => state.standupTitles[id]),
  activeStandup: state.standups[state.activeStandup],
}))(Sidebar);
