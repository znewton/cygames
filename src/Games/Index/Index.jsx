import React, { Component } from 'react';

export default class Index extends Component {
	constructor() {
		super();
		document.title = 'cygames';
	}
	render() {
		return (
			<section className="Index">
				<div className="container">
					<div className="segment play">
						<i className="fa fa-gamepad" />
						<span>To play a game, select one from the games bar on the left.</span>
					</div>
					<div className="segment chat">
						<span>To chat, open up the chat bar on the right!</span>
						<i className="fa fa-comments" />
					</div>
				</div>
			</section>
		);
	}
}
