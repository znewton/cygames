import React, { Component } from 'react';

export default class Index extends Component {
	constructor() {
		super();
		document.title = 'cygames';
	}
	handleSubmit(e) {
		e.preventDefault();
	}
	render() {
		return (
			<div className="Index">
				<form>
					<button onClick={this.handleSubmit.bind(this)}>Login</button>
				</form>
			</div>
		);
	}
}