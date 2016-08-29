/**
 * new-user-icon.jsx
 * User icon you can click on to create a new user. Displays a +
 */

import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

import store from '../store';
import {createUser} from '../actions';

import Loader from './loader.jsx';
import UserProfile from './user-profile.jsx';

class NewUserIconComponent extends Component {

    constructor() {
        super();
        this.state = {
            active: false,
            syncing: false,
        }
    }

    render (){
        if(!this.state.active) return <div className="user-icon add-user" onClick={this.activate.bind(this)}>+</div>

        return (
            <div>
                <UserProfile
                    onSave={this.createUser.bind(this)}
                    onCancel={this.deactivate.bind(this)}
                />
                {this.state.syncing && <Loader size="tiny" />}
            </div>
        );
    }

    activate() {
        this.setState({
            active: true,
        });
    }

    deactivate() {
        this.setState({
            active: false,
            syncing: false,
        });
    }

    createUser(props) {

        if(this.state.syncing) return;

        this.setState({
            syncing: true,
        });

        const { fullName, email, nickname } = props;

        store.dispatch(createUser({
            fullName,
            email,
            nickname,
        })).then(() => {
            // todo - this should listen for an action
            this.deactivate();
        });
    }

}

export default connect(function(state, ownProps){
   return {};
})(NewUserIconComponent)
