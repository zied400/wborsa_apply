/* jshint esversion: 6 */
import polyfill from 'es6-promise';
import fetch from 'isomorphic-fetch';


export class Repo {
  constructor(host, user, password, db) {
   this.url = '//localhost:8090';
  }
  getStores(handler){
     fetch(this.url + '/stores/')
     .then(response => response.json())
     .then(handler);
  }
  getStore(store, handler){
     fetch(this.url + '/stores/' + store.replace('/', '-') + "/")
     .then(response => response.json())
     .then(handler);
  }
  syncdb(handler){
    fetch(this.url + "/stores/syncdb/")
    .then(response => response.json())
    .then(handler);
  }
  addProduct(product, handler){
    fetch(this.url + "/stores/add/",{
        method: "POST",
        body: JSON.stringify({
            "product": product
        }),
        headers: {
            "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(json => {
        handler();
      }).catch(error => { console.log('request failed', error); });
  }
  updateProduct(product, handler){
    fetch(this.url + "/stores/update/",{
        method: "POST",
        body: JSON.stringify({
            "product": product
        }),
        headers: {
            "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(json => {
        handler();
      }).catch(error => { console.log('request failed', error); });
  }
}
