/* jshint esversion: 6 */

export function init(){
  return {
    type: 'INIT'
  };
}

const setStores = function(stores){
  return {
    type: 'SET_STORES',
    stores
  };
};

const setStore = function(products){
  return {
    type: 'SET_STORE',
    products
  };
};

export function filterProducts(query){
  return {
    type: 'FILTER_PRODUCTS',
    query
  };
}

export function beginAdd(){
  return {
    type: 'BEGIN_PRODUCT_ADD'
  };
}

export function productAdded(){
  return {
    type: 'PRODUCT_ADDED'
  };
}

export function beginUpdate(){
  return {
    type: 'BEGIN_PRODUCT_UPDATE'
  };
}

export function productUpdated(){
  return {
    type: 'PRODUCT_UPDATED'
  };
}

export function setEdit(sku){
  return {
    type: 'SET_EDIT',
    sku
  };
}


import {Repo} from './WS/Repo';
const repo = new Repo();

export function getStores(){
  return function(dispatch){
    repo.getStores((stores)=>{
      dispatch(setStores(stores));
    });
  };
}

export function getStore(store){
  return function(dispatch){
    repo.getStore(store, (products)=>{
      dispatch(setStore(products));
    });
  };
}

export function syncdb(store){
  return function(dispatch){
    repo.syncdb(() => {
      dispatch(getStores());
    });
  };
}

export function addProduct(product){
  return function(dispatch){
    dispatch(beginAdd());
    repo.addProduct(product, ()=>{
      dispatch(productAdded());
    });
  };
}


export function updateProduct(product){
  return function(dispatch){
    dispatch(beginUpdate());
    repo.updateProduct(product, ()=>{
      dispatch(productUpdated());
      dispatch(getStore(product.store));
    });
  };
}
