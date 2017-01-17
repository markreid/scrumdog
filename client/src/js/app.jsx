/**
 * App.js
 * Entry point for the clientside code.
 * Will export to window.Scrumdog
 */


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import autobind from 'autobind-decorator';
import classnames from 'classnames';

import Standup from './components/standup.jsx';
import StandupSummary from './components/standup-summary.jsx';
import Checklist from './components/checklist.jsx';
import Sidebar from './components/sidebar.jsx';
import Header from './components/header.jsx';
import Notes from './components/notes.jsx';


import store from './store';

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

    return (<div>
      <div onClick={this.toggleLeftSidebar}>
        <Header />
      </div>
      <button onClick={this.toggleRightSidebar} style={{ float: 'right' }}>notes</button>

      <div className={wrapperClassName}>
        <div className="sidebar sidebar-left">
          <Sidebar />
        </div>
        <div className="content">
          <Standup />
          { false && <Checklist /> }
          <StandupSummary />
        </div>
        <div className="sidebar sidebar-right">
          <Notes />
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
