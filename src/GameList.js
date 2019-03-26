import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class GameList extends Component {

  state= {
    game: false
  }

  startGame=()=>{
    this.setState({
      game: true
    })
  }

  renderGame=()=>{
    if (this.state.game) {
    return (
      <Game />
    )
  } else {
    return null
  }
}

  render() {
    return (
      <div className="GameList">
        <button onClick={this.startGame}>new game</button>
        {this.renderGame()}
      </div>
    );
  }
}

export default GameList;
