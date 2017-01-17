// notes

import React from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { fetchNotes, sendNotes } from '../actions';

import EntryTextarea from './entry-textarea.jsx';

@autobind
class Notes extends React.Component {

  static propTypes() {
    return {
      notes: React.PropTypes.string,
      dispatch: React.PropTypes.func,
    };
  }

  constructor() {
    super();
    this.state = {
      notes: '',
      syncing: false,
      dirty: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchNotes());
  }

  componentWillReceiveProps(props) {
    // yes, i realise this is an anti-pattern.
    const { notes } = props;
    this.setState({
      notes,
    });
  }

  changeHandler(evt) {
    this.setState({
      notes: evt.currentTarget.value,
      dirty: true,
    });
  }

  sync() {
    this.setState({
      syncing: true,
    });

    this.props.dispatch(sendNotes(this.state.notes))
    .then((notes) => {
      this.setState({
        notes,
        dirty: false,
        syncing: false,
      });
    });
  }

  render() {
    const { notes, dirty, syncing } = this.state;

    return (
      <div id="notes">
        <EntryTextarea
          value={notes}
          onChange={this.changeHandler}
          disabled={syncing}
        />
        <button
          onClick={this.sync}
          disabled={syncing}
          className={dirty && 'dirty'}
        >Save</button>
      </div>
    );
  }

}


export default connect(state => ({
  notes: state.notes.notes,
}))(Notes);
