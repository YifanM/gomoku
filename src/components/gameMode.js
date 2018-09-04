import React, { Component } from 'react';

import * as actions from '../actions/game';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.css';

class chooseGameMode extends Component {
    render() {
        return (
            <div className="game-mode">
                <h1>Choose your game mode</h1>
                <div className="buttons">
                    <button onClick={this.props.chooseLocal}>Local</button>
                    <button onClick={this.props.chooseOnline}>Online</button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(null, mapDispatchToProps)(chooseGameMode);
