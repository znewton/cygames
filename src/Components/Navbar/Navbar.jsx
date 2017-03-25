import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="Navbar">
				<div className="navbar-left">
					<span className={"menu-btn"+(this.props.gameMenuOpen ? ' open' : '')} onClick={() => this.props.gameMenuToggle()}>
						<i className="fa fa-gamepad fa-fw"
							 title="Open Games Menu"/>
					</span>
				</div>
				<div className="navbar-middle">
					<Link to="/"><h2>CyGames</h2></Link>
				</div>
				<div className="navbar-right">
					<span className={"menu-btn"+(this.props.chatBarOpen ? ' open' : '')} onClick={() => this.props.chatBarToggle()}>
						<i className="fa fa-comments fa-fw"
							 title="Open Chat Bar"/>
					</span>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	gameMenuOpen: React.PropTypes.bool,
	chatBarOpen: React.PropTypes.bool,
	gameMenuToggle: React.PropTypes.func,
	chatBarToggle: React.PropTypes.func,
};