import React, { Component } from 'react';
import './App.css';
import UserPage from './UserPage';
import CreateGame from './CreateGame';
import GameList from './GameList';


class MainMenu extends Component {
  render() {
    return (
      <div className="MainMenu">
        <UserPage />
        <CreateGame />
        <GameList user={this.props.user}/>
      </div>
    );
  }
}

export default MainMenu;
