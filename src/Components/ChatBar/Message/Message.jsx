import React, { Component } from 'react';

export default class Message extends Component{
	render() {
		return (
			<div className="Message">
				{this.props.message.text}
			</div>
		);
	}
}