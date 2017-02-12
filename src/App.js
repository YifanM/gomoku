import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import './App.css';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import NotificationSystem from 'react-notification-system';

class PlayArea extends Component {
  render() {
    return (
    	<div id="playContainer">
      	<button className="button" onClick={() => this.props.onClick()}></button>
      	<PlayAreaGraphic colourState={this.props.colourState} gameState={this.props.gameState} />
      </div>
    );
  }
}

class PlayAreaGraphic extends Component {
	render() {
		var colour = classnames({
			grow: this.props.gameState,
			black: this.props.colourState === "b",
			white: this.props.colourState === "w",
		})
		return (
				<div className={colour} />
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
    return <PlayArea colourState={this.props.colourState[r][c]} gameState={this.props.gameState[r][c]} onClick={() => this.props.onClick(r, c, "move")} />;
  }
  componentDidMount() {
  	var node = ReactDOM.findDOMNode(this);
  	node.style.opacity = 0;
  	window.requestAnimationFrame(function() {
			node.style.transition = "opacity 2s";
			node.style.opacity = 1;
		});
  }
  render() {
    var gameBoard = [];
    for (var i = 0; i < 17; i++) {
      let row = [];
      for (var j = 0; j < 17; j++) {
        if ((i === 9 && j === 9) ||
            (i === 5 && j === 5) ||
            (i === 5 && j === 13) ||
            (i === 13 && j === 5) ||
            (i === 13 && j === 13)) row.push(<PlaceMarker value={[i, j]} />);
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

	notification: null;

  constructor() {
    super();
    this.state = {
      gameState: Array(17).fill(Array(17).fill(null)),
      colourState: Array(17).fill(Array(17).fill(null)),
      gameHistory: [],
      blackMove: true,
      initialMoveBlack: true,
      winner: "",
      blackWins: 0,
      whiteWins: 0,
      isModalOpen: false,
    };
  }
  handleClick(r, c, state) {
  	if ((this.state.gameState[r][c] || this.state.winner) && state === "move") return;
  	const gameState = this.state.gameState.map((row) => row.slice());
  	const colourState = this.state.colourState.map((row) => row.slice());
  	const gameHistory = this.state.gameHistory.slice();
  	let blackWins = this.state.blackWins;
  	let whiteWins = this.state.whiteWins;
  	let result;

  	if (state === "move") { // move
  		result = moveResult(r, c, this.state.blackMove ? "b" : "w", this.state.initialMoveBlack ? "b" : "w", gameState);
  		if (result.search("Illegal") !== -1) {
  			this.notification.addNotification({
  				title: "Oops",
  				message: result,
  				level: "error",
  				position: "tc",
  			})
  			return;
  		}
  		if (this.state.blackMove) {
  			gameState[r][c] = "b";
  			colourState[r][c] = "b";
  		}
	  	else {
	  		gameState[r][c] = "w";
	  		colourState[r][c] = "w";
	  	}
	  	gameHistory.push([r, c]);
	    if (result) result === "Black wins." ? blackWins += 1 : whiteWins += 1;	
  	} else { // undo
  		if (this.state.winner === "Black wins.") blackWins -= 1;
  		else if (this.state.winner === "White wins.") whiteWins -= 1;
  		gameState[r][c] = null;
  		gameHistory.pop();
  	}

    this.setState({
    	gameState: gameState,
    	colourState: colourState,
    	gameHistory: gameHistory,
    	blackMove: !this.state.blackMove,
    	winner: result,
    	blackWins: blackWins,
    	whiteWins: whiteWins,
    });
  }
  restartGame() {
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
  undoMove() {
		this.handleClick(this.state.gameHistory[this.state.gameHistory.length-1][0],
										 this.state.gameHistory[this.state.gameHistory.length-1][1], "undo");
  }
  openModal() {
  	this.setState({
  		isModalOpen: true,
  	})
  }
  closeModal() {
  	this.setState({
  		isModalOpen: false,
  	})
  }
  componentDidMount() {
  	this.notification = this.refs.notification;
  }
  render() {
    let status;
    if (this.state.winner) status = this.state.winner;
    else status = (this.state.blackMove ? "Black" : "White") + " to move.";

    return (
      <div>
        <Board colourState={this.state.colourState} gameState={this.state.gameState} onClick={(r, c, state) => this.handleClick(r, c, state)} />
        <div id="menu">
	        <div>{status}</div>
	        <button disabled={!this.state.gameHistory.length} onClick={() => this.undoMove()}>Undo</button>
	        <button onClick={() => this.restartGame()}>Restart</button>
        </div>
        <div id="scoreboard">
	        <h4>Black's score: {this.state.blackWins}</h4>
	        <h4>White's score: {this.state.whiteWins}</h4>
	      </div>
	      <div id="rules">
	      	<button id="rules" onClick={() => this.openModal()}>Rules</button>
	      </div>
	      {this.state.isModalOpen && <ModalContainer onClose={() => this.closeModal()}>
	       	<ModalDialog onClose={() => this.closeModal()}>
		        <h3>Rules</h3>
		        Each turn, select an intersection to play your piece. Rows can be made in any straight direction.
		        <ol>
			        <li>Second player wins with rows of five or more.</li>
			        <li>First player wins with only rows of five. In addition, first player cannot
			        	<ol type="a">
			        		<li>make open 3-3s</li>
			        		<li>make open 4-4s</li>
			        	</ol>
			        </li>
		        </ol>
		      </ModalDialog>
        </ModalContainer>}
        <NotificationSystem ref="notification" />
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

function travel(r, c, color, gameState, direction, isClosed) {
  if (r < 0 || r > 16 || c < 0 || c > 16) {
  	isClosed.value = true;
    return 0;
  }
  else if (gameState[r][c] === color) {
    return travel(r+direction[0], c+direction[1], color, gameState, direction, isClosed) + 1;
  }
  else if (gameState[r][c]) isClosed.value = true;

  return 0;
}

function moveResult(r, c, color, initialColor, gameState) {
  const directions = [[0, 1], [1, 1], [1, 0], [1, -1]];
  let lengthTracker = [];
  let closedTracker = [];
  let result = "";

  for (let i = 0; i < 4; i++) {
  	const reverse = directions[i].map(x => {return -x});
  	closedTracker.push([]);

  	let isClosed = {value: false};
    const direction1 = travel(r+directions[i][0], c+directions[i][1], color, gameState, directions[i], isClosed);
    closedTracker[i].push(isClosed.value);

    isClosed.value = false;
    const direction2 = travel(r+reverse[0], c+reverse[1], color, gameState, reverse, isClosed);
    closedTracker[i].push(isClosed.value);

    lengthTracker.push([direction1, direction2]);
    const lengthOfRow = direction1 + direction2 + 1;

    if (lengthOfRow >= 5 && color !== initialColor) {
  	  if (color === "b") result = "Black wins.";
	  	else result = "White wins.";
    }
    else if (lengthOfRow === 5) {
    	if (color === "b") result = "Black wins.";
	  	else result = "White wins.";
    }
    else if (lengthOfRow > 5) {
    	result = "Illegal - First player is only allowed rows of five.";
    }
  }
  //find open 3-3 and 4-4s using trackers and return illegal
  return result;
}

export default App;
