import React, { Component } from 'react';
import Message from './Message/Message.jsx';

export default class ChatBar extends Component {
	constructor() {
		super();
		this.state = {
			messages: [
				{ id: 1, sender: 'John Doe', text: 'Hello' },
				{ id: 2, sender: 'Jake Doe', text: 'Hello' },
				{ id: 3, sender: 'Jane Doe', text: 'Hello' },
				{ id: 4, sender: 'John Doe', text: 'What\'s up?' },
				{ id: 5, sender: 'Jane Doe', text: 'Nm you?' },
				{ id: 6, sender: 'John Doe', text: 'Doin alright' },
			],
			input: '',
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
	}
	handleInputChange(e) {
		this.setState({input:e.target.value});
	}
	handleEnterPress(e) {
		if(e.keyCode === 13 || e.which === 13) {
			this.handleMessageSend();
		}
	}
	handleMessageSend() {
		let messages = this.state.messages;
		messages.push({
			id: this.state.messages[this.state.messages.length-1].id+1,
			sender: 'testUser',
			text: this.state.input,
		});
		this.setState({messages, input: ''});
	}
	render() {
		return (
			<div className={'ChatBar'+(this.props.open ? ' open' : '')}>
				<div id="messages">
					{this.state.messages.map(msg => (
						<Message message={msg} key={msg.id} />
					))}
				</div>
				<div id="input">
					<input type="text" name="message" value={this.state.input} onChange={this.handleInputChange} onKeyPress={this.handleEnterPress} />
					<button onClick={() => this.handleMessageSend()}>Send</button>
				</div>
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