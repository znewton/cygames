import React, { Component } from 'react';

export default class Message extends Component{
	render() {
		return (
			<div className={'Message' + (this.props.isUser ? ' User':'')}>
				<div className="sender">{this.props.message.sender}</div>
				<div className="text">{this.props.message.text}</div>
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
	isUser: React.PropTypes.bool,
};