import React, { Component } from 'react';

import Canvas from '../Canvas.jsx';

let gameState = {
	p1_paddle_y: 10,
	p2_paddle_y: 20,
	ball_x: 50,
	ball_y: 50,
};

export default class Pong extends Component {
	constructor() {
		super();
		let size = window.innerWidth;
		this.state = {
			width: size,
			height: size/2,
		};
		document.title = 'Pong | cygames';
	}
	componentDidMount() {
	}
	canvasStart(ctx) {
		let x_modifier = ctx.canvas.offsetWidth/100;
		let y_modifier = ctx.canvas.offsetHeight/100;
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
			Math.floor(gameState.p1_paddle_y*y_modifier),
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
				<Canvas handleMount={(ctx) => this.canvasStart(ctx)} />
			</div>
		);
	}
}