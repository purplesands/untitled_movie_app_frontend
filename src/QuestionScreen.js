import React, { Component } from 'react';
import './App.css';

class QuestionScreen extends Component {
  state = {
    input: ''
  }

  handleInput = (e) => {
    if (!this.checkInput(e.target.value.toLowerCase())) {
      let input = e.target.value.split(" ")
      if (input.length > 1) {
        input.pop()
        let newInput = [...input, "⌧"]
        newInput = newInput.join(" ")
        e.target.value = newInput
      } else {
        e.target.value = "⌧"
      }
    } else {
      this.setState({input:e.target.value})
    }
    // console.log("input", this.state.input)
  }

  submitInput = (e) => {
    e.preventDefault()
    this.props.getUserInput(this.state.input)
  }

  checkInput = (input)=>{
    let safeWords = ["the","of","and","a","to","in","is","you","that","it","he","was","for","on","are","as","with","his","they","I","at","be","this","have","from","or","one","had","by","word","but","not","what","all","were","we","when","your","can","there","use","an","each","which","she","do","how","their","if","will","up","other","about","out","many","then","them","these","so","some","her","would","make","like","him","into","time","has","look","more","go","see","number","no","way","could","people","my","than","first","been","call","who","its","now","find","long","down","day","did","get","come","made","may","part"]

    let title = this.props.currentQuestion.question.title.toLowerCase().split(' ')
    let words = [...this.props.currentQuestion.question.synopsis.toLowerCase().split(' '), ...title]
    words = words.map(i => i.replace(/[.,'-:!?]/, ''))
    // console.log(words)
    let newInput = input.split(' ')
    // console.log('before', newInput)
    newInput = newInput.filter(val => !safeWords.includes(val));
    // console.log('after', newInput)
    const found = words.some(r=> newInput.indexOf(r) >= 0)

    if (found) {
      return false;
    } else {
      return true;
    }
  }

  renderScreen = () => {
    if (this.props.clicked === false) {
      return (
        <div>
          <p>Title: {this.props.currentQuestion.question.title} </p>
          <p>Synopsis: {this.props.currentQuestion.question.synopsis}</p>
          <form onSubmit={this.submitInput}>
            Enter Plot Summary: <textarea rows="2" cols="30" type="text" name="input" onChange={(e)=>this.handleInput(e)} maxlength="25"/>
            <button type="submit" value="Submit" > Submit </button>
          </form>
        </div>
      )
    } else {
      return null
    }

  }


  render() {

    console.log("q props: ", this.props);
    return (
      <div className="QuestionScreen">
        {this.renderScreen()}
      </div>
    );
  }
}

export default QuestionScreen;
