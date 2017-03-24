import React, { Component } from 'react';

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			gameMenuOpen: false,
			chatBarOpen: false,
		};
	}
	handleGameMenuOpen(){

	}
	render() {
		return (
			<nav className="Navbar">
				<div className="navbar-left">
					<span className={"menu-btn"+(this.state.gameMenuOpen ? ' open' : '')}>
						<i className="fa fa-gamepad fa-fw"
							 title="Open Games Menu"/>
					</span>
				</div>
				<div className="navbar-middle">
					<h2>CyGames</h2>
				</div>
				<div className="navbar-right">
					<span className={"menu-btn"+(this.state.chatBarOpen ? ' open' : '')}>
						<i className="fa fa-comments fa-fw"
							 title="Open Chat Bar"/>
					</span>
				</div>
			</nav>
		);
	}
}