import React from 'react';
import autobind from 'autobind-decorator';

import store from '../store';
import { removeUser } from '../actions';

import UserEdit from './user-edit';

@autobind
class UserTableItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      confirmRemove: false,
    };
  }

  removeHandler() {
    store.dispatch(removeUser(this.props.user.id));
  }

  toggleShow() {
    this.setState({
      showDetail: !this.state.showDetail,
    });
  }

  toggleConfirmRemove() {
    this.setState({
      confirmRemove: !this.state.confirmRemove,
    });
  }

  render() {
    const { user } = this.props;
    const { showDetail, confirmRemove } = this.state;

    // default clickHandler is the same as edit
    const clickHandler = this.props.clickHandler || this.toggleShow;

    return (
      <div className="list-table__list__item" key={user.id}>
        <header className="list-table__list__item__header">
          <a
            className="list-table__list__item__title"
            onClick={clickHandler}
          >{user.fullName}</a>
          <a
            className="list-table__list__item__btn-edit"
            onClick={this.toggleShow}
          >edit</a>
        </header>

        {showDetail && (
          <div className="user-table-item__detail">
            <div className="edit-section">
              <h2 className="edit-section__title">Edit User</h2>
              <section className="edit-section__content">
                <UserEdit {...user} />
              </section>
            </div>

            <div className="edit-section">
              <h2 className="edit-section__title">Remove User</h2>

              <section className="edit-section__content">
                <button
                  onClick={this.toggleConfirmRemove}
                  className="btn"
                >Remove User</button>

                {confirmRemove && (
                  <button
                    className="btn alt"
                    onClick={this.removeHandler}
                  >For real</button>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserTableItem;
