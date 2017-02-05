import React, { Component } from 'react';
import classnames from 'classnames';
import './App.css';

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

class PlayArea extends Component {
  render() {
  	var areaClass = classnames({
  		button: true,
  		black: this.props.gameState === "b",
  		white: this.props.gameState === "w"
  	})
    return (
      <button className={areaClass} onClick={() => this.props.onClick()}></button>
    );
  }
}

class Board extends Component {
  renderArea(r, c) {
    return <PlayArea gameState={this.props.gameState[r][c]} value={[r, c]} onClick={() => this.props.onClick(r, c)} class/>;
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
      blackMove: true,
      winner: ""
    }
  }
  handleClick(r, c){
  	if (this.state.gameState[r][c] || this.state.winner) return;
  	const gameState = this.state.gameState.map((row) => row.slice());
  	if (this.state.blackMove) gameState[r][c] = "b";
  	else gameState[r][c] = "w";
  	let result = moveResult(r, c, this.state.blackMove ? "b" : "w", gameState);
    this.setState({
    	gameState: gameState,
    	blackMove: !this.state.blackMove,
    	winner: result
    });
  }
  render() {
    let status;
    if (this.state.winner) status = this.state.winner;
    else status = (this.state.blackMove ? "Black" : "White") + " to move.";
    return (
      <div>
        <Board gameState={this.state.gameState} onClick={(r, c) => this.handleClick(r, c)}/>
        <div>{status}</div>
        <button>Undo</button>
        <button>(Re)start</button>
        <h4>White score:</h4>
        <h4>Black score:</h4>
        <small>This version's rules:</small>
        <li>No swap</li>
        <li>Rows of five or more win</li>
        <li>Except, black cannot make open 3-3 or open 4-4 and can</li>
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
  if (r < 0 || r > 17 || c < 0 || c > 17){
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
