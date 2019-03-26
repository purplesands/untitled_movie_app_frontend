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
      return <p><button className="answerButton"
              value={a.title}
              onClick={this.checkAnswer}>
              {a.title}
              </button> </p>
    })
  }

  checkAnswer = (e) => {
    (this.props.currentQuestion.title === e.target.value) ?
    this.props.addPoint()
    :
    console.log('wrong')
  }

  render() {
    return (
      <div className="AnswerScreen">
        <ul>
          <p>Plot Summary:</p>
          {this.props.userInput}
          <p>answers:</p>
          {this.renderAnswers()}
        </ul>
      </div>
    );
  }
}

export default AnswerScreen;
