import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import * as actions from '../actions/game';
import { bindActionCreators } from 'redux';

class GameRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }
    
    updateUsername = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    render() {
        return (
        <div className="game-room">
            <h1>Start an online game</h1>
            <div className="container">
                <div>Username</div>
                <input value={this.state.username} onChange={this.updateUsername} />        
            </div>
            <div className="container">
                <div>
                    <button onClick={() => this.props.createRoom(this.state.username)}>Create</button>
                </div>
                <div>
                    <button onClick={() => this.props.joinRoom(this.state.username)}>Join</button>
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    room: state.game.room
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);
