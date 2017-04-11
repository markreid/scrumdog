/**
 * Sidebar component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import StandupListItem from './standup-list-item.jsx';
import { createStandup, fetchStandupTitles, removeStandup } from '../actions';

const NUM_VISIBLE_STANDUPS = 10;

@autobind
class Sidebar extends Component {

  static propTypes() {
    return {
      dispatch: React.PropTypes.function,
      activeStandup: React.PropTypes.object,
      standupTitles: React.PropTypes.array,
    };
  }

  constructor() {
    super();

    this.state = {
      showAll: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchStandupTitles(this.props.activeTeam.id));
  }

  createStandup() {
    this.props.dispatch(createStandup(this.props.activeTeam.id));
  }

  deleteActiveStandup() {
    this.props.dispatch(removeStandup(this.props.activeStandup.id));
  }

  toggleShowAll() {
    this.setState({
      showAll: !this.state.showAll,
    });
  }

  render() {
    const { standupTitles } = this.props;
    const { showAll } = this.state;

    const standupItems = standupTitles
    .slice(0, showAll ? standupTitles.length : NUM_VISIBLE_STANDUPS)
    .map((standup, key) => (
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
        <button onClick={this.toggleShowAll}>{ showAll ? `Show ${NUM_VISIBLE_STANDUPS}` : 'Show All' }</button>
      </div>
    );
  }
}

export default connect(state => ({
  standupTitles: state.standupTitles,
  activeStandup: state.activeStandup,
  activeTeam: state.activeTeam,
}))(Sidebar);
