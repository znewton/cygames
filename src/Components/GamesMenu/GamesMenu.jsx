import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class GamesMenu extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="GamesMenu">
				{this.props.routes.map((route,i) => (
					<NavLink to={'/'+route.path} activeClassName={'active'} key={i} >{route.label}</NavLink>
				))}
			</div>
		);
	}
}