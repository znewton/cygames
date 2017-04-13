import React, { Component } from 'react';

import Canvas from '../Canvas.jsx';

let context = null;

export default class Pong extends Component {
	constructor() {
		super();
		// Set game defaults
		this.state = {
			userDetails: null,
			showButton: false,
			queue: false,
			starting: false,
		};
		// Set document title
		document.title = 'Pong | cygames';
	}
	componentDidMount() {
		//Handle socket events
		this.props.socket.emit("pong:enterQueue");
		this.setState({queue: true}); // Set Queue state
		this.props.socket.on('pong:update-server',(data) => {
			this.canvasUpdate(context, data); // Update the canvas when game is actually being played
		});
		this.props.socket.on('pong:end',(data) => {
			this.canvasGameEnd(context, data); // Show end game details
		});
		this.props.socket.on('pong:start',(data) => {
			this.canvasGameStart(context, data); // Set Game start. Could potentially be altered to have opponent info
		});
		this.props.socket.on('pong:enterQueue',(data) => {
			this.setState({queue: true}); // Set Queue state
		});
	}
	canvasGameStart(ctx, data) {
		this.setState({queue:false,starting:true}); // End Queue state, start countdown
		setTimeout(()=> {
			this.setState({starting: false});
		}, 3100); // end countdown after 3.1 seconds
	}
	canvasGameEnd(ctx, data) {
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		ctx.font= '20px courier';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		if(data.quitter !== null) { // Display if opponent quits
			ctx.fillStyle = '#c82345';
			ctx.fillText('Player '+data.quitter+' Quit!',
										ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
		} else { // Display which player won or tie
			let pNum = this.props.user.uid === data.p1_id ? 1 : 2;
			if(data.p1_score > data.p2_score) {
			  ctx.fillStyle = pNum === 1 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 1 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else if (data.p1_score < data.p2_score) {
				ctx.fillStyle = pNum === 2 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 2 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else {
				ctx.fillStyle = '#fff';
				ctx.fillText('Tie!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			}
		}
		// Display final score
		ctx.fillText('Final Score:',
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.5);
		ctx.fillText(data.p1_score+' to '+data.p2_score,
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.7);
		this.setState({showButton: true});
	}
	canvasUpdate(ctx, gameState) {
		// Set the x and y modifiers to percentages based on canvas size and game resolution
		let x_modifier = ctx.canvas.offsetWidth/gameState.res;
		let y_modifier = ctx.canvas.offsetHeight/gameState.res;
		// Clear canvas
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		// Score
		ctx.font = '40px courier';
		ctx.fillStyle = '#888';
		ctx.textAlign = 'center';
		ctx.fillText(gameState.p1_score+'  |  '+gameState.p2_score,
								ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.1);
		let pNum = this.props.user.uid === gameState.p1_id ? 1 : 2;
		// p1_paddle ( left )
		ctx.fillStyle = pNum === 1 ? '#1da1f2' : '#c82345';
		ctx.fillRect(
			Math.floor(5*x_modifier),
			Math.floor(gameState.p1_paddle_y*y_modifier-(16*y_modifier)/2),
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		// p2_paddle ( right )
		ctx.fillStyle = pNum === 2 ? '#1da1f2' : '#c82345';
		ctx.fillRect(
			Math.floor(ctx.canvas.offsetWidth-(5.5*x_modifier)),
			Math.floor(gameState.p2_paddle_y*y_modifier - (16*y_modifier)/2),
			Math.floor(0.5*x_modifier),
			15*y_modifier
		);
		// Ball
		ctx.fillStyle = '#fff';
		ctx.fillRect(
			Math.floor(gameState.ball_x*x_modifier-1*x_modifier),
			Math.floor(gameState.ball_y*y_modifier-1*y_modifier),
			Math.floor(2*x_modifier),
			Math.floor(2*x_modifier),
		);

	}
	handleMount(ctx) {
		// Set the component context to draw on for game updates
		context = ctx;
		// Set the game controls, Should probably change to be on the canvas, not window
		window.addEventListener('keydown', (e) => {
			let code = e.which || e.keyCode;
			let offset = 0;
			if(code === 38) { //up
				e.preventDefault();
				offset = -1;
			} else if(code === 40) { //down
				e.preventDefault();
				offset = 1;
			}
			// Send update only if valid movement
			if (offset == 0) return;
			this.props.socket.emit('pong:update-client', {offset: offset});
		})
	}
	componentWillUnmount() {
		// Disconnect socket if user exits window or goes to different page.
		this.props.socket.emit('unmount');
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
				<p className="game-description">
					You are the <span style={{backgroundColor: '#1da1f2', color: '#fff'}}>Blue</span> paddle. <br/>
					Use the up and down arrow keys to move.
				</p>
			</div>
		);
	}
}
