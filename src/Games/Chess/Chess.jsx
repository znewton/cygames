import React, { Component } from 'react';

export default class Chess extends Component {
	constructor() {
		super();
		this.state = {msg: 'Chess Component'};
	}
	render() {
		return (
			<div className="Chess">{this.state.msg}</div>
		);
	}
}