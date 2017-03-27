import React, { Component } from 'react';

export default class Pong extends Component {
	constructor() {
		super();
		this.state = {msg: 'Pong Component'};
		document.title = 'Pong | cygames';
	}
	render() {
		return (
			<div className="Pong">{this.state.msg}</div>
		);
	}
}