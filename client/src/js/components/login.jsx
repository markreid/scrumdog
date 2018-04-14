import React from 'react';

export default () => (
  <div className="login">
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
