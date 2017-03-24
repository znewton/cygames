import React, { Component } from 'react';
import './Sass/App.scss';
//Component imports
import Navbar from './Components/Navbar/Navbar.jsx';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			msg: 'Hello World'
		};
	}
	render() {
		return (
			<div className="App">
				<Navbar/>
			</div>
		);
	}
}