import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class GamesMenu extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className={'GamesMenu'+(this.props.open ? ' open' : '')}>
				{this.props.routes.map((route,i) => (
					<NavLink to={'/'+route.path} activeClassName={'active'} key={i} >{route.label}</NavLink>
				))}
			</div>
		);
	}
}

GamesMenu.propTypes = {
	open: React.PropTypes.bool,
	routes: React.PropTypes.arrayOf(React.PropTypes.shape({
		path: React.PropTypes.string,
		label: React.PropTypes.string,
	})),
};

GamesMenu.defaultProps = {
	open: true,
	routes: [],
};