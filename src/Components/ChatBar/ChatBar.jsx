import React, { Component } from 'react';

export default class ChatBar extends Component {
	constructor() {
		super();
		this.state = {msg: 'ChatBar Component'};
	}
	render() {
		return (
			<div className="ChatBar">{this.state.msg}</div>
		);
	}
}