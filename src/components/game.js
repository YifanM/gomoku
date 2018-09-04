/* eslint-disable */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import * as actions from '../actions/game';
import { moveResult } from '../utils/gameActions';
import { bindActionCreators } from 'redux';
import { getPlayersOnline } from '../utils/websocket';
import * as websocket from '../utils/websocket';

class PlayArea extends Component {
    render() {
        return (
            <div id="playContainer">
            <button className="button" onClick={() => this.props.onClick()}></button>
            <PlayAreaGraphic colourState={this.props.colourState} gameState={this.props.gameState} />
            <PlayAreaBoard position={this.props.position} />
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

class PlayAreaBoard extends Component {
    render() {
        let imageSrc;
        const r = this.props.position[0];
        const c = this.props.position[1];
        if (r === 0 && c === 0) imageSrc = "gridCorner1.png";
        else if (r === 0 && c === 16) imageSrc = "gridCorner2.png";
        else if (r === 16 && c === 16) imageSrc = "gridCorner3.png";
        else if (r === 16 && c === 0) imageSrc = "gridCorner4.png";
        else if (r === 8 && c === 8 || r === 4 && c === 8 || r === 12 && c === 8 ||
                r === 8 && c === 4 || r === 4 && c === 4 || r === 12 && c === 4 ||
                r === 8 && c === 12 || r === 4 && c === 12 || r === 12 && c === 12) imageSrc = "gridMainVH.png";
        else if (r === 0 && (c === 4 || c === 8 || c === 12)) imageSrc="gridTopMain.png";
        else if (r === 16 && (c === 4 || c === 8 || c === 12)) imageSrc="gridBottomMain.png";
        else if (c === 0 && (r === 4 || r === 8 || r === 12)) imageSrc="gridLeftMain.png";
        else if (c === 16 && (r === 4 || r === 8 || r === 12)) imageSrc="gridRightMain.png";
        else if (r === 0) imageSrc = "gridTop.png";
        else if (r === 16) imageSrc = "gridBottom.png";
        else if (c === 0) imageSrc = "gridLeft.png";
        else if (c === 16) imageSrc = "gridRight.png";
        else if (r === 8 || r === 4 || r === 12) imageSrc = "gridMainH.png";
        else if (c === 8 || c === 4 || c === 12) imageSrc = "gridMainV.png";
        else imageSrc = "gridReg.png";
        return (
            <img className="boardGrid" src={require("../resources/" + imageSrc)} alt={"gg"} />
        );
    };
}

class PlaceMarker extends Component {
    render() {
        let markerStyle;
        const pos = this.props.position;
        if (pos === "top-left") markerStyle = {margin: "152px 0 0 -140px"};
        else if (pos === "top-right") markerStyle = {margin: "152px 0 0 140px"};
        else if (pos === "bottom-left") markerStyle = {margin: "433px 0 0 -140px"};
        else if (pos === "bottom-right") markerStyle = {margin: "433px 0 0 140px"};
        else markerStyle = {margin: "292px 0 0 0"};
        return (
        <div className="placeMarker" style={markerStyle}></div>
        )
    }
}

class BoardRow extends Component {
    renderArea(c) {
        return <PlayArea key={this.props.row + c} position={[this.props.row, c]} colourState={this.props.colourState[c]} gameState={this.props.gameState[c]} onClick={() => this.props.onClick(c)} />;
    }
    render() {
        const rowPieces = [];
        for (var j = 0; j < 17; j++) {
            rowPieces.push(this.renderArea(j));
        }
        return (
            <div className="boardRow">
                { rowPieces }
            </div>
        );
    }
}

class Board extends Component {
    renderArea(r) {
        return <BoardRow row={r} colourState={this.props.colourState[r]} gameState={this.props.gameState[r]} onClick={(c) => this.props.onClick(r, c, "move")} />;
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
        const row = []
        for (var i = 0; i < 17; i++) {
        row.push(this.renderArea(i));
        }
        gameBoard.push(row);
        return (
        <div id="boardContainer">
            <div className="board">
                { gameBoard }
            </div>
            <PlaceMarker position={"top-left"} />
            <PlaceMarker position={"top-right"} />
            <PlaceMarker position={"bottom-left"} />
            <PlaceMarker position={"bottom-right"} />
            <PlaceMarker position={"centre"} />
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    mode: state.game.mode,
    username: state.game.username,
    wins: state.game.wins,
    losses: state.game.losses,
    numOnline: state.game.numOnline,
    colour: state.game.colour,
    room: state.game.room,
    roomType: state.game.roomType
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

let childRef;
export { childRef };

class Game extends Component {
    notification = null;

    constructor(props) {
        super(props);
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
        if (props.mode === 'online' && props.username) {
            props.getPlayerStats(props.username);
        }
    }

    handleClick = (r, c, state, fromWs) => {
        if (this.props.mode === 'online' && !fromWs) {
            if (this.state.blackMove && this.props.colour === 'white') return;
            if (!this.state.blackMove && this.props.colour === 'black') return;
        }
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
            if (this.props.mode === 'online') {
                websocket.sendMove(r, c, this.props.colour, this.props.room);
            }
            gameHistory.push([r, c]);
            if (result) {
                result === "Black wins." ? blackWins += 1 : whiteWins += 1;
                if (this.props.mode === 'online') {
                    const winner = result === 'Black wins.' ? 'black' : 'white';
                    if (this.props.roomType === 'create') {
                        websocket.finishGame(winner);
                    }
                    if (this.props.colour === winner) {
                        this.props.win();
                    } else {
                        this.props.lose();
                    }
                } 
            }
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

    restartGame = () => {
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

        let infoElement = <div />;
        if (this.props.mode === 'online') {
            infoElement = (<div className="info-board">
                <div>
                    <div className="info-board-title">Colour</div>
                    <div>{this.props.colour}</div>
                </div>
                <div>
                    <div className="info-board-title">Username</div>
                    <div>{this.props.username}</div>
                </div>
                <div>
                    <div className="info-board-title">Wins</div>
                    <div>{this.props.wins}</div>
                </div>
                <div>
                    <div className="info-board-title">Losses</div>
                    <div>{this.props.losses}</div>
                </div>
                <div>
                    <div className="info-board-title">Players Online</div>
                    <div>{this.props.numOnline}</div>
                </div>
            </div>);
        }

        let controlElement = (<div id="menu">
            <div>{status}</div>
        </div>);
        if (this.props.mode === 'local') {
            controlElement = (<div id="menu">
                <div>{status}</div>
                <button disabled={!this.state.gameHistory.length} onClick={() => this.undoMove()}>Undo</button>
                <button onClick={() => this.restartGame()}>Restart</button>
            </div>);
        }

        let scoreboardElement = <div />;
        if (this.props.mode === 'local') {
            scoreboardElement = (<div id="scoreboard">
                <h4>Black's score: {this.state.blackWins}</h4>
                <h4>White's score: {this.state.whiteWins}</h4>
            </div>);
        }
        return (
            <div>
                <div>{infoElement}</div>
                <Board ref={child => childRef = child} restartGame={this.restartGame} colourState={this.state.colourState} gameState={this.state.gameState} onClick={(r, c, state, fromWs) => this.handleClick(r, c, state, fromWs)} />
                {controlElement}
                {scoreboardElement}
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

export default connect(mapStateToProps, mapDispatchToProps)(Game);
