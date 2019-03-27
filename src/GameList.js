import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class GameList extends Component {

  state= {
    questions: [],
    answers: {},
    currentQuestion: {},
    currentAnswers: {},
    currentGame: null
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
        game_status: "in progress"
      })
    }).then(r=>r.json())
    .then(r=>this.setState({
      currentGame: r.id
    }))
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
      this.setState({answers: arr},
        this.setQuestion
      )
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

  setQuestion = () => {
    // takes this.state.questions
    // removes one question out and sets state of currentQuestion to that question
    // is called by some kind of timer
    let questions = [...this.state.questions]
    let currentQuestion = questions[0]
    questions.shift()
    console.log(this.state.questions)
    console.log('cq', currentQuestion)
    this.setState({
      questions: questions,
      currentQuestion: currentQuestion
    }, this.setAnswers)
  }

  setAnswers = () => {
    let currentQuestion = this.state.currentQuestion
    let answers = this.state.answers
    let shuffled = answers[currentQuestion.id].map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);
    console.log('shuffled', shuffled.slice(0,3))

    this.setState({currentAnswers: shuffled.slice(0,3)})
    // takes this.state.currentQuestion
    // matches that question with matching answers
    // takes 3 of those answers at random and assigns to this.state.currentAnswer
  }

  componentDidMount=()=>{
    this.fetchQuestions()
  }

  renderGame=()=>{
    if (this.state.currentGame) {
      return (
        <Game
        questions={this.state.questions}
        answers={this.state.answers}
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
