import React, { Component } from 'react';

export default class Index extends Component {
	constructor() {
		super();
		this.state = {msg: 'Index Component'};
	}
	render() {
		return (
			<div className="Index">{this.state.msg}</div>
		);
	}
}