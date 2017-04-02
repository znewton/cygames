import React, { Component } from 'react';

export default class Index extends Component {
	constructor() {
		super();
		document.title = 'cygames';
	}
	render() {
		return (
			<section className="Index">
				<h1>Welcome to CyGames!</h1>
				<p>To play a game, select one from the games bar on the left.</p>
				<p>To chat, open up the chat bar on the right!</p>
			</section>
		);
	}
}