import React, { Component } from 'react';
import './Basic.scss';

export default class Basic extends Component {
	constructor() {
		super();
		this.state = {msg: 'Basic Component'};
	}
	render() {
		return (
			<div className="Basic">{this.state.msg}</div>
		);
	}
}