import { history } from '../routes';
import * as websocket from '../utils/websocket';

export const chooseLocal = () => {
    history.push('/game');
    return {
        type: "SELECT_MODE",
        mode: "local"
    }
};

export const chooseOnline = () => {
    history.push('/room');
    return {
        type: "SELECT_MODE",
        mode: "online"
    }
};

export const createRoom = (username) => (dispatch) => {
    history.push('/join');
    websocket.connectWebsocket();
    websocket.setUsername(username);
    websocket.createRoom();
    dispatch({
        type: "CREATE_OR_JOIN",
        roomType: 'create',
        username
    })
}

export const win = () => {
    return {
        type: "WIN"
    }
}

export const lose = () => {
    return {
        type: "LOSE"
    }
}

export const joinRoom = (username) => (dispatch) => {
    history.push('/join');
    websocket.connectWebsocket();
    websocket.setUsername(username);
    dispatch({
        type: "CREATE_OR_JOIN",
        roomType: 'join',
        username
    })
};

export const joinSocketRoom = (room) => (dispatch) => {
    websocket.joinRoom(room);
}

export const getPlayerStats = (username) => (dispatch) => {
    fetch(`http://localhost:3003/api/games?username=${username}`, { method: 'GET', headers: { 'content-type': 'application/json' } })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.success) {
                dispatch({
                    type: 'GET_STATS',
                    username,
                    games: jsonResponse.data.totalGames,
                    blackWins: jsonResponse.data.blackWins,
                    blackLosses: jsonResponse.data.blackLosses,
                    whiteWins: jsonResponse.data.whiteWins,
                    whiteLosses: jsonResponse.data.whiteLosses
                });
            }
        })
        .catch(console.warn);
    websocket.getPlayersOnline();
}
