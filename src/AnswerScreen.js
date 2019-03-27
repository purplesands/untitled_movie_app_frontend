import React, { Component } from 'react';
import './App.css';

class AnswerScreen extends Component {

  state = {
    input: '',
    currentAnswers:[]
  }

  setAnswers=()=> {
    let answers = [...this.props.currentAnswers, this.props.currentQuestion.question]
    let shuffled = answers.map(x => { return {data: x, srt: Math.random()}})
    .sort((a,b) => {return a.srt - b.srt})
    .map(x => x.data);

    this.setState({
      currentAnswers:shuffled
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
      debugger
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
}

  componentWillUnmount() {
      // Clear the interval right before component unmount
    clearInterval(this.interval);
  }

  fetchInput = () => {
      fetch(`http://localhost:3000/game_questions/${this.props.currentQuestion.id}`)
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
          <button onClick={this.props.endTimer}>end timer</button>
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
