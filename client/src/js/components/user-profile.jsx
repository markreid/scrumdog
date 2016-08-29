/**
 * user-profile.jsx
 * Form for editing a user's profile
 */

import React from 'react';


export default class UserProfileComponent extends React.Component {

  componentWillMount() {
    // props to state.
    // technically this is an antipattern but yoloooooooo
    const { fullName, email, nickname } = this.props;
    this.setState({
      fullName,
      email,
      nickname,
    });
  }

  setValue(key, evt) {
    return this.setState({
      [key]: evt.currentTarget.value,
    });
  }

  render() {
    const { onSave, onCancel, userId } = this.props;
    const { fullName, email, nickname } = this.state;

    return (
      <div className="user-add-form">
        <input type="text" placeholder="full name" value={fullName} onChange={this.setValue.bind(this,'fullName')} />
        <input type="email" placeholder="email" value={email} onChange={this.setValue.bind(this,'email')} />
        <input type="text" placeholder="nickname" value={nickname} onChange={this.setValue.bind(this,'nickname')} />

        <button className="btn" onClick={onSave.bind(null, this.state)}>Go</button>
        <button className="btn alt" onClick={onCancel}>Cancel</button>

        { userId && <button className="btn">Delete</button> }
      </div>
    );
  }

};

UserProfileComponent.PropTypes = {
  onSave: React.PropTypes.func,
  onCancel: React.PropTypes.func,
}
