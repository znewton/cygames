import React, { Component } from 'react';

export default class GamesMenu extends Component {
	constructor() {
		super();
		this.state = {msg: 'GamesMenu Component'};
	}
	render() {
		return (
			<div className="GamesMenu">{this.state.msg}</div>
		);
	}
}