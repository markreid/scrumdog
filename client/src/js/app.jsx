/**
 * App.js
 * Entry point for the clientside code.
 * Will export to window.Scrumdog
 */


var React = require('react');
import {Component} from 'react';
import {connect, Provider} from 'react-redux';

import Standup from './components/standup.jsx';
import StandupSummary from './components/standup-summary.jsx';
import Checklist from './components/checklist.jsx';
import Sidebar from './components/sidebar.jsx';
import Header from './components/header.jsx';


import store from './store';

import {createStandup} from './actions';


class App extends Component {
    constructor() {
        super();

        this.state = {
            showSidebar: false,
        };
    }

    render() {
        const toggleSidebar = this.toggleSidebar.bind(this);
        const wrapperClassName = 'sidebar-wrapper ' + (this.state.showSidebar ? 'show' : '');

        return <div>
            <div onClick={ toggleSidebar }>
                <Header />
            </div>

            <div className={ wrapperClassName }>
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="content">
                    <Standup />
                    { false && <Checklist /> }
                    <StandupSummary />
                </div>
            </div>

        </div>;
    }

    toggleSidebar() {
        this.setState({
            showSidebar: !this.state.showSidebar,
        });
    }


}


/**
 * Wraps the App component in a react-redux Provider
 * so the store state is passed in as props.
 * niiiiiiice
 */
class ProviderWrapper extends Component{
    render() {
        return (
            <Provider store={store}>
                {() => <App />}
            </Provider>
        )
    }
}



React.render(<ProviderWrapper />, document.body);
