import React, { Component } from 'react';

export default class Chess extends Component {
	constructor() {
		super();
		this.state = {msg: 'Chess Component is currently under construction'};
		document.title = 'Chess | cygames';
	}
	render() {
		return (
			<div className="Chess">{this.state.msg}</div>
		);
	}
}
