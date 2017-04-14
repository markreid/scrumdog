import React from 'react';
import autobind from 'autobind-decorator';

import { createUser } from '../actions';
import store from '../store';

@autobind
class AddUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      email: '',
      nickname: '',
    };
  }

  setValue(evt) {
    this.setState({
      [evt.currentTarget.name]: evt.currentTarget.value,
    });
  }

  submitHandler(evt) {
    evt.preventDefault();
    const { fullName, email, nickname } = this.state;
    store.dispatch(createUser({
      fullName,
      email,
      nickname,
    }))
    .then(() => {
      this.setState({
        fullName: '',
        email: '',
        nickname: '',
      });
    });
  }

  render() {
    const { fullName, email, nickname } = this.state;

    return (
      <form className="inline-form" onSubmit={this.submitHandler}>
        <input
          type="text"
          className="input"
          placeholder="full name"
          value={fullName}
          name="fullName"
          onChange={this.setValue}
        />
        <input
          type="text"
          className="input"
          placeholder="email"
          value={email}
          name="email"
          onChange={this.setValue}
        />
        <input
          type="text"
          className="input"
          placeholder="nickname"
          value={nickname}
          name="nickname"
          onChange={this.setValue}
        />
        <button type="submit" className="btn">Add</button>
      </form>
    );
  }
}

export default AddUser;
