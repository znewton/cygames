import React, { Component } from 'react';

export default class NotFound extends Component {
	constructor() {
		super();
		this.state = {msg: 'NotFound Component'};
		document.title = '404 | cygames';
	}
	render() {
		return (
			<div className="NotFound">{this.state.msg}</div>
		);
	}
}