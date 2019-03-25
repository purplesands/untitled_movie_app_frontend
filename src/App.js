import React, { Component } from 'react';
import './App.css';
import MainMenu from './MainMenu';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Login />
          <MainMenu />
        </header>
      </div>
    );
  }
}

export default App;
