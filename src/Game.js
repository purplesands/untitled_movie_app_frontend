import React, { Component } from 'react';
import './App.css';
import QuestionScreen from './QuestionScreen';
import AnswerScreen from './AnswerScreen';
import Score from './Score';

class Game extends Component {

  state = {
    round: 1,
    userInput: '',
    timer:10,
    gameQuestions:[],
    currentQuestion: {},
    currentAnswers: {},
    loaded: false
  }


  nextRound=()=>{
    // keeps track of timer, and calls setQuestion and setAnswers at a certain time
  }



  getUserInput = (input) => {
    this.setState({
      userInput:input
    })
    fetch(`http://localhost:3000/game_questions/${this.state.currentQuestion.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: input
      })
    }).then(r=>r.json())
  }

  componentDidMount = () => {
  }

  setQuestion = () => {

    let questions = [...this.props.gameQuestions]
    let currentQuestion = questions[0]
    questions.shift()
    console.log(this.props.gameQuestions)
    console.log('cq', currentQuestion)
    this.setState({
      gameQuestions: questions,
      currentQuestion: currentQuestion
    }, this.setAnswers)
  }

  setAnswers = () => {
    let currentQuestion = this.state.currentQuestion
    let shuffled = currentQuestion.answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);
    console.log('shuffled', shuffled.slice(0,3))
    this.setState({
      currentAnswers: shuffled.slice(0,3),
    })
    // takes this.state.currentQuestion
    // matches that question with matching answers
    // takes 3 of those answers at random and assigns to this.state.currentAnswer
}

  renderGame = () => {

    if (this.state.currentAnswers.length === 3) {
      // debugger
      return (
        <div>
        <p>{this.state.timer} seconds left</p>
        <Score />
        <QuestionScreen
          currentQuestion={this.state.currentQuestion}
          getUserInput={this.getUserInput}
          />
        <AnswerScreen
          currentAnswers={this.state.currentAnswers}
          currentQuestion={this.state.currentQuestion}
          userInput={this.state.userInput}
          addPoint={this.addPoint}
          />
          </div>
        )
    }

  }


  render() {
    // console.log('questions', this.state.questions)
    // console.log('answers', this.state.answers)
    // console.log('current Q', this.state.currentQuestion)
    // console.log('current As', this.state.currentAnswers)

    return (
      <div className="Game">
        <button onClick={this.setQuestion}>begin</button>
         {this.renderGame()}
      </div>
    );
  }
}

export default Game;
