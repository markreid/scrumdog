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

class NewUserIconComponent extends Component {

    constructor() {
        super();
        this.state = {
            active: false,
            fullName: '',
            email: '',
            nickname: '',
            syncing: false
        }
    }

    render (){
        if(!this.state.active) return <div className="user-icon add-user" onClick={this.activate.bind(this)}>+</div>

        return <div className="user-add-form">
            <input type="text" placeholder="full name" value={this.state.fullName} onChange={this.setValue.bind(this,'fullName')} />
            <input type="email" placeholder="email" value={this.state.email} onChange={this.setValue.bind(this,'email')} />
            <input type="text" placeholder="nickname" value={this.state.nickname} onChange={this.setValue.bind(this,'nickname')} />

            <button className="btn" onClick={this.createUser.bind(this)}>Go</button>
            <button className="btn alt" onClick={this.deactivate.bind(this)}>Cancel</button>

            {this.state.syncing &&
                <Loader size="tiny" />
            }
        </div>
    }

    activate() {
        this.setState({
            active: true
        });
    }

    deactivate() {
        this.setState({
            active: false,
            fullName: '',
            email: '',
            nickname: '',
            syncing: false
        });
    }

    setValue(key, evt) {
        if(this.state.syncing) return;

        this.setState({
            [key]: evt.currentTarget.value
        });
    }

    createUser() {
        if(this.state.syncing) return;

        this.state.syncing = true;

        store.dispatch(createUser({
            fullName: this.state.fullName,
            email: this.state.email,
            nickname: this.state.nickname
        })).then(() => {
            // todo - this should listen for an action
            this.deactivate();
        });
    }

}

export default connect(function(state, ownProps){
   return {};
})(NewUserIconComponent)
