import React, { Component } from 'react';
import './App.css';
import QuestionScreen from './QuestionScreen';
import AnswerScreen from './AnswerScreen';
import Score from './Score';

class Game extends Component {

  state = {
    questions: [],
    answers: {},
    currentQuestion: {},
    currentAnswers: {},
    // masterUser: '',
    // users: [],
    userInput: ''
  }

  fetchQuestions = () => {
    fetch('http://localhost:3000/questions')
    .then(r => r.json())
    .then(q => {
      let shuffled = q.map(x => { return {data: x, srt: Math.random()}})
      .sort((a,b) => {return a.srt - b.srt})
      .map(x => x.data);
      this.setState({questions: shuffled.slice(0,10)})
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

  nextRound=()=>{
    // keeps track of timer, and calls setQuestion and setAnswers at a certain time
  }

  setQuestion = () => {
    // takes this.state.questions
    // removes one question out and sets state of currentQuestion to that question
    // is called by some kind of timer
    let questions = [...this.state.questions]
    let currentQuestion = questions[0]
    questions.shift()
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
    this.setState({currentAnswers: shuffled.slice(0,3)})
    // takes this.state.currentQuestion
    // matches that question with matching answers
    // takes 3 of those answers at random and assigns to this.state.currentAnswer
  }

  getUserInput = (input) => {
    this.setState({
      userInput:input
    })
  }

    // takes array of questions
    // matches questions to answers by id
    // takes 3 answers per question at random
    // question: a1, a2, a3


  componentDidMount = () => {
    this.fetchQuestions()
    this.fetchAnswers()
  }

  renderGame = () => {
    if (this.state.currentAnswers.length !== undefined) {
      return (
        <div>
        <Score />
        <QuestionScreen
          currentQuestion={this.state.currentQuestion}
          getUserInput={this.getUserInput}
          />
        <AnswerScreen
          currentAnswers={this.state.currentAnswers}
          currentQuestion={this.state.currentQuestion}
          userInput={this.state.userInput}
          />
          </div>
      )
    } else {
      return (
        <QuestionScreen
          currentQuestion={this.state.currentQuestion}
          getUserInput={this.getUserInput}
          />
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
        <button onClick={this.setQuestion}>next Q</button>
        {this.renderGame()}
      </div>
    );
  }
}

export default Game;
