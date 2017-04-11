/**
 * user-icon.jsx
 * Circular user icon; avatar or initials
 */

import React, { Component } from 'react';
import autobind from 'autobind-decorator';

@autobind
class UserIconComponent extends Component {

  clickHandler() {
    if (this.props.onClick) this.props.onClick(this.props.id);
  }

  render() {
    const names = this.props.fullName.split(' ');
    const initials = names.length > 1 ?
      (names[0][0] + names[names.length - 1][0]) :
      names[0][0] + names[0][names[0].length - 1];

    return <button className="user-icon" onClick={this.clickHandler}>{initials.toUpperCase()}</button>;
  }
}

export default UserIconComponent;
