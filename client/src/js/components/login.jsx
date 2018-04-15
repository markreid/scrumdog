import React from 'react';

import fetcher from '../lib/fetcher';

import Loader from './loader';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledServices: [],
      ready: false,
    };
  }

  componentDidMount() {
    fetcher('/api/v1/authservices')
    .then(enabledServices => this.setState({
      ready: true,
      enabledServices,
    }))
    .catch((error) => {
      console.error(error);
      this.setState({
        ready: true,
        enabledServices: [],
      });
    });
  }

  render() {
    const { ready, enabledServices } = this.state;

    if (!ready) {
      return <Loader />;
    }

    return (
      <div className="login">
        <h1
          className="logo"
        >🐕 Scrumdog</h1>
        <p className="login__please">Please login to continue.</p>
        <div className="login__buttons">
          {enabledServices.includes('google') && (<a
            className="btn-login--google"
            href="/auth/google"
          >Login with Google</a>)}
          {enabledServices.includes('github') && (<a
            className="btn-login--github"
            href="/auth/github"
          >Login with GitHub</a>)}
        </div>
        {!enabledServices.length && (
          <p>There are no auth services enabled. You may need to check your config.</p>
        )}
      </div>
    );
  }
}

export default Login;
