import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="Navbar">
				<section className={"UserMenuCover" + (this.props.userMenuOpen ? ' open':'')} onClick={() => this.props.userMenuToggle()} />
				<div className="navbar-left">
					<span
						className={"menu-btn"+(this.props.gameMenuOpen ? ' open' : '')}
						onClick={() => this.props.gameMenuToggle()}
					>
						<i className="fa fa-gamepad fa-fw"
							 title="Open Games Menu"/>
					</span>
				</div>
				<div className="navbar-middle">
					<Link to="/"><h2>CyGames</h2></Link>
					{this.props.user === null ?
						<button
							className="login"
							onClick={() => this.props.login()}
						>
							<i className="fa fa-sign-in" /> Login
						</button> :
						<span onClick={() => this.props.userMenuToggle()} >
							<img src={this.props.user.photoURL} />
						</span>
					}
					<section className={"UserMenu" + (this.props.userMenuOpen ? ' open':'')}>
						<div onClick={() => this.props.logout()}>
							<i className="fa fa-sign-out" /> Logout
						</div>
					</section>
				</div>
				<div className="navbar-right">
					<span
						className={"menu-btn"+(this.props.chatBarOpen ? ' open' : '')}
						onClick={() => this.props.chatBarToggle()}
					>
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
	userMenuOpen: React.PropTypes.bool,
	userMenuToggle: React.PropTypes.func,
	login: React.PropTypes.func,
	logout: React.PropTypes.func,
	user: React.PropTypes.object,
};

Navbar.defaultProps = {
	gameMenuOpen: true,
	chatBarOpen: true,
	userMenuOpen: false,
};