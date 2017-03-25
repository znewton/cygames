import React, { Component } from 'react';
import Message from './Message/Message.jsx';

export default class ChatBar extends Component {
	constructor() {
		super();
		this.state = {messages: [
			{ id: 1, sender: 'John Doe', text: 'Hello' },
			{ id: 2, sender: 'Jake Doe', text: 'Hello' },
			{ id: 3, sender: 'Jane Doe', text: 'Hello' },
			{ id: 4, sender: 'John Doe', text: 'What\'s up?' },
			{ id: 5, sender: 'Jane Doe', text: 'Nm you?' },
			{ id: 6, sender: 'John Doe', text: 'Doin alright' },
		]};
	}
	render() {
		return (
			<div className={'ChatBar'+(this.props.open ? ' open' : '')}>
				{this.state.messages.map(msg => (
					<Message message={msg} key={msg.id} />
				))}
			</div>
		);
	}
}

ChatBar.propTypes = {
	open: React.PropTypes.bool,
};

ChatBar.defaultProps = {
	open: true,
};