import React, { Component } from 'react';
import { ResizeSensor } from 'css-element-queries'
import { waitForFinalEvent } from '../Helpers/helpers.jsx';

let countDown = null;
export default class Canvas extends Component {
	constructor() {
		super();
		let size = window.innerWidth;
		this.state = {
			width: size,
			height: size/2,
			queue: false,
			starting: false,
		};
	}
	componentDidMount() {
		let main = document.getElementById('main');
		let size = main.offsetWidth;
		this.setState({width: size, height: size/2});
		let self = this;
		new ResizeSensor(main, () => {
			let size = document.getElementById('main').offsetWidth;
			self.setState({width: size, height: size/2});
		});
		window.addEventListener('resize', () => {
			waitForFinalEvent(() =>{
				let size = document.getElementById('main').offsetWidth;
				self.setState({width: size, height: size/2});
			}, 300, "canvas"+Math.floor(Math.random()*1000));
		});
	}
	canvasGameStart(ctx) {
		if(countDown) return;
		let timeLeft = 3;
		countDown = setInterval(function () {
			ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
			ctx.font = '40px courier';
			ctx.fillStyle = '#fff';
			ctx.textAlign = 'center';
			ctx.fillText('Starting in '+timeLeft, ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight/2);
			timeLeft--;
			if(timeLeft === 0) {
				clearInterval(countDown);
			}
		}, 1000);
	}
	canvasQueueIndicate(ctx) {
		ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		ctx.font = '40px courier';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.fillText('In Queue...', ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight/2);
	}
	componentDidUpdate() {
		let ctx = this.refs.canvas.getContext('2d');
		this.props.handleMount(ctx);
		if(this.props.queue) {
			this.canvasQueueIndicate(ctx);
		} else if (this.props.starting) {
			this.canvasGameStart(ctx);
		}
	}
	render() {
		return (
			<canvas
				className="Canvas"
				ref="canvas"
				width={this.state.width}
				height={this.state.height}
				style={{backgroundColor: this.props.backgroundColor || '#111'}}
			/>
		);
	}
}
Canvas.propTypes = {
	handleMount: React.PropTypes.func,
	queue: React.PropTypes.bool,
	starting: React.PropTypes.bool,
	backgroundColor: React.PropTypes.string,
};
