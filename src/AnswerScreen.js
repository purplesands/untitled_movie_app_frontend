import React, { Component } from 'react';
import './App.css';

class AnswerScreen extends Component {
  renderAnswers=()=> {
    let answers = [...this.props.currentAnswers, this.props.currentQuestion]
    let shuffled = answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);
    console.log(shuffled)
    return shuffled.map(a=>{
      return <li>{a.title}</li>
    })

  }

  render() {
    return (
      <div className="AnswerScreen">
        <ul>
          Plot Summary:
          {this.props.userInput}
          answers:
          {this.renderAnswers()}
        </ul>
      </div>
    );
  }
}

export default AnswerScreen;
