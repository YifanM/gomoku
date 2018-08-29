import React, { Component } from 'react';
import Game from './game';
import GameRoom from './gameRoom';

export default class chooseGameMode extends Component {
    gameMode = '';

    chooseLocal = () => {
        this.gameMode = 'local';
        this.forceUpdate();
    }

    chooseOnline = () => {
        this.gameMode = 'online';
        this.forceUpdate();
    }

    render() {
        if (!this.gameMode) {
            return (
                <div>
                    <div>Choose your game mode</div>
                    <button onClick={this.chooseLocal}>Local</button>
                    <button onClick={this.chooseOnline}>Online</button>
                </div>
            );
        } else if (this.gameMode === 'local') {
            return (<Game />);
        } else {
            return (<GameRoom />);
        }
    }
}
