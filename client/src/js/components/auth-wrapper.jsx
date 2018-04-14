/**
 * AuthWrapper
 *
 * Fetches the current user's data from the server,
 * redirecting to the login page if they're unauthenticated.
 */

import React from 'react';
import { Redirect } from 'react-router-dom';

import { whoami } from '../ducks/auth';

import Loader from './loader';
import AuthHeader from './auth-header';

class AuthWrapper extends React.Component {
  componentDidMount() {
    this.props.dispatch(whoami());
  }

  render() {
    const { props } = this;
    if (props.auth.syncing) {
      return <Loader />
    }

    if (!props.auth.user) {
      return <Redirect to='/login' />;
    }

    return (
      <div className="auth-wrapper">
        <AuthHeader auth={props.auth} />
        {props.children}
      </div>
    );
  }
}

export default AuthWrapper;
