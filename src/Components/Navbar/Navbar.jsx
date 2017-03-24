import React, { Component } from 'react';

export default class Navbar extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<nav className="Navbar">
				<div className="navbar-left">
					<i className="fa fa-gamepad" title="Open Games Menu"/>
				</div>
				<div className="navbar-middle">
					<span>CyGames</span>
				</div>
				<div className="navbar-right">
					<i className="fa fa-comments" title="Open Chat Bar"/>
				</div>
			</nav>
		);
	}
}