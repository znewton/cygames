import React, { Component } from 'react';

export default class Main extends Component {
	render() {
		return (
			<main className={'Main' + (this.props.gameMenuOpen ? ' left-menu-open':'') + (this.props.chatBarOpen ? ' right-menu-open':'')}>
				{this.props.children}
			</main>
		);
	}
}

Main.propTypes = {
	gameMenuOpen: React.PropTypes.bool,
	chatBarOpen: React.PropTypes.bool,
};

Main.defaultProps = {
	gameMenuOpen: true,
	chatBarOpen: true,
};