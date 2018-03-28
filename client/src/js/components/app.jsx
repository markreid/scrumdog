/**
 * App.jsx
 * Entire app component.
 */


import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { Provider, connect } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Redirect
} from 'react-router-dom';

import store from '../store';

import Standup from './standup.jsx';
import StandupSummary from './standup-summary.jsx';
import Sidebar from './sidebar.jsx';
import Header from './header.jsx';
import Notes from './notes.jsx';
import Teams from './teams.jsx';
import UserTable from './user-table';


@autobind
class App extends Component {
  constructor() {
    super();

    this.state = {
      showSidebar: false,
    };
  }

  toggleLeftSidebar() {
    this.setState({
      showSidebar: this.state.showSidebar !== 1 ? 1 : 0,
    });
  }

  toggleRightSidebar() {
    this.setState({
      showSidebar: this.state.showSidebar !== 2 ? 2 : 0,
    });
  }

  render() {
    const { showSidebar } = this.state;

    const wrapperClassName = classnames('sidebar-wrapper', {
      'show-left': showSidebar === 1,
      'show-right': showSidebar === 2,
    });

    const { activeTeam, activeStandup } = this.props;

    // // if you haven't selected a team, do that first.
    if (!activeTeam) {
      return <Teams />;
    }

    return (
      <div>
        <div>
          <Header onLogoClick={this.toggleLeftSidebar} />
        </div>

        <div className={wrapperClassName}>
          <div className="sidebar sidebar-left">
            <Sidebar />
          </div>
          <div className="content">
            {activeStandup &&
              <div>
                <Standup standup={activeStandup} />
                <StandupSummary standup={activeStandup} team={activeTeam} />
              </div>
            }
          </div>
          <div className="sidebar sidebar-right">
            { false && <Notes />}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeStandup: state.activeStandup,
  activeTeam: state.activeTeam,
});
const ConnectedApp = connect(mapStateToProps)(App);


// basic router. right now it's only users or "everything else"
const Router = () => (<div>
  <Route path="/" component={ConnectedApp} exact />
  <Route path="/users" component={UserTable} />
</div>);

// Wrap app in a Provider so redux parts get passed in to context
const ProviderWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>
);


export default ProviderWrapper;
