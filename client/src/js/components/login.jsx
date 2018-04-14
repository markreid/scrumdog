import React from 'react';

export default () => (
  <div className="login">
    <h1
      className="logo"
    >🐕 Scrumdog</h1>
    <p className="login__please">Please login to continue.</p>
    <div className="login__buttons">
      <a
        className="btn-login--google"
        href="/auth/google"
      >Login with Google</a>
      <a
        className="btn-login--github"
        href="/auth/github"
      >Login with GitHub</a>
    </div>
  </div>
);
