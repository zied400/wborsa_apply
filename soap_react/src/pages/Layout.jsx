/* jshint esversion: 6 */

import {toJs} from 'immutable';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import * as actionCreators from '../action_creators';

import Menu from '../components/Menu';

const LayoutContainer = withRouter(React.createClass({
  render: function() {
    return  <div>
            <h1> Fake Nosy </h1>
            <Menu />
           <div>
              {this.props.children}
          </div>
      </div>;
  }
}));

function mapStateToProps(state) {
  return state.toJS();
}

export default connect(
  mapStateToProps,
  actionCreators
)(LayoutContainer);
