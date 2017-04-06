import React, { Component } from 'react';

import { waitForFinalEvent } from '../../Helpers/helpers.jsx';

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
		let size = document.getElementById('main').offsetWidth;
		this.setState({width: size, height: size/2});
		let self = this;
		window.addEventListener('resize', () => {
			waitForFinalEvent(() =>{
				let size = document.getElementById('main').offsetWidth;
				self.setState({width: size, height: size/2});
			}, 300, "game resize");
		});
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0,0,this.state.height, this.state.width);
	}
	render() {
		return (
			<div className="Pong">
				<canvas
					id="pong-canvas"
					ref="canvas"
					width={this.state.width}
					height={this.state.height}
					style={{backgroundColor: '#111'}}
				/>
			</div>
		);
	}
}