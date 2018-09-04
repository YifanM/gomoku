import store from '../store';
import { history } from '../routes';
import { childRef } from '../components/game';

let ws = null;
let connected = false;
let wsReady = null;

export const connectWebsocket = () => {
    if (ws) {
        ws.close();
        ws = null;
        connected = false;
        wsReady = null;
    } else {
        ws = new WebSocket('ws://127.0.0.1:8888/ws');
        ws.onmessage = (inMessage) => {
            const message = JSON.parse(inMessage.data);
            switch (message.type) {
                case ('create'):
                    store.dispatch({
                        type: 'ENTER_ROOM',
                        room: message.room
                    });
                    break;
                case ('join'):
                    store.dispatch({
                        type: 'ENTER_ROOM',
                        room: message.room
                    });
                    break;
                case ('ready'):
                    if (history.location.pathname !== '/game') {
                        history.push('/game');
                    }
                    childRef.props.restartGame();
                    store.dispatch({
                        type: 'COLOUR',
                        colour: message.colour
                    });
                    break;
                case ('ONLINE_PLAYERS'):
                    store.dispatch({
                        type: "NUM_ONLINE",
                        numOnline: message.content.data
                    });
                    break;
                case ('move'):
                    const { x, y } = message;
                    childRef.props.onClick(x, y, 'move', true);
                    break;
                default:
                    break;
            }
        }
        wsReady = () => {
            return new Promise((resolve, reject) => {
                if (!ws) {
                    reject();
                }
                if (connected) {
                    resolve();
                }
                ws.onopen = () => {
                    connected = true;
                    resolve();
                };
                setInterval(() => {
                    if (connected) {
                        resolve();
                    }
                }, 100);
            })
        }
    }
};

export const createRoom = () => {
    wsReady().then(() => {
        ws.send(JSON.stringify({
            type: "create"
        }));
    });
}

export const joinRoom = (room) => {
    wsReady().then(() => {
        ws.send(JSON.stringify({
            type: 'join',
            room
        }))
    })
}

export const setUsername = (username) => {
    wsReady().then(() => {
        ws.send(JSON.stringify({
            type: 'username',
            username
        }));
    })
}

export const getPlayersOnline = () => {
    wsReady().then(() => {
        ws.send(JSON.stringify({
            type: 'num_online'
        }));
    })
}

export const finishGame = (winner) => {
    wsReady().then(() => {
        ws.send(JSON.stringify({
            type: "game_finished",
            winner
        }))
    })
}

export const sendMove = (x, y, colour, room) => {
    if (ws) {
        ws.send(JSON.stringify({
            type: "move",
            data: {
                x,
                y,
                colour
            },
            room
        }));
    }
}
