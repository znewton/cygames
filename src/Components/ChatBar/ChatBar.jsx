import React, { Component } from 'react';
import Message from './Message/Message.jsx';
import firebase from 'firebase';

export default class ChatBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
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
			e.preventDefault();
			this.handleMessageSend();
		}
	}
	handleMessageReceive(msg) {
		let messages = this.state.messages;
		if(messages.length && messages[messages.length-1].sid === msg.sid ) {
			messages[messages.length-1].text += "\n"+msg.message;
		} else {
			messages.push({
				id: this.state.messages.length ? this.state.messages[this.state.messages.length - 1].id + 1 : 1,
				sender: msg.sender,
				text: msg.message,
				sid: msg.sid,
			});
		}
		this.setState({ messages });
		setTimeout(function () {
			let messageDiv = document.getElementById('messages');
			messageDiv.scrollTop = messageDiv.scrollHeight;
		}, 1);
	}
	handleMessageSend() {
		if(this.props.user === null) return;
		let input = this.state.input;
		input = input.trim();
		if(input === '') {
			this.setState({ input: ''});
			return;
		}
		let messages = this.state.messages;
		this.props.socket.emit('chat:message', {msg: input});
		this.setState({ messages, input: ''});
	}
	componentDidMount() {
		let messageDiv = document.getElementById('messages');
		messageDiv.scrollTop = messageDiv.scrollHeight;
		this.props.socket.on('chat:message', (msg) => this.handleMessageReceive(msg));
		this.props.socket.on('chat:reset', () => this.setState({messages: []}));
	}
	render() {
		return (
			<div className={'ChatBar'+(this.props.open ? ' open' : '')}>
				<div id="messages">
					{this.state.messages.map(msg => (
						<Message
							message={msg}
							isUser={this.state.userDetails && msg.sender === this.state.userDetails.displayName}
							key={msg.id} />
					))}
				</div>
				<div className="input">
					<textarea name="message"
										value={this.state.input}
										onChange={this.handleInputChange}
										onKeyPress={this.handleEnterPress}
										placeholder="Enter message..."
										disabled={!this.props.user} />
					<button onClick={() => this.handleMessageSend()}><i className="fa fa-send" /></button>
				</div>
			</div>
		);
	}
}

ChatBar.propTypes = {
	open: React.PropTypes.bool,
	user: React.PropTypes.object,
	socket: React.PropTypes.object,
};

ChatBar.defaultProps = {
	open: true,
};
