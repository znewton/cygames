import React from 'react';
import { render } from 'react-dom';
import './Sass/index.scss';
//functional imports
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
//Component imports
import App from './App.jsx';
//Games imports
import Pong from './Games/Pong/Pong.jsx';
import Chess from './Games/Chess/Chess.jsx';

const routes = [
	{ path: 'pong', component: Pong, label: 'Pong' },
	{ path: 'chess', component: Chess, label: 'Chess' },
];
const history = createBrowserHistory();

render((
	<Router history={history}>
		<App routes={routes} />
	</Router>
), document.getElementById('root'));