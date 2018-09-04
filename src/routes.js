import React from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import Game from './components/game';
import GameMode from './components/gameMode';
import JoinRoom from './components/joinRoom';
import GameRoom from './components/gameRoom';

import createHistory from 'history/createBrowserHistory';

const history = createHistory();

export { history };

export default () => (
    <Router history={history}>
        <div>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/home" component={GameMode} />
            <Route exact path="/room" component={GameRoom} />
            <Route exact path="/join" component={JoinRoom} />
            <Route exact path="/game" component={Game} /> 
        </div>
    </Router>
)
