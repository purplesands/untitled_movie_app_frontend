import React, { Component } from 'react';
import './App.css';
import QuestionScreen from './QuestionScreen';
import AnswerScreen from './AnswerScreen';
import { ActionCableConsumer } from 'react-actioncable-provider'

class Game extends Component {

  state = {
    round: 1,
    userInput: '',
    timer:10,
    gameQuestions:[],
    currentQuestion: {},
    currentAnswers: [],
    currentGame: {},
    answer_user: {},
    scoreboard: {},
    clicked: false,
    answered: false
  }

  answered = () => {
    this.setState({answered: !this.state.answered})
  }

  getUserInput = (input) => {
    this.setState({
      userInput:input,
      clicked: !this.state.clicked
    })
    fetch(`http://localhost:3000/game_questions/${this.state.currentQuestion.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: input
      })
    }).then(r=>r.json())
    .then(r => {
      this.setQuestion()
    })
  }

  componentDidMount = () => {
    this.setState({currentGame: this.props.currentGame})
  }

  setQuestion = () => {
    let questions = [...this.props.gameQuestions]
    // debugger
    let currentQuestion = questions.find(q=>{return q.completed === false})
    this.setState({
      gameQuestions: questions,
      currentQuestion: currentQuestion,
      currentAnswers: []
    }, this.setAnswers)
  }

  setNextQuestion = () => {
    let questions = [...this.state.gameQuestions]
    // debugger
    let currentQuestion = questions.find(q=>{return q.completed === false})
    this.setState({
      gameQuestions: questions,
      currentQuestion: currentQuestion,
      currentAnswers: []
    }, this.setAnswers)
  }

  setAnswers = () => {
    // added active boolean column to answers table and patch active column to true when answers are setState
    //******************************************************************************************************
    // need to check if current game_user is the host or not. if not, fetch answers with active set to true.
    // add host boolean column to game_user
    // create game_answer intance with 3 wrong answers and the correct answer
    // create for each round and grab the latest 4 at the beginning of each round
    //******************************************************************************************************
    if (this.props.currentUser.host === true) {
      let currentQuestion = {...this.state.currentQuestion}
      let shuffled = currentQuestion.answers.map(x => { return {data: x, srt: Math.random()}})
      .sort((a,b) => {return a.srt - b.srt})
      .map(x => x.data)
      .slice(0,3);
      shuffled.push(currentQuestion.question)
      let gameAnswer = shuffled.map(x => { return {data: x, srt: Math.random()}})
      .sort((a,b) => {return a.srt - b.srt})
      .map(x => x.data)
      for (var i = 0; i < gameAnswer.length; i++) {
        fetch(`http://localhost:3000/game_answers`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            game_question_id: currentQuestion.id,
            title: gameAnswer[i].title
          })
        }).then(r=>r.json())
        .then(r => {
          this.setState({
            currentAnswers: [...this.state.currentAnswers, r],
          })
        })
      }
    } else {
      fetch(`http://localhost:3000/game_questions/${this.state.currentQuestion.id}`)
      .then(r => r.json())
      .then(r => {
          //multiple answers are true because of active or previous games. reset them somehow?
          this.setState({currentAnswers: r.game_answers})
      })
    }
}

  endTimer=()=>{
    let newQ = this.state.currentQuestion
    newQ.completed = true
    fetch(`http://localhost:3000/game_questions/${this.state.currentQuestion.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: true
      })
    }).then(r=>r.json())
    .then(r => {
      this.setState({currentQuestion: newQ, round: this.state.round += 1,
      clicked: false},
      this.completeRound)
    })
  }

  completeRound = () => {
    let gameStatus = "in progress"
    if (this.state.round === 3) {
      gameStatus = "complete"
    }
    if (this.state.round <= 3) {
      fetch(`http://localhost:3000/game_instances/${this.state.currentGame}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_round: this.state.round,
          game_status: gameStatus
        })
      }).then(r=>r.json())
      .then(r => {
        console.log("round end", r)
        this.setQuestion()
        this.answered()
      })
    } else {
      this.endGame()
    }
  }

  // fetchNewGameQuestions=(round)=>{
  //   fetch(`http://localhost:3000/game_questions`)
  //   .then(r => r.json())
  //   .then(r => {
  //     let game_questions = r.filter(q => {
  //       return this.state.currentGame === q.game_instance_id
  //     })
  //     this.setState({gameQuestions: game_questions,
  //     round:round
  //   }, this.smartFunction)
  //   // .then(r=>{
  //   //   this.setQuestion()
  //   //   this.answered()
  //   // })
  //   })
  //
  // }
  //
  // smartFunction = () => {
  //   this.setNextQuestion()
  //   // this.answered()
  // }

  endGame = () => {
    fetch(`http://localhost:3000/game_instances/${this.state.currentGame}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game_round: 10,
        game_status: "complete"
      })
    }).then(r=>r.json())
    .then(r => {
      this.props.setGameOver()
      console.log("game end", r)
      // this.props.reset()
    })
  }

  updateScore = (id) => {
      let that = this
      let newScoreboard = this.state.scoreboard
      newScoreboard[that.props.currentUser.id] = this.props.currentUser.score += 10
      fetch(`http://localhost:3000/game_users/${that.props.currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: this.props.currentUser.score
        })
      }).then(r=>r.json())
      .then(r => {
        this.setState({answer_user: r, scoreboard: newScoreboard})
      })
    }

    checkQuestion=(data)=>{
      this.setState({
        round:data.game_round
      })
      // if (data.game_round < 4) {
        this.props.fetchNewGameQuestions(data.game_round)
        setTimeout(this.setQuestion, 2000)
      // } else {
      // }
      // this.setState({currentGame:data})
    }

    checkAnswer=(data)=>{
    }

    renderQuestionScreen = () => {
      return (
        <div>
        <ActionCableConsumer
        channel = {{ channel: 'FeedChannel'}}
        onReceived={data=>this.checkQuestion(data)}/>
        <QuestionScreen
          currentQuestion={this.state.currentQuestion}
          getUserInput={this.getUserInput}
          clicked={this.state.clicked}
          />
        </div>
      )
    }

    renderAnswerScreen = () => {
      return (
        <div>
        <ActionCableConsumer
        channel = {{ channel: 'FeedChannel'}}
        onReceived={data => this.checkAnswer(data)}/>
        <AnswerScreen
          currentAnswers={this.state.currentAnswers}
          currentQuestion={this.state.currentQuestion}
          userInput={this.state.userInput}
          addPoint={this.addPoint}
          updateScore={this.updateScore}
          endTimer={this.endTimer}
          round={this.state.round}
          answered={this.answered}
          answerState={this.state.answered}
          />
        </div>
      )
    }

  renderGame = () => {
    // if (this.state.currentAnswers.length === 3) {
    if (this.state.currentAnswers.length > 3) {
      return (
        <div>
          {this.renderQuestionScreen()}
          {this.renderAnswerScreen()}
        </div>
      )
    } else {
      // debugger
    }
  }

  renderScores = () => {
    return (
      <div>
        <ul>
          {this.props.user.username} - {this.state.scoreboard[this.state.answer_user.id]}
        </ul>
      </div>
    )

  }

  // renderGameOver = () => {
  //   if (this.props.gameOver === true) {
  //     return (
  //       <div>
  //         <h2> Score </h2>
  //         {this.renderScores()}
  //       </div>
  //     )
  //   } else {
  //     return null
  //   }
  // }

  render() {
    console.log("input ", this.state.userInput);
    // console.log('questions', this.state.questions)
    // console.log('answers', this.state.answers)
    // console.log('current As', this.state.currentAnswers)
    console.log('scoreboard', this.state.scoreboard)

    return (
      <div className="Game">
        <button onClick={this.setQuestion}>begin</button>
         {this.renderGame()}
      </div>
    );
  }
}

export default Game;
