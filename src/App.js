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
    if (this.state.user !== "") {
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

//
// render() {
//   console.log("user ", this.state);
//   return (
//     <div className="App">
//       <header className="App-header">
//         {this.renderPages()}
//       </header>
//     </div>
//   );
// }


// import React, { Component } from 'react';
// import {
//   BrowserRouter as Router,
//   Route
// } from 'react-router-dom';
// import './App.css';
// import MainMenu from './MainMenu';
// import Login from './Login';
//
// class App extends Component {
//
//   state = {
//     user: ""
//   }
//
//   getUser = (user) => {
//     debugger
//     fetch('http://localhost:3000/users', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ username: user })
//     }).then(r=>r.json())
//     .then(r=> {
//       this.setState({ user: r })
//     })
//   }
//
//   home = () => {
//     return (
//       <MainMenu user={this.state.user}/>
//     )
//   }
//
//   login = () => {
//     return (
//       <Login getUser={this.getUser}/>
//     )
//   }
//
//   // renderPages = () => {
//   //   if (this.state.user !== "") {
//   //     return <MainMenu user={this.state.user}/>
//   //   } else {
//   //     return <Login getUser={this.getUser}/>
//   //   }
//   // }
//
//   render() {
//     return (
//       <Router>
//         <div className="app">
//           <Route exact path="/" render={this.mainmenu} />
//           <Route exact path="/login" component={this.login} />
//         </div>
//       </Router>
//     )
//   }
// }
//
// export default App;
//
// //
// // render() {
// //   console.log("user ", this.state);
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         {this.renderPages()}
// //       </header>
// //     </div>
// //   );
// // }
