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
    currentUser: 1,
    gameQuestions: []
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
        user_id: this.state.currentUser,
        score: 0
      })
    }).then(r=>r.json())
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

  // getGameQuestions=()=>{
  //   fetch('http://localhost:3000/game_questions')
  //   .then(r => r.json())
  //   .then(r => {
  //     this.filterGameQuestions(r)
  //   })
  //   .then(console.log)
  // }
  //
  // filterGameQuestions = (arr) => {
  //   return arr.filter(q=>{
  //     return q.game_instance_id===this.state.currentGame
  //   })
  // }


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

  // setQuestion = () => {
  //   // takes this.state.questions
  //   // removes one question out and sets state of currentQuestion to that question
  //   // is called by some kind of timer
  //   // let questions = [...this.state.questions]
  //   let questions = [...this.state.questions]
  //   let currentQuestion = questions[0]
  //   questions.shift()
  //   console.log(this.state.questions)
  //   console.log('cq', currentQuestion)
  //   this.setState({
  //     questions: questions,
  //     currentQuestion: currentQuestion
  //   }, this.setAnswers)
  // }
  //
  // setAnswers = () => {
  //   let currentQuestion = this.state.currentQuestion
  //   let answers = this.state.answers
  //   let shuffled = answers[currentQuestion.id].map(x => { return {data: x, srt: Math.random()}})
  //   .sort((a,b) => {return a.srt - b.srt})
  //   .map(x => x.data);
  //   console.log('shuffled', shuffled.slice(0,3))
  //
  //   this.setState({currentAnswers: shuffled.slice(0,3)})
  //   // takes this.state.currentQuestion
  //   // matches that question with matching answers
  //   // takes 3 of those answers at random and assigns to this.state.currentAnswer
  // }

  componentDidMount=()=>{
    this.fetchQuestions()
  }

  renderGame=()=>{
    if (this.state.currentGame) {
      return (
        <Game
        currentGame={this.state.currentGame}
        gameQuestions={this.state.gameQuestions}
        // questions={this.state.questions}
        // answers={this.state.answers}
        currentQuestion={this.state.currentQuestion}
        currentAnswers={this.state.currentAnswers}
        setQuestion={this.setQuestion}
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
