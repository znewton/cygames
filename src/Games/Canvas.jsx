import React, { Component } from 'react';
import { ResizeSensor } from 'css-element-queries'
import { waitForFinalEvent } from '../Helpers/helpers.jsx';

export default class Canvas extends Component {
	constructor() {
		super();
		let size = window.innerWidth;
		this.state = {
			width: size,
			height: size/2,
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
	componentDidUpdate() {
		let ctx = this.refs.canvas.getContext('2d');
		this.props.handleMount(ctx);
	}
	render() {
		return (
			<canvas
				className="Canvas"
				ref="canvas"
				width={this.state.width}
				height={this.state.height}
				style={{backgroundColor: '#111'}}
			/>
		);
	}
}
Canvas.propTypes = {
	handleMount: React.PropTypes.func,
};