import React, { Component } from 'react';
import './App.css';
import Game from './Game';
import { ActionCableConsumer } from 'react-actioncable-provider'

class GameList extends Component {

  state= {
    questions: [],
    answers: {},
    currentGame: null,
    currentUser: {},
    gameQuestions: [],
    joinableGames: [],
    gameOver: false
  }

  reset=()=>{
    this.setState({
      questions: [],
      answers: {},
      currentGame: null,
      currentUser: {},
      gameQuestions: [],
      joinableGames: [],
      gameOver: false
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
        game_status: "pregame",
        user_status: this.props.user.username
      })
    }).then(r=>r.json())
    .then(r=>this.setState({
      currentGame: r.id
    }, this.setFirstUser))
  }

  setFirstUser=()=>{
    this.setGameHost()
    this.state.questions.map(q => {
      return this.postGameQuestion(q)
    })
  }

  // setJoinUser=()=>{
  //   this.setGameHost()
  //   this.state.questions.map(q => {
  //     return this.postGameQuestion(q)
  //   })
  // }

  // joinGame = (id) => {
  //   fetch(`http://localhost:3000/game_instances/${id}`)
  //   .then(r => r.json())
  //   .then(r => {
  //     this.setState({gameQuestions: r.game_questions})
  //   }, this.renderJoinGame(id))
  // }

  joinGame = (id) => {
    fetch(`http://localhost:3000/game_questions`)
    .then(r => r.json())
    .then(r => {
      let game_questions = r.filter(q => {
        return id === q.game_instance_id
      })
      this.setState({gameQuestions: game_questions})
    }, this.renderJoinGame(id))
  }

  setGameHost=()=>{
    fetch('http://localhost:3000/game_users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_instance_id: this.state.currentGame,
        user_id: this.props.user.id,
        score: 0,
        host: true
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({currentUser: r})
    })
    // .then(console.log)
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
        score: 0,
        host: false
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({currentUser: r})
    })
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
    this.checkNewGame()
    // this.interval = setInterval(this.checkNewGame, 1000);
  }

  componentWillUnmount() {
      // Clear the interval right before component unmount
    clearInterval(this.interval);
  }


  checkNewGame=()=>{
    fetch('http://localhost:3000/game_instances')
    .then(r=>r.json())
    .then(r=>{this.checkGameProgress(r)})
  }

  checkGameProgress =(r)=>{
    let games = r.filter(g=>{
      return g.game_status === "pregame"
    })
    if (games) {
      this.setState({
        joinableGames:games
      })
    }
  }

  renderJoinGame=(id)=>{
    this.setState({currentGame: id}, this.setGameUser)
    return (
      <Game
      currentGame={this.state.currentGame}
      gameQuestions={this.state.gameQuestions}
      currentUser={this.state.currentUser}
      reset={this.reset}
      setGameOver={this.setGameOver}
      gameOver={this.state.gameOver}
      user={this.props.user}
      />
    )
  }

  renderJoinButtons=(arr)=>{
    return arr.map(game => {
      return (
        <div>
          <button onClick={()=>this.joinGame(game.id)}>{game.id} hosted by {game.user_status}</button>
        </div>
      )
    })
  }

  setGameOver = () => {
    this.setState({gameOver: !this.state.gameOver})
    // this.reset()
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
        setGameOver={this.setGameOver}
        gameOver={this.state.gameOver}
        user={this.props.user}
        />
      )
    } else {
      return null
    }
  }

  renderMenu = () => {
    if (!this.state.currentGame) {
      return (
        <div className="GameList">
          <div>{this.renderJoinButtons(this.state.joinableGames)}</div>
          <button onClick={this.startGame}>new game</button>
          {this.renderGame()}
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="GameList">
        <ActionCableConsumer
        channel = {{ channel: 'FeedChannel'}}
        onReceived={data=>this.checkNewGame()}/>
        {this.renderMenu()}
        {this.renderGame()}
      </div>
    );
  }
}

export default GameList;
