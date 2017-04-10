/**
 * user-icon.jsx
 * Circular user icon; avatar or initials
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateUser } from '../actions';
import store from '../store';

import UserProfile from './user-profile.jsx';

class UserIconComponent extends Component {

  constructor() {
    super();
    this.state = {
      editing: false,
    };

    this.clickHandler = this.clickHandler.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  clickHandler(evt) {
    if (!evt.shiftKey) {
      if (this.props.onClick) this.props.onClick(this.props.id);
    } else {
      this.setState({
        editing: true,
      });
    }
  }

  saveProfile(props) {
    const { id } = this.props;
    store.dispatch(updateUser(Object.assign(props, {
      id,
    }))).then(this.disableEditing);
  }

  disableEditing() {
    this.setState({
      editing: false,
    });
  }

  render() {
    const names = this.props.fullName.split(' ');
    const initials = names.length > 1 ?
      (names[0][0] + names[names.length - 1][0]) :
      names[0][0] + names[0][names[0].length - 1];

    if (this.state.editing) {
      return (<UserProfile
        {...this.props}
        onSave={this.saveProfile}
        onCancel={this.disableEditing}
      />);
    }

    return <button className="user-icon" onClick={this.clickHandler}>{initials.toUpperCase()}</button>;
  }
}

export default UserIconComponent;
