import React, { Component } from 'react';
import firebase from 'firebase';

import Canvas from '../Canvas.jsx';

let context = null;
const io = require('socket.io-client');
const socket = io();

export default class Pong extends Component {
	constructor() {
		super();
		this.state = {
			userDetails: null,
			context: null,
		};
		document.title = 'Pong | cygames';
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser) {
				//user is signed in
				this.setState({
					userDetails:{
						displayName: firebaseUser.displayName,
						email: firebaseUser.email,
						emailVerified: firebaseUser.emailVerified,
						photoURL: firebaseUser.photoURL,
						uid: firebaseUser.uid,
						providerData: firebaseUser.providerData,
					}
				});
				socket.emit("enterPongQueue", {uid: firebaseUser.uid, userName: firebaseUser.displayName});
				socket.on('game update',(data) => {
					this.canvasUpdate(context, data);
				});
			} else {
				this.setState({userDetails: null})
			}
		}, error => {
			console.log(error);
		});
	}
	canvasUpdate(ctx, gameState) {
		let x_modifier = ctx.canvas.offsetWidth/gameState.res;
		let y_modifier = ctx.canvas.offsetHeight/gameState.res;
		// console.log(ctx);
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		ctx.fillStyle = '#fff';
		//p1_paddle
		ctx.fillRect(
			5*x_modifier,
			gameState.p1_paddle_y*y_modifier,
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		//p2_paddle
		ctx.fillRect(
			Math.floor(ctx.canvas.offsetWidth-(5.5*x_modifier)),
			Math.floor(gameState.p2_paddle_y*y_modifier),
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		//ball
		ctx.fillRect(
			Math.floor(gameState.ball_x*x_modifier),
			Math.floor(gameState.ball_y*y_modifier),
			Math.floor(2*x_modifier),
			Math.floor(2*x_modifier),
		);
	}
	render() {
		return (
			<div className="Pong">
				<Canvas handleMount={(ctx) => {context = ctx}} />
			</div>
		);
	}
}