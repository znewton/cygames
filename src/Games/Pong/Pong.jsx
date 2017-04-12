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
			showButton: false,
			queue: false,
			starting: false,
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
					},
					showButton: false,
				});
				socket.emit("pong:enterQueue", {uid: firebaseUser.uid, userName: firebaseUser.displayName});
				this.setState({queue: true});
				socket.on('pong:update-server',(data) => {
					this.canvasUpdate(context, data);
				});
				socket.on('pong:end',(data) => {
					this.canvasGameEnd(context, data);
				});
				socket.on('pong:start',(data) => {
					this.canvasGameStart(context, data);
				});
				socket.on('pong:enterQueue',(data) => {
					this.setState({queue: true});
				});
			} else {
				this.setState({userDetails: null, queue: false, starting: false,})
			}
		}, error => {
			console.log(error);
		});
	}
	canvasGameStart(ctx, data) {
		this.setState({queue:false,starting:true})
		setTimeout(()=> {
			this.setState({starting: false});
		});
	}
	canvasGameEnd(ctx, data) {
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		ctx.font= '20px courier';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		if(data.quitter !== null) {
			ctx.fillStyle = '#c82345';
			ctx.fillText('Player '+data.quitter+' Quit!',
										ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
		} else {
			let pNum = this.state.userDetails.uid === data.p1_id ? 1 : 2;
			if(data.p1_score > data.p2_score) {
			  ctx.fillStyle = pNum === 1 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 1 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else if (data.p1_score < data.p2_score) {
			ctx.fillStyle = pNum === 2 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 2 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else {
				ctx.fillText('Tie!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			}
		}
		ctx.fillText('Final Score:',
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.5);
		ctx.fillText(data.p1_score+' to '+data.p2_score,
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.7);
		this.setState({showButton: true});
	}
	canvasUpdate(ctx, gameState) {
		let x_modifier = ctx.canvas.offsetWidth/gameState.res;
		let y_modifier = ctx.canvas.offsetHeight/gameState.res;
		// console.log(ctx);
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		//Score
		ctx.font = '40px courier';
		ctx.fillStyle = '#888';
		ctx.textAlign = 'center';
		ctx.fillText(gameState.p1_score+'  |  '+gameState.p2_score,
								ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.1);
		let pNum = this.state.userDetails.uid === gameState.p1_id ? 1 : 2;
		ctx.fillStyle = pNum === 1 ? '#1da1f2' : '#c82345';
		//p1_paddle
		ctx.fillRect(
			Math.floor(5*x_modifier),
			Math.floor(gameState.p1_paddle_y*y_modifier-(16*y_modifier)/2),
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		ctx.fillStyle = pNum === 2 ? '#1da1f2' : '#c82345';
		//p2_paddle
		ctx.fillRect(
			Math.floor(ctx.canvas.offsetWidth-(5.5*x_modifier)),
			Math.floor(gameState.p2_paddle_y*y_modifier - (16*y_modifier)/2),
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		ctx.fillStyle = '#fff';
		//ball
		ctx.fillRect(
			Math.floor(gameState.ball_x*x_modifier-1*x_modifier),
			Math.floor(gameState.ball_y*y_modifier-1*y_modifier),
			Math.floor(2*x_modifier),
			Math.floor(2*x_modifier),
		);

	}
	handleMount(ctx) {
		context = ctx;
		window.addEventListener('keydown', function(e) {
			let code = e.which || e.keyCode;
			let offset = 0;
			if(code === 38) { //up
				e.preventDefault();
				offset = -1;
			} else if(code === 40) { //down
				e.preventDefault();
				offset = 1;
			}
			if (offset == 0) return;
			socket.emit('pong:update-client', {offset: offset});
		})
	}
	componentWillUnmount() {
		socket.disconnect();
	}
	render() {
		return (
			<div className="Pong">
				<Canvas handleMount={(ctx) => this.handleMount(ctx)}
					starting={this.state.starting}
					queue={this.state.queue}
				/>
				{this.state.showButton &&
				<p style={{textAlign: 'center', fontSize: '2em'}}>
					Refresh <i className="fa fa-refresh" /> to re-enter Queue
				</p>
				}
			</div>
		);
	}
}
