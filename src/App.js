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
    return (
      <button className="button" onClick={() => this.props.onClick()}></button>
    );
  }
}

class Board extends Component {
  renderArea(r, c) {
    return <PlayArea value={[r, c]} onClick={() => this.props.onClick(r, c)} class/>;
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
      gameState: Array(15).fill(Array(15).fill(null)),
      blackMove: true
    }
  }
  handleClick(r, c){
    this.setState({blackMove: !this.state.blackMove});
    let result = moveResult(r, c, this.state.blackMove ? "b" : "w", this.state.gameState);
  }
  render() {
    var status = (this.state.blackMove ? "Black" : "White") + " to move.";
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
  if (r >= 0 && r <= 17 && c >= 0 && c <= 17){
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
    let temp = 1 + travel(r, c, color, gameState, directions[i]) + travel(r, c, color, gameState, directions[i].map(x => {return -x}));
    if (temp >= 5){
      return color + "Win";
    }
  }
  //return "illegal";
  return null;
}

export default App;
