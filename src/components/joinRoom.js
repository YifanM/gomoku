import React, { Component } from 'react';

import * as actions from '../actions/game';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.css';
import { history } from '../routes';

class JoinRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: ''
        }
    }

    updateInputValue = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    render() {
        if (this.props.roomType === 'create') {
            return (
            <div className="join-room">
                <h1>
                    Your room code is:
                </h1>
                <h1>
                    {this.props.room}
                </h1>
                <h2>
                    Waiting for another player to join...
                </h2>
            </div>);
        } else if (this.props.roomType === 'join') {
            return (
            <div className="join-room">
                <h1>
                    Enter the room code
                </h1>
                <div className="container">
                    <input value={this.state.inputValue} onChange={this.updateInputValue} />
                    <button onClick={() => this.props.joinSocketRoom(this.state.inputValue)}>
                        Join
                    </button>
                </div>
            </div>);
        } else {
            history.push('/home');
            return <div />
        }
    }
}

const mapStateToProps = (state) => ({
    roomType: state.game.roomType,
    room: state.game.room
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom);
