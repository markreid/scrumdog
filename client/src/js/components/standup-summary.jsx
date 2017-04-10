/**
 * standup-summary.jsx
 * Component for the standup summary view
 */


import React, { Component } from 'react';

import Loader from './loader.jsx';


class StandupSummary extends Component {

  static renderFetching() {
    return (
      <div id="standup">
        <Loader />
      </div>
    );
  }

  static copy() {
    const range = document.createRange();
    range.selectNode(document.querySelector('.standup-summary-view pre'));
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

  render() {
    if (!this.props.standup) return '';

    const entries = this.props.standup.Entries.map(entry => generateEntryString(entry));
    const entriesString = entries.join('');

    return (
      <div id="standup-summary">
        <div className="standup-summary-view">
          <h4>Copy-Pasta summary</h4>
          <button onClick={this.copy}>copy</button>
          <pre>{entriesString}</pre>
        </div>
      </div>
    );
  }

}

function generateEntryString(entry) {
  // this is probably not the right way to do this...

  const user = entry.User || null;

  if (!entry || !user) {
    return '';
  }

  // now create a string
  let str = `@${user.nickname}
    --
    ${entry.todayTasks || 'no tasks'}
  `;

  if (entry.blockers) {
    str += `\nBLOCKED BY:
      ${entry.blockers}
    `;
  }

  str += '\n\n';

  // tidy it up a bit
  const cleanString = str.replace(/\n */gm, '\n').replace(/•/gm, '*');

  return cleanString;
}

export default StandupSummary;
