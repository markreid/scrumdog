/**
 * user-icon.jsx
 * Circular user icon; avatar or initials
 */

import React from 'react';
import PropTypes from 'prop-types';


const UserIconComponent = props => {
  const names = props.fullName.split(' ');
  const initials = names.length > 1 ?
    (names[0][0] + names[names.length - 1][0]) :
    names[0][0];

  return (
    <button
      className="user-icon"
      onClick={() => props.onClick(props.id)}
      title={props.fullName}
    >{initials.toUpperCase()}</button>
  );
};


UserIconComponent.propTypes = {
  fullName: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

UserIconComponent.defaultProps = {
  onClick: () => {},
};

export default UserIconComponent;
