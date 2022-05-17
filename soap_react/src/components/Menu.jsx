/* jshint esversion: 6 */
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router';

import * as actionCreators from '../action_creators';


export const MenuContainer = withRouter(React.createClass({
  render() {
    return <div>
      <button type='button' className='button' onClick={this.props.syncdb}>SyncDB</button>
      <Link to={"/"}>
        <button type='button' className='button'>
          Home
        </button>
      </Link>
      <Link to={"/add"}>
        <button type='button' className='button'>
          Add
        </button>
      </Link>
    </div>;
  }
}));

function mapStateToProps(state) {
  return state.toJS();
}

const Menu = connect(
  mapStateToProps,
  actionCreators
)(MenuContainer);

export default Menu;
