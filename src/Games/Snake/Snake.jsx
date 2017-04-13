import React, { Component } from 'react';

import Canvas from '../Canvas.jsx';

let context = null;

let key_sleep = null;

export default class Snake extends Component {
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
		document.title = 'Snake | cygames';
	}
	componentDidMount() {
		//Handle socket events
		this.props.socket.emit("snake:enterQueue");
		this.setState({queue: true}); // Set Queue state
		this.props.socket.on('snake:update-server',(data) => {
			this.canvasUpdate(context, data); // Update the canvas when game is actually being played
		});
		this.props.socket.on('snake:end',(data) => {
			this.canvasGameEnd(context, data); // Show end game details
		});
		this.props.socket.on('snake:start',(data) => {
			this.canvasGameStart(context, data); // Set Game start. Could potentially be altered to have opponent info
		});
		this.props.socket.on('snake:enterQueue',(data) => {
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
	paint_cell(ctx, x, y, cw, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
		ctx.strokeRect(x*cw, y*cw, cw, cw);
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
		// p1_snake ( left )
		let color = pNum === 1 ? '#1da1f2' : '#c82345';
		for(let i = 0; i < gameState.p1_snake_array.length; i++)
		{
			let c = gameState.p1_snake_array[i];
			this.paint_cell(ctx,
											c.x,
											c.y,
											2*x_modifier,
											color);
		}
		// p2_snake ( right )
		color = pNum === 2 ? '#1da1f2' : '#c82345';
		for(let i = 0; i < gameState.p2_snake_array.length; i++)
		{
			let c = gameState.p2_snake_array[i];
			this.paint_cell(ctx,
											c.x,
											c.y,
											2*x_modifier,
											color);
		}
		// Food
		this.paint_cell(ctx,
									gameState.food.x,
									gameState.food.y,
									2*x_modifier,
									'#fff');

	}
	handleMount(ctx) {
		// Set the component context to draw on for game updates
		context = ctx;
		// Set the game controls, Should probably change to be on the canvas, not window
		window.addEventListener('keydown', (e) =>  {
			let code = e.which || e.keyCode;
			let dir = '';
			if(code === 37) { //left
				dir = 'left';
			} else if(code === 38) { //up
				dir = 'up';
			} else if(code === 39) { //right
				dir = 'right';
			} else if(code === 40) { //down
				dir = 'down';
			}
			// Send update only if valid movement
			if (dir === '') return;
			e.preventDefault();
			this.props.socket.emit('snake:update-client', {dir: dir});
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
					You are the <span style={{backgroundColor: '#1da1f2', color: '#fff'}}>Blue</span> Snake. <br/>
					Use the arrow keys to move. <br />
					Eat more than the other snake, but dying will divide your score by theirs!
				</p>
			</div>
		);
	}
}
