/**
 * App.js
 * Entry point for the clientside code.
 * Will export to window.Scrumdog
 */


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import autobind from 'autobind-decorator';

import Standup from './components/standup.jsx';
import StandupSummary from './components/standup-summary.jsx';
import Checklist from './components/checklist.jsx';
import Sidebar from './components/sidebar.jsx';
import Header from './components/header.jsx';


import store from './store';

@autobind
class App extends Component {
  constructor() {
    super();

    this.state = {
      showSidebar: false,
    };
  }

  toggleSidebar() {
    this.setState({
      showSidebar: !this.state.showSidebar,
    });
  }

  render() {
    const wrapperClassName = `sidebar-wrapper ${this.state.showSidebar ? 'show' : ''}`;

    return (<div>
      <div onClick={this.toggleSidebar}>
        <Header />
      </div>

      <div className={wrapperClassName}>
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Standup />
          { false && <Checklist /> }
          <StandupSummary />
        </div>
      </div>
    </div>);
  }
}


/**
 * Wraps the App component in a react-redux Provider
 * so the store state is passed in as props.
 * niiiiiiice
 */
const ProviderWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);


ReactDOM.render(<ProviderWrapper />, document.querySelector('#scrumdog-application'));
