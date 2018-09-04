/* eslint-disable */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './App.css';

import store from './store';
import Routes from './routes';

class App extends Component {
  render() {
		return (
      <Provider store={store}>
        <Routes />
      </Provider>);
  }
}

export default App;
