import React, { Component } from 'react';

export default class Main extends Component {
	render() {
		return (
			<main className="Main">
				{this.props.children}
			</main>
		);
	}
}