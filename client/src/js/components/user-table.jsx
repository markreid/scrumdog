/**
 * UserTable
 * A searchable table of users.
 * List items can be passed an onClick handler.

 */

import React from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { fetchUsers } from '../actions';

import UserTableItem from './user-table-item';
import AddUser from './add-user';

// the fields on User that you can search
const SEARCHABLE_PROPS = ['fullName', 'email', 'nickname'];

@autobind
class UserTable extends React.Component {

  constructor() {
    super();
    this.state = {
      searchString: '',
      showAddUser: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchUsers());
  }

  componentDidMount() {
    // auto-focus the search when typing
    document.body.addEventListener('keydown', this.focusSearch);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.focusSearch);
  }

  focusSearch(evt) {
    // gives focus to the search input on keydown
    // for keys a-z, when no other input is focused.
    const { keyCode } = evt;
    if (keyCode >= 65 && keyCode <= 90 && document.activeElement === document.body) {
      this.searchInput.focus();
    }
  }


  searchChangeHandler(evt) {
    this.setState({
      searchString: evt.currentTarget.value,
    });
  }

  toggleAddUser() {
    this.setState({
      showAddUser: !this.state.showAddUser,
    });
  }

  render() {
    const { users, itemClickHandler } = this.props;
    const { searchString, showAddUser } = this.state;

    const searchRegex = new RegExp(searchString, 'gi');
    const filtered = users.filter(user =>
      SEARCHABLE_PROPS.map(prop =>
        !!user[prop].match(searchRegex)
      ).includes(true)
    );

    return (
      <div className="user-table">
        <div className="list-table">
          <header className="list-table__header">
            <h1 className="list-table__header__title">Users</h1>
            <input
              ref={(input) => { this.searchInput = input; }}
              type="search"
              value={searchString}
              onChange={this.searchChangeHandler}
              placeholder="search"
              className="input list-table__search"
            />
          </header>
          <div className="list-table__list">
            {filtered.map(user => (
              <UserTableItem user={user} key={user.id} onClick={itemClickHandler} />
            ))}
          </div>

          <a
            className="list-table__btn-add"
            onClick={this.toggleAddUser}
          >Add a User..</a>

          {showAddUser && (
            <div className="list-table__form-add">
              <AddUser />
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default connect(state => ({
  users: Object.keys(state.users).map(key => state.users[key]),
}))(UserTable);
