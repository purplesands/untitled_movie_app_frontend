import React, { Component } from 'react';
import './App.css';

class Login extends Component {

  state = {
    input: ''
  }

  setInput = (e) => {
    this.setState({input:e.target.value})
  }

  submitInput = (e) => {
    e.preventDefault()
    this.props.getUser(this.state.input)
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.submitInput}>
          Login: <textarea type="text" name="input" maxlength="25" onChange={this.setInput}/>
          <button type="submit" value="Submit" > Submit </button>
        </form>
      </div>
    );
  }
}

export default Login;
