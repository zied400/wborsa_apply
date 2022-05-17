/* jshint esversion: 6 */

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import * as actionCreators from '../action_creators';


export const HomeContainer = withRouter(React.createClass({
  addProduct(){
    console.log("add : ", this.props.addProduct);
    this.props.addProduct({
      store: this.refs.store.value,
      sku: this.refs.sku.value,
      stock: this.refs.stock.value,
      prix: this.refs.prix.value,
      remise: this.refs.remise.value,
    });
  },
  render() {
    return <div>
            <input type="text" placeholder={"Store"} ref="store"/>
            <input type="text" placeholder={"SKU"} ref="sku"/>
            <input type="number" placeholder={"Stock"} ref="stock"/>
            <input type="number" placeholder={"PrixVte"} ref="prix"/>
            <input type="number" placeholder={"Remise"} ref="remise"/>
            <button type='button' className='button'
                    onClick={this.addProduct} disabled={this.props.adding}>
              Add
            </button>
    </div>;
  }
}));

function mapStateToProps(state) {
  return state.toJS();
}

const Home = connect(
  mapStateToProps,
  actionCreators
)(HomeContainer);

export default Home;
