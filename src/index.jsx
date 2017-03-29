import React from 'react';
import { render } from 'react-dom';
import './Sass/index.scss';
//functional imports
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import axios from 'axios';
import * as firebase from 'firebase';
//Component imports
import App from './App.jsx';
//Games imports
import Pong from './Games/Pong/Pong.jsx';
import Chess from './Games/Chess/Chess.jsx';

const routes = [
	{path: 'pong', component: Pong, label: 'Pong'},
	{path: 'chess', component: Chess, label: 'Chess'},
];
const history = createBrowserHistory();

render((
	<Router history={history}>
		<App routes={routes} user={user}/>
	</Router>
), document.getElementById('root'));

// main visibility API function
// use visibility API to check if current tab is active or not
const vis = (function(){
	let stateKey,
		eventKey,
		keys = {
			hidden: "visibilitychange",
			webkitHidden: "webkitvisibilitychange",
			mozHidden: "mozvisibilitychange",
			msHidden: "msvisibilitychange"
		};
	for (stateKey in keys) {
		if (stateKey in document) {
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c) {
		if (c) document.addEventListener(eventKey, c);
		return !document[stateKey];
	}
})();
let previous_title = 'cygames';
// check if current tab is active or not
vis(function(){

	if(vis()){
		document.title = previous_title;
	} else {
		previous_title = document.title;
		document.title = 'Come back ☹ | cygames'
	}
});