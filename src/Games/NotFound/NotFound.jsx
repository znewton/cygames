import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NotFound extends Component {
	constructor() {
		super();
		this.state = {msg: 'NotFound Component'};
		document.title = '404 | cygames';
	}
	render() {
		return (
			<section className="NotFound">
				<h1>404</h1>
				<p>Woops, looks like what you were looking for wasn't found!</p>
				<p>Try <Link to="/">Home</Link></p>
			</section>
		);
	}
}