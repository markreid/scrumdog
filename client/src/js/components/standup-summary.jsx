/**
 * standup-summary.jsx
 * Component for the standup summary view
 */


import React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';


function generateEntryString(entry) {
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


@autobind
class StandupSummary extends React.Component {

  copy() {
    this.textarea.style.display = 'block';
    this.textarea.select();
    document.execCommand('copy');
    this.textarea.style.display = 'none';
  }

  render() {
    const { standup, team } = this.props;
    if (!standup) return '';

    const entries = this.props.standup.Entries.map(entry => generateEntryString(entry));
    const firstLine = `🐕 ${team.name} Standup Notes ${moment(standup.date).format('MMMM D')}\n\n`;
    const summary = [firstLine, ...entries];
    const summaryString = summary.join('').trim() + '\n';

    return (
      <div id="standup-summary">
        <div className="standup-summary-view">
          <button
            className="btn alt"
            onClick={this.copy}
          >Copy text summary</button>
          <textarea
            ref={element => this.textarea = element}
            style={{ display: 'none' }}
            value={summaryString}
          />
        </div>
      </div>
    );
  }

}

export default StandupSummary;
