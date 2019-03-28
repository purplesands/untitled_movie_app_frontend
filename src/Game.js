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
    currentGame: {},
    answer_user: {},
    scoreboard: {},
    clicked: false,
    answered: false
  }

  answered = () => {
    
    this.setState({answered: !this.state.answered})
  }

  getUserInput = (input) => {
    this.setState({
      userInput:input,
      clicked: !this.state.clicked
    })
    fetch(`http://localhost:3000//game_questions/${this.state.currentQuestion.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: input
      })
    }).then(r=>r.json())
    .then(r => {
      this.setQuestion()
    })
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
    // debugger
    let currentQuestion = {...this.state.currentQuestion}
    // debugger
    let shuffled = currentQuestion.answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);

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
    fetch(`http://localhost:3000//game_questions/${this.state.currentQuestion.id}`, {
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
      this.setState({currentQuestion: newQ, round: this.state.round += 1,
      clicked: !this.state.clicked},
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
      fetch(`http://localhost:3000//game_instances/${this.state.currentGame}`, {
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
    fetch(`http://localhost:3000//game_instances/${this.state.currentGame}`, {
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
      let newScoreboard = this.state.scoreboard
      newScoreboard[that.props.currentUser.id] = this.props.currentUser.score += 10
      fetch(`http://localhost:3000//game_users/${that.props.currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: this.props.currentUser.score
        })
      }).then(r=>r.json())
      .then(r => {
        this.setState({answer_user: r, scoreboard: newScoreboard})
      })
    }

    renderQuestionScreen = () => {
      return (
        <div>
        <p>{this.state.timer} seconds left</p>
        <Score />
        <QuestionScreen
          currentQuestion={this.state.currentQuestion}
          getUserInput={this.getUserInput}
          clicked={this.state.clicked}
          />
        </div>
      )
    }

    renderAnswerScreen = () => {
      return (
        <div>
        <p>{this.state.timer} seconds left</p>
        <AnswerScreen
          currentAnswers={this.state.currentAnswers}
          currentQuestion={this.state.currentQuestion}
          userInput={this.state.userInput}
          addPoint={this.addPoint}
          updateScore={this.updateScore}
          endTimer={this.endTimer}
          round={this.state.round}
          answered={this.answered}
          answerState={this.state.answered}
          />
        </div>
      )
    }

  renderGame = () => {
    // if (this.state.userInput != '' && this.state.currentAnswers.length === 3) {
    //   debugger
    //   // return (
    //   //   <div>
    //   //     <Score />
    //   //     {this.renderAnswerScreen()}
    //   //   </div>
    //   // )
    // }
    if (this.state.currentAnswers.length === 3) {
      // debugger
      return (
        <div>
          <Score />
          {this.renderQuestionScreen()}
          {this.renderAnswerScreen()}
        </div>
      )
    }
  }

  render() {
    console.log("input ", this.state.userInput);
    // console.log('questions', this.state.questions)
    // console.log('answers', this.state.answers)
    // console.log('current As', this.state.currentAnswers)
    console.log('scoreboard', this.state.scoreboard)

    return (
      <div className="Game">
        <button onClick={this.setQuestion}>begin</button>
         {this.renderGame()}
      </div>
    );
  }
}

export default Game;
