import React, { Component } from 'react';
import Message from './Message/Message.jsx';

const io = require('socket.io-client');
const socket = io();

export default class ChatBar extends Component {
	constructor() {
		super();
		this.state = {
			messages: [
				// { id: 1, sender: 'John Doe', text: 'Hello' },
				// { id: 2, sender: 'Jake Doe', text: 'Hey' },
				// { id: 3, sender: 'testUser', text: 'Hi' },
				// { id: 4, sender: 'Jane Doe', text: 'Hello' },
				// { id: 5, sender: 'John Doe', text: 'What\'s up?' },
				// { id: 6, sender: 'Jane Doe', text: 'Nm you?' },
				// { id: 7, sender: 'John Doe', text: 'Doin alright' },
			],
			input: '',
			user: 'testUser'+Math.floor(Math.random()*1000),
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
		socket.on('chat message', (msg) => this.handleMessageReceive(msg));
	}
	handleInputChange(e) {
		this.setState({input:e.target.value});
	}
	handleEnterPress(e) {
		if(e.keyCode === 13 || e.which === 13) {
			e.preventDefault();
			this.handleMessageSend();
		}
	}
	handleMessageReceive(msg) {
		let messages = this.state.messages;
		messages.push({
			id: this.state.messages.length ? this.state.messages[this.state.messages.length-1].id+1 : 1,
			sender: msg.sender,
			text: msg.message,
		});
		this.setState({ messages });
		setTimeout(function () {
			let messageDiv = document.getElementById('messages');
			messageDiv.scrollTop = messageDiv.scrollHeight;
		}, 1);
	}
	handleMessageSend() {
		let input = this.state.input;
		input = input.trim();
		if(input === '') {
			this.setState({ input: ''});
			return;
		}
		let messages = this.state.messages;
		// messages.push({
		// 	id: this.state.messages[this.state.messages.length-1].id+1,
		// 	sender: 'testUser',
		// 	text: input,
		// });
		socket.emit('chat message', {msg: input, groupName: "Main Room"});
		this.setState({ messages, input: ''});
	}
	componentDidMount() {
		let messageDiv = document.getElementById('messages');
		messageDiv.scrollTop = messageDiv.scrollHeight;
		socket.emit("startSession", {userName: this.state.user});
	}
	render() {
		return (
			<div className={'ChatBar'+(this.props.open ? ' open' : '')}>
				<div id="messages">
					{this.state.messages.map(msg => (
						<Message message={msg} isUser={msg.sender === this.state.user} key={msg.id} />
					))}
				</div>
				<div className="input">
					<textarea name="message" value={this.state.input} onChange={this.handleInputChange} onKeyPress={this.handleEnterPress} placeholder="Enter message..." />
					<button onClick={() => this.handleMessageSend()}><i className="fa fa-send" /></button>
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