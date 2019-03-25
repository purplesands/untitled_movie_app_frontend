import React, { Component } from 'react';
import './App.css';
import QuestionScreen from './QuestionScreen';
import AnswerScreen from './AnswerScreen';
import Score from './Score';

class Game extends Component {

  state = {
    questions: [],
    answers: []
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
      let shuffled = arr.map(x => { return {data: x, srt: Math.random()}})
      .sort((a,b) => {return a.srt - b.srt})
      .map(x => x.data);
      debugger
      this.setState({answers: shuffled.slice(0,3)})
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
    // for (var i = 0; i < 3; i++) {
    //   for (var y = 0; y < questions.length; y++) {
    //     if (answers[i].question_id === questions[y].id) {
    //       debugger
    //       answerSet[questions[y].id] = answers[i]
    //     }
    //   }
    // }
    debugger
    return answerSet
  }

    // takes array of questions
    // matches questions to answers by id
    // takes 3 answers per question at random
    // question: a1, a2, a3




  componentDidMount = () => {
    this.fetchQuestions()
    this.fetchAnswers()
  }

  render() {
    console.log(this.state.questions)
    console.log(this.state.answers)
    return (
      <div className="Game">
        <Score />
        <QuestionScreen />
        <AnswerScreen />
      </div>
    );
  }
}

export default Game;
