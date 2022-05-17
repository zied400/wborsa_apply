/* jshint esversion: 6 */

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import * as actionCreators from '../action_creators';


export const HomeContainer = withRouter(React.createClass({
  update(sku){
    this.props.updateProduct({
      store: this.refs.store.value,
      sku: sku,
      stock: this.refs.stock.value,
      prix: this.refs.prix.value,
      remise: this.refs.remise.value
    });
  },
  render() {
    return <div>
            <select onChange={(e) => this.props.getStore(e.target.value)} ref="store">
              <option value="">Select Store ss</option>
              {
                this.props.stores.length>0 && this.props.stores.map((store,i)=>{
                    return <option key={i} value={store}>{store}</option>;
                })
              }
            </select>
            <input type="text"
              value={this.props.query}
              onChange={(e) => this.props.filterProducts(e.target.value)}/>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Prix de Vente</th>
                  <th>Remise</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
              {
                this.props.products && this.props.products.map((product,i) => {
                    return product.SKU === this.props.sku ?  <tr key={i}>
                        <td>{product.SKU}</td>
                        <td><input type="number" defaultValue={product.StockDispo} ref="stock"/></td>
                        <td><input type="number" defaultValue={product.PrixVte} ref="prix"/></td>
                        <td><input type="number" defaultValue={product.RemiseMnt} ref="remise"/></td>
                        <td>
                        <button className="small button" type="button"
                          disabled={this.props.updating}
                          onClick={() => this.update(product.SKU)}>
                          <span aria-hidden="true">S</span>
                        </button>
                        </td>
                      </tr>
                      : <tr key={i}>
                        <td>{product.SKU}</td>
                        <td>{product.StockDispo}</td>
                        <td>{product.PrixVte}</td>
                        <td>{product.RemiseMnt}</td>
                        <td>
                        <button className="small button" type="button" onClick={() => this.props.setEdit(product.SKU)}>
                          <span aria-hidden="true">M</span>
                        </button>
                        </td>
                      </tr>;
                })
              }
              </tbody>
            </table>
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
