/* jshint esversion: 6 */

import React from 'react';
import ReactDOM from 'react-dom';
import { routerMiddleware, push } from 'react-router-redux';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import {Provider} from 'react-redux';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';

import {getStores} from './action_creators';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Add from './pages/Add';


require('./styles/style.css');
require('./styles/foundation.css');



const loggerMiddleware = createLogger({
  stateTransformer: (state) => state.toJS()
});



const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  routerMiddleware(hashHistory)
)(createStore);


const store = createStoreWithMiddleware(reducer);

store.dispatch(getStores());

const routes = <Route component={Layout}>
                  <Route  path="/" component={Home}/>
                  <Route  path="/add" component={Add}/>
              </Route>;

ReactDOM.render(
   <Provider store={store}>
      <Router history={hashHistory}>{routes}</Router>
   </Provider>, document.getElementById('app')
);
