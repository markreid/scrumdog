/**
 * user-icon.jsx
 * Circular user icon; avatar or initials
 */

import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

class UserIconComponent extends Component {
    render (){
        var names = this.props.fullName.split(' ');
        var initials = names.length > 1 ? (names[0][0] + names[names.length-1][0]) : names[0][0] + names[0][names[0].length-1];
        return <div className="user-icon" onClick={this.props.onClick}>{initials.toUpperCase()}</div>
    }
}

export default connect((state, ownProps) => state.users[ownProps.id] || {})(UserIconComponent);
