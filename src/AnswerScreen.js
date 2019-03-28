import React, { Component } from 'react';
import './App.css';

class AnswerScreen extends Component {

  state = {
    input: '',
    currentAnswers:[],
    round: ''
  }

  setAnswers=()=> {
    let answers = [...this.props.currentAnswers, this.props.currentQuestion.question]
    let shuffled = answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);

    this.setState({
      currentAnswers:shuffled,
      round: this.props.round
    })
  }

  renderAnswers=()=>{
    return this.state.currentAnswers.map(a=>{
      return <p><button className="answerButton"
              value={a.title}
              id={a.id}
              onClick={this.checkAnswer}>
              {a.title}
              </button> </p>
    })
  }


  checkAnswer = (e) => {
    if (this.props.currentQuestion.question.title === e.target.value) {
      console.log('right')
      this.props.updateScore(this.props.currentQuestion.question_id)
    } else {
      console.log('wrong')
    }
  }

  componentDidMount() {
    // Call this function so that it fetch first time right after mounting the component
    this.fetchInput();
    this.setAnswers();

    // set Interval
    this.interval = setInterval(this.fetchInput, 2000);
    this.interval = setInterval(this.checkRound, 1000);

}

  checkRound=()=>{
    if (this.props.round>this.state.round) {
      this.setAnswers()
    }
  }
  componentWillUnmount() {
      // Clear the interval right before component unmount
    clearInterval(this.interval);
  }

  fetchInput = () => {
      fetch(`https://purple-deer-71.localtunnel.me/game_questions/${this.props.currentQuestion.id}`)
      .then(r=>r.json())
      .then(r=>{
        this.setState({
          input: r.input
        })
      })
    }


  render() {
    return (
      <div className="AnswerScreen">
        <ul>
          <button onClick={this.props.endTimer}>End Round</button>
          <p>Plot Summary:</p>
          {this.state.input}
          <p>answers:</p>
          {this.renderAnswers()}
        </ul>
      </div>
    );
  }
}

export default AnswerScreen;
