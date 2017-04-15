import React from 'react';
import { render } from 'react-dom';
import './Sass/index.scss';
//functional imports
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase';
//Component imports
import App from './App.jsx';

const io = require('socket.io-client');
const socket = io();

const config = {
	apiKey: "AIzaSyA1fhVzgiiYt27zj98FabJN-fKGp4ioMCY",
	authDomain: "cygames-c3548.firebaseapp.com",
	databaseURL: "https://cygames-c3548.firebaseio.com",
	storageBucket: "cygames-c3548.appspot.com",
	messagingSenderId: "175107300140"
};

firebase.initializeApp(config);
let provider = new firebase.auth.GoogleAuthProvider();
let userDetails = null;

function handleLogin() {
	if (firebase.auth().currentUser) return;
	firebase.auth().signInWithPopup(provider)
		.then(result => {
			let token = result.credential.accessToken;
			let googleUser = result.user;
		})
		.catch(error => {console.log(error)});
}
function handleLogout() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		userDetails = null;
	}).catch(function(error) {
		// An error happened.
	});
}
firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser) {
		//user is signed in
		firebaseUser.getToken().then(accessToken => {
			userDetails = {
				displayName: firebaseUser.displayName,
				email: firebaseUser.email,
				emailVerified: firebaseUser.emailVerified,
				photoURL: firebaseUser.photoURL,
				uid: firebaseUser.uid,
				accessToken: accessToken,
				providerData: firebaseUser.providerData,
			};
			socket.emit("startSession", {uid: firebaseUser.uid, userName: firebaseUser.displayName});
			render((
				<BrowserRouter>
					<App socket={socket} user={userDetails} handleLogout={() => handleLogout()} handleLogin={() => handleLogin()} />
				</BrowserRouter>
			), document.getElementById('root'));
		});
	} else {
	render((
		<BrowserRouter>
			<App socket={socket} user={null} handleLogout={() => handleLogout()} handleLogin={() => handleLogin()} />
		</BrowserRouter>
	), document.getElementById('root'));
	}
}, error => {
	console.log(error);
})

render((
	<BrowserRouter>
		<App socket={socket} user={null} handleLogout={() => handleLogout()} handleLogin={() => handleLogin()} />
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
