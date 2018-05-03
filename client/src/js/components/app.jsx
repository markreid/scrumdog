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
} from 'react-router-dom';

import store from '../store';

import Standup from './standup.jsx';
import StandupSummary from './standup-summary.jsx';
import Sidebar from './sidebar.jsx';
import Header from './header.jsx';
import Notes from './notes.jsx';
import Teams from './teams.jsx';
import UserTable from './user-table';
import Login from './login';
import AuthWrapper from './auth-wrapper';


class App extends Component {
  constructor() {
    super();

    this.state = {
      showSidebar: 0,
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
          <Header
            activeStandup={activeStandup}
            activeTeam={activeTeam}
            onLogoClick={() => this.toggleLeftSidebar()}
            auth={this.props.auth}
            toggleRightSidebar={() => this.toggleRightSidebar()}
          />
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
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => state;

const WithAuth = props => (
  <AuthWrapper {...props}>
    <App {...props} />
  </AuthWrapper>
);
const ConnectedWithAuth = connect(mapStateToProps)(WithAuth);

// Wrap it all in a Redux provider
const ProviderWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route path="/" component={ConnectedWithAuth} exact />
        <Route path="/login" component={Login} />
        <Route path="/users" component={UserTable} />
      </div>
    </BrowserRouter>
  </Provider>
);


export default ProviderWrapper;
