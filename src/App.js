import React, { Component } from 'react';
import './App.css';
import MainMenu from './MainMenu';
import Login from './Login';

class App extends Component {

  state = {
    user: ""
  }

  getUser = (user) => {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user })
    }).then(r=>r.json())
    .then(r=> {
      this.setState({ user: r })
    })
  }

  renderPages = () => {
    if (this.state.user != "") {
      return <MainMenu user={this.state.user}/>
    } else {
      return <Login getUser={this.getUser}/>
    }
  }

  render() {
    console.log("user ", this.state);
    return (
      <div className="App">
        <header className="App-header">
          {this.renderPages()}
        </header>
      </div>
    );
  }
}

export default App;
