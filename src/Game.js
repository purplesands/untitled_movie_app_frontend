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
    loaded: false,
    currentGame: {},
    answer_user: {}
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
    this.setState({currentGame: this.props.currentGame})
  }

  setQuestion = () => {
    let questions = [...this.props.gameQuestions]
    let currentQuestion = questions.find(q=>{return q.completed===false})
    this.setState({
      gameQuestions: questions,
      currentQuestion: currentQuestion
    }, this.setAnswers)
  }

  setAnswers = () => {
    let currentQuestion = {...this.state.currentQuestion}
    let shuffled = currentQuestion.answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);
    debugger
    this.setState({
      currentAnswers: shuffled.slice(0,3),
    })
    // takes this.state.currentQuestion
    // matches that question with matching answers
    // takes 3 of those answers at random and assigns to this.state.currentAnswer
}

  endTimer=()=>{
    let newQ = this.state.currentQuestion
    newQ.completed=true
    fetch(`http://localhost:3000/game_questions/${this.state.currentQuestion.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: true
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({currentQuestion: newQ, round: this.state.round += 1},
      this.completeRound())
      // blah
    })
  }

  completeRound = () => {
    let gameStatus = "in progress"
    if (this.state.round === 10) {
      gameStatus = "complete"
    }
    if (this.state.round <= 10) {
      fetch(`http://localhost:3000/game_instances/${this.state.currentGame}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_round: this.state.round,
          game_status: gameStatus
        })
      }).then(r=>r.json())
      .then(r => {
        console.log("round end", r)
        this.setQuestion()
      })
    } else {
      this.endGame()
    }
  }

  endGame = () => {
    fetch(`http://localhost:3000/game_instances/${this.state.currentGame}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_round: 10,
        game_status: "complete"
      })
    }).then(r=>r.json())
    .then(r => {
      console.log("game end", r)
    })
    this.props.reset()
  }

  updateScore = (id) => {

    let that = this
    fetch(`http://localhost:3000/game_users/${that.props.currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: this.props.currentUser.score += 10
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({answer_user: r})
    })
  }

  renderGame = () => {
    if (this.state.currentAnswers.length === 3) {
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
          updateScore={this.updateScore}
          endTimer={this.endTimer}
          />
          </div>
        )
    }
  }

  render() {
    // console.log('questions', this.state.questions)
    // console.log('answers', this.state.answers)
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
