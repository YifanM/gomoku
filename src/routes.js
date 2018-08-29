import React from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import Game from './components/game';
import Test from './components/gameMode';

export default () => (
    <HashRouter>
        <div>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/home" component={Test} />
            <Route exact path="/game" component={Game} /> 
        </div>
    </HashRouter>
)
