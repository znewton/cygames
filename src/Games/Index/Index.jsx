import React, { Component } from 'react';

export default class Index extends Component {
	constructor() {
		super();
		this.state = {msg: 'Index Component'};
		document.title = 'cygames';
	}
	render() {
		return (
			<div className="Index">{this.state.msg}</div>
		);
	}
}