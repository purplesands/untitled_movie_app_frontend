import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class GameList extends Component {
  render() {
    return (
      <div className="GameList">
        <Game />
      </div>
    );
  }
}

export default GameList;
