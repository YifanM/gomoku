import React, { Component } from 'react';

export default class GameRoom extends Component {
    ws = null;
    
    // const send = (message) => {
    //     if (ws) {
    //         ws.send('test123');
    //     }
    // }
    
    // const close = () => {
    //     ws.close();
    //     ws = null;
    // }
    
    createRoom = () => {
        if (!this.ws) {
            this.ws = new WebSocket('ws://127.0.0.1:8888/ws');
            this.ws.onmessage = (message) => {
                alert(message);
            }
        }
    }

    render() {
        return (
        <div>
            <button onClick={this.createRoom}>Create</button>
            <input type="text" />
            <button>Join</button>
        </div>
        );
    }
}
