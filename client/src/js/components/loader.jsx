/**
 * Loader component
 */

import React from 'react';


const Loader = props => (
  <div className={'loader-wrapper ' + (props.size || '') }>
    <div className={'loader ' + (props.size || '')}></div>
  </div>
);

export default Loader;
