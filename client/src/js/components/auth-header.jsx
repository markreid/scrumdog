import React from 'react';
import PropTypes from 'prop-types';

import UserIcon from './user-icon';

// the server will return this userId
// if it's in guest mode, in which case
// this component renders nothing.
const GUEST_USER_ID = -1;


class AuthHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { props, state } = this;

    if (props.auth.user.id === GUEST_USER_ID) return null;

    return (
      <div className="auth-header">
        {state.open && (<a className="btn-logout" href="/logout">logout</a>)}
        <UserIcon
          {...props.auth.user}
          onClick={() => {
            this.setState({
              open: !state.open,
            })
          }}
        />
      </div>
    );
  }
}

AuthHeader.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
};

export default AuthHeader;
