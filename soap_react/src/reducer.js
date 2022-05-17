/* jshint esversion: 6 */

import {
    List,
    Map,
    fromJS
}  from 'immutable';

const INITIAL_STATE = Map({
    stores: List(),
    products: List(),
    store: null,
    product: null,
    adding: false,
    updating: false,
    sku: "",
    query: ""
});


function filterProducts(state, query){
  if(query === ""){
    return state.set("products", state.get("save"))
                .set("save", null)
                .set("query", query);
  }
  let save = state.get("save");
  if(!save){
    save = state.get("products");
  }
  const filtredProducts = save.filter((product)=>
      product.SKU.toUpperCase().includes(query.toUpperCase())
  );
  return state.set("products", filtredProducts)
              .set("save", save)
              .set("query", query);
}

export default function(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case 'INIT':
            return INITIAL_STATE;
        case 'SET_STORES':
          return state.set('stores', action.stores).set("products", List());
        case 'SET_STORE':
          return state.set('products', action.products).set("save", null).set("query", "");
        case 'FILTER_PRODUCTS':
          return filterProducts(state, action.query);
        case 'BEGIN_PRODUCT_ADD':
          return state.set('adding', true);
        case 'PRODUCT_ADDED':
          return state.set('adding', false);
        case 'SET_EDIT':
          return state.set('sku', action.sku);
        case 'BEGIN_PRODUCT_UPDATE':
          return state.set('updating', true);
        case 'PRODUCT_UPDATED':
          return state.set('updating', false).set("sku", "");

    }
    return state;
}
