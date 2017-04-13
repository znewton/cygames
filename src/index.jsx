import React from 'react';
import { render } from 'react-dom';
import './Sass/index.scss';
//functional imports
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase';
//Component imports
import App from './App.jsx';
//Games imports
import Pong from './Games/Pong/Pong.jsx';
import Snake from './Games/Snake/Snake.jsx';
import Chess from './Games/Chess/Chess.jsx';

const routes = [
	{path: 'pong', component: Pong, label: 'Pong'},
	{path: 'snake', component: Snake, label: 'Snake'},
	{path: 'chess', component: Chess, label: 'Chess'},
];
const config = {
	apiKey: "AIzaSyA1fhVzgiiYt27zj98FabJN-fKGp4ioMCY",
	authDomain: "cygames-c3548.firebaseapp.com",
	databaseURL: "https://cygames-c3548.firebaseio.com",
	storageBucket: "cygames-c3548.appspot.com",
	messagingSenderId: "175107300140"
};

firebase.initializeApp(config);
let provider = new firebase.auth.GoogleAuthProvider();

render((
	<BrowserRouter>
		<App routes={routes} provider={provider}/>
	</BrowserRouter>
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
