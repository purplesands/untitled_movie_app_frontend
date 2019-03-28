import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class GameList extends Component {

  state= {
    questions: [],
    answers: {},
    currentQuestion: {},
    currentAnswers: {},
    currentGame: null,
    currentUser: {},
    gameQuestions: []
  }

  reset=()=>{
    this.setState({
      questions: [],
      answers: {},
      currentQuestion: {},
      currentAnswers: {},
      currentGame: null,
      currentUser: 1,
      gameQuestions: []
    },this.fetchQuestions())

  }

  startGame=()=>{
    fetch('http://localhost:3000/game_instances', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_round: 1,
        game_status: "pregame"
      })
    }).then(r=>r.json())
    .then(r=>this.setState({
      currentGame: r.id
    }, this.setFirstUser))
  }

  setFirstUser=()=>{
    this.setGameUser()
    this.state.questions.map(q => {
      return this.postGameQuestion(q)
    })
  }

  setGameUser=()=>{
    fetch('http://localhost:3000/game_users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_instance_id: this.state.currentGame,
        user_id: this.props.user.id,
        score: 0
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({currentUser: r})
    })
    .then(console.log)
  }

  postGameQuestion=(question)=>{
    fetch('http://localhost:3000/game_questions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question_id: question.id,
        game_instance_id: this.state.currentGame,
        completed: false,
        input: ''
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({gameQuestions: [...this.state.gameQuestions, r]})
    })
    // .then(r=>setTimeout(this.getGameQuestions()))
  }

  fetchQuestions = () => {
    fetch('http://localhost:3000/questions')
    .then(r => r.json())
    .then(q => {
      let shuffled = q.map(x => { return {data: x, srt: Math.random()}})
      .sort((a,b) => {return a.srt - b.srt})
      .map(x => x.data);
      this.setState({questions: shuffled.slice(0,10)},
    this.fetchAnswers)
    })
  }

  fetchAnswers = () => {
    fetch('http://localhost:3000/answers')
    .then(r => r.json())
    .then(a => {
      let arr = this.matchAnswers(a, this.state.questions)
      this.setState({answers: arr})
    })
  }

  matchAnswers = (answers, questions) => {
    let answerSet = {}
    for (var i = 0; i < questions.length; i++) {
      answerSet[questions[i].id] = []
      for (var y = 0; y < answers.length; y++) {
        if (answers[y].question_id === questions[i].id) {
          answerSet[questions[i].id].push(answers[y])
        }
      }
    }
    return answerSet
  }


  componentDidMount(){
    this.fetchQuestions()
    this.interval = setInterval(this.checkNewGame, 2000);

  }

  componentWillUnmount() {
      // Clear the interval right before component unmount
    clearInterval(this.interval);
  }


  checkNewGame=()=>{
    // debugger
    // if (this.state.currentGame===10) {
    //   console.log('game over bitch')
    // }
  }

  renderGame=()=>{
    if (this.state.currentGame) {
      return (
        <Game
        currentGame={this.state.currentGame}
        gameQuestions={this.state.gameQuestions}
        currentUser={this.state.currentUser}
        reset={this.reset}
        startGame={this.startGame}
        // questions={this.state.questions}
        // answers={this.state.answers}
        currentQuestion={this.state.currentQuestion}
        currentAnswers={this.state.currentAnswers}
        />
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
