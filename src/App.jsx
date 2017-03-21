import React, { Component } from 'react';
import './App.scss';

import Basic from './Basic/Basic.jsx';

export default class App extends Component {
	constructor() {
		super();
		this.state = {msg: 'Hello World'}
	}
	render() {
		return (
			<div className="App">
				<h1>{this.state.msg}</h1>
				<Basic/>
			</div>
		);
	}
}