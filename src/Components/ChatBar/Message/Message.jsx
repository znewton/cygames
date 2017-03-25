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

Message.propTypes = {
	message: React.PropTypes.shape({
		id: React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.number]),
		sender: React.PropTypes.string,
		text: React.PropTypes.string,
	}).isRequired,
};