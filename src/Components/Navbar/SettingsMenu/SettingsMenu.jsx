import React, { Component } from 'react';

export default class SettingsMenu extends Component {
	render() {
		return (
			<div className={'SettingsMenu'+(this.props.open ? ' open':'')}>

			</div>
		);
	}
}

SettingsMenu.propTypes = {
	open: React.PropTypes.bool,
	onClose: React.PropTypes.func,
};

SettingsMenu.defaultProps = {
	open: false,
	onClose: function () {},
};