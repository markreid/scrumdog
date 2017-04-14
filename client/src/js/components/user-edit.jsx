/**
 * UserEdit
 * Edit a User's details
 */

import React from 'react';
import autobind from 'autobind-decorator';

import store from '../store';
import { updateUser } from '../actions';

@autobind
export default class UserEdit extends React.Component {

  componentWillMount() {
    const { fullName, email, nickname } = this.props;
    this.setState({
      fullName,
      email,
      nickname,
    });
  }

  setValue(evt) {
    this.setState({
      [evt.currentTarget.name]: evt.currentTarget.value,
    });
  }

  submitHandler(evt) {
    evt.preventDefault();
    const { fullName, email, nickname } = this.state;
    const { id } = this.props;
    store.dispatch(updateUser({
      id,
      fullName,
      email,
      nickname,
    }));
  }

  render() {
    const { fullName, email, nickname } = this.state;

    return (
      <div className="inline-form">
        <form onSubmit={this.submitHandler}>
          <input
            className="input"
            type="text"
            placeholder="full name"
            value={fullName}
            name="fullName"
            onChange={this.setValue}
          />
          <input
            className="input"
            type="email"
            placeholder="email"
            value={email}
            name="email"
            onChange={this.setValue}
          />
          <input
            className="input"
            type="text"
            placeholder="nickname"
            value={nickname}
            name="nickname"
            onChange={this.setValue}
          />

          <button
            type="submit"
            className="btn"
          >Save</button>
        </form>
      </div>
    );
  }

}
