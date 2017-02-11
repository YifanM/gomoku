import React, { Component } from 'react';
import classnames from 'classnames';
import './App.css';
import Modal from 'react-modal';

class PlayArea extends Component {
  render() {
  	var areaClass = classnames({
  		button: true,
  		black: this.props.gameState === "b",
  		white: this.props.gameState === "w",
  	})
    return (
      <button className={areaClass} onClick={() => this.props.onClick()}></button>
    );
  }
}

class PlaceMarker extends Component {
  render() {
    var markerStyle;
    if (this.props.value[0] === 9 && this.props.value[1] === 9) markerStyle = {margin: "-58px 0 0 281px"};
    else if (this.props.value[0] === 5 && this.props.value[1] === 5) markerStyle = {margin: "-59px 0 0 145px"};
    else if (this.props.value[0] === 5 && this.props.value[1] === 13) markerStyle = {margin: "-59px 0 0 417px"};
    else if (this.props.value[0] === 13 && this.props.value[1] === 5) markerStyle = {margin: "-59px 0 0 145px"};
    else if (this.props.value[0] === 13 && this.props.value[1] === 13) markerStyle = {margin: "-59px 0 0 417px"};
    return (
      <div className="placeMarker" style={markerStyle}></div>
    )
  }
}

class Board extends Component {
  renderArea(r, c) {
    return <PlayArea gameState={this.props.gameState[r][c]} value={[r, c]} onClick={() => this.props.onClick(r, c, "move")} class/>;
  }
  render() {
    var gameBoard = [];
    for (var i = 0; i < 17; i++){
      let row = [];
      for (var j = 0; j < 17; j++){
        if ((i === 9 && j === 9) ||
            (i === 5 && j === 5) ||
            (i === 5 && j === 13) ||
            (i === 13 && j === 5) ||
            (i === 13 && j === 13)) row.push(<PlaceMarker value={[i, j]}/>);
        row.push(this.renderArea(i, j));
      }
      gameBoard.push(row);
    }
    return (
      <div className="board">
        <div className="boardBackground">
        </div>
        <div className="boardPieces">
        { gameBoard }
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    this.state = {
      gameState: Array(17).fill(Array(17).fill(null)),
      gameHistory: [],
      blackMove: true,
      initialMoveBlack: true,
      winner: "",
      blackWins: 0,
      whiteWins: 0,
    }
  }
  handleClick(r, c, state){
  	if ((this.state.gameState[r][c] || this.state.winner) && state === "move") return;
  	const gameState = this.state.gameState.map((row) => row.slice());
  	const gameHistory = this.state.gameHistory.slice();
  	let blackWins = this.state.blackWins;
  	let whiteWins = this.state.whiteWins;
  	let result;

  	if (state === "move") { // move
  		if (this.state.blackMove) gameState[r][c] = "b";
	  	else gameState[r][c] = "w";
	  	gameHistory.push([r, c]);
	  	result = moveResult(r, c, this.state.blackMove ? "b" : "w", gameState);
	    if (result) result === "Black wins." ? blackWins += 1 : whiteWins += 1;	
  	} else { // undo
  		if (this.state.winner === "Black wins.") blackWins -= 1;
  		else if (this.state.winner === "White wins.") whiteWins -= 1;
  		gameState[r][c] = null;
  		gameHistory.pop();
  	}

    this.setState({
    	gameState: gameState,
    	gameHistory: gameHistory,
    	blackMove: !this.state.blackMove,
    	winner: result,
    	blackWins: blackWins,
    	whiteWins: whiteWins,
    });
  }
  restartGame(){
  	if (this.state.winner === "Black wins.") {
  		this.setState({
  			blackMove: false,
  			initialMoveBlack: false,
  		})
  	}
  	else if (this.state.winner === "White wins.") {
  		this.setState({
  			blackMove: true,
  			initialMoveBlack: true,
  		})
  	}
  	else {
  		this.setState({
  			blackMove: this.state.initialMoveBlack,
  		})
  	}
  	this.setState({
  		gameState: Array(17).fill(Array(17).fill(null)),
  		gameHistory: [],
      winner: "",
  	});
  }
  undoMove(){
		this.handleClick(this.state.gameHistory[this.state.gameHistory.length-1][0],
										 this.state.gameHistory[this.state.gameHistory.length-1][1], "undo");
  }
  render() {
    let status;
    if (this.state.winner) status = this.state.winner;
    else status = (this.state.blackMove ? "Black" : "White") + " to move.";
    return (
      <div>
        <Board gameState={this.state.gameState} onClick={(r, c, state) => this.handleClick(r, c, state)}/>
        <div id="menu">
	        <div>{status}</div>
	        <button disabled={!this.state.gameHistory.length} onClick={() => this.undoMove()}>Undo</button>
	        <button onClick={() => this.restartGame()}>Restart</button>
        </div>
        <div id="scoreboard">
	        <h4>Black's score: {this.state.blackWins}</h4>
	        <h4>White's score: {this.state.whiteWins}</h4>
	      </div>
	      <button id="rules" onClick={() => this.openModal()}>Rules</button>
	      {/*<Modal>
        <h3>Rules</h3>
        Each turn, select an intersection to play your piece. Rows can be made in any straight direction.
        <ol>
	        <li>White wins with rows of five or more.</li>
	        <li>Black wins with only rows of five. In addition, Black cannot
	        	<ol>
	        		<li>a</li>
	        		<li>list</li>
	        		<li>here</li>
	        	</ol>
	        </li>
        </ol>
        </Modal>*/}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Game />
    );
  }
}

function travel(r, c, color, gameState, direction){
  if (r < 0 || r > 16 || c < 0 || c > 16){
    return 0;
  }
  else if (gameState[r][c] === color){
    return travel(r+direction[0], c+direction[1], color, gameState, direction) + 1;
  }
  return 0;
}

function moveResult(r, c, color, gameState){
  const directions = [[0, 1], [1, 1], [1, 0], [1, -1]];
  for (let i = 0; i < 4; i++){
  	let reverse = directions[i].map(x => {return -x})
    let temp = travel(r+directions[i][0], c+directions[i][1], color, gameState, directions[i]) 
    			 	   + travel(r+reverse[0], c+reverse[1], color, gameState, reverse)
    	    		 + 1;
    if (temp >= 5){
  	  if (color === "b") return "Black wins.";
	  	else return "White wins.";
    }
  }
  //return "illegal";
  return null;
}

export default App;
