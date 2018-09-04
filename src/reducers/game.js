
export default (state = {
    mode: 'local',
    room: '',
    roomType: '',
    username: '',
    colour: ''
}, action) => {
    switch (action.type) {
        case ("SELECT_MODE"):
            return {
                ...state,
                mode: action.mode
            };
        case ("ENTER_ROOM"):
            return {
                ...state,
                room: action.room
            };
        case ("CREATE_OR_JOIN"):
            return {
                ...state,
                roomType: action.roomType,
                username: action.username
            };
        case ("GET_STATS"):
            return {
                ...state,
                games: action.games,
                wins: action.blackWins + action.whiteWins,
                losses: action.blackLosses + action.whiteLosses
            };
        case ("WIN"):
            return {
                ...state,
                wins: state.wins + 1
            };
        case ("LOSE"):
            return {
                ...state,
                losses: state.losses + 1
            };
        case ("NUM_ONLINE"):
            return {
                ...state,
                numOnline: action.numOnline
            };
        case ("COLOUR"):
            return {
                ...state,
                colour: action.colour
            };
        default:
            return state;
    }
}
