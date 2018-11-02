import React, { Component } from 'react';
import { translate } from 'react-i18next';
import routes from '../../routes';
import './index.css';
import '../../assets/styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        { routes }
      </div>
    );
  }
}

export default translate('translations')(App);