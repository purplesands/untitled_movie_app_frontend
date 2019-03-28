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
    currentUsers: {},
    gameQuestions: [],
    joinableGame: null
  }

  reset=()=>{
    this.setState({
      questions: [],
      answers: {},
      currentQuestion: {},
      currentAnswers: {},
      currentGame: null,
      currentUser: {},
      currentUsers: {},
      gameQuestions: [],
      joinableGame: null
    },this.fetchQuestions())

  }

  startGame=()=>{
    fetch('https://purple-deer-71.localtunnel.me/game_instances', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_round: 1,
        game_status: "pregame",
        user_status: this.props.user.username
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
    debugger
    // let currentUsers = this.state.currentUsers
    // currentUsers = {...this.state.currentUsers, this.props.currentUser}
    fetch('https://purple-deer-71.localtunnel.me/game_users', {
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
    fetch('https://purple-deer-71.localtunnel.me/game_questions', {
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
    fetch('https://purple-deer-71.localtunnel.me/questions')
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
    fetch('https://purple-deer-71.localtunnel.me/answers')
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
    this.interval = setInterval(this.checkNewGame, 1000);
  }

  componentWillUnmount() {
      // Clear the interval right before component unmount
    clearInterval(this.interval);
  }


  checkNewGame=()=>{
    fetch('https://purple-deer-71.localtunnel.me/game_instances')
    .then(r=>r.json())
    .then(r=>{this.checkGameProgress(r)})
  }

  checkGameProgress =(r)=>{
    let game = r.find(g=>{
    return g.game_status === "pregame"
    })
    if (game) {
      this.setState({
        joinableGame:game.id
      })
    }
  }

  renderJoinGame=()=>{
    this.setState({currentGame: this.state.joinableGame}, this.setGameUser)
    return (
      <Game
      currentGame={this.state.currentGame}
      gameQuestions={this.state.gameQuestions}
      currentUser={this.state.currentUser}
      currentUsers={this.state.currentUsers}
      reset={this.reset}
      startGame={this.startGame}
      // questions={this.state.questions}
      // answers={this.state.answers}
      currentQuestion={this.state.currentQuestion}
      currentAnswers={this.state.currentAnswers}
      />
    )
  }

  renderJoinButton=()=>{
    return (
      <div>
        <button onClick={this.renderJoinGame}>{this.state.joinableGame}</button>
      </div>
    )
  }

  renderGame=()=>{
    if (this.state.currentGame) {
      return (
        <Game
        currentGame={this.state.currentGame}
        gameQuestions={this.state.gameQuestions}
        currentUser={this.state.currentUser}
        currentUsers={this.state.currentUsers}
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
    console.log(this.state.currentUsers);
    return (
      <div className="GameList">
        <div>{this.renderJoinButton()}</div>
        <button onClick={this.startGame}>new game</button>
        {this.renderGame()}
      </div>
    );
  }
}

export default GameList;
