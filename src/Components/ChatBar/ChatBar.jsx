import React, { Component } from 'react';
import Message from './Message/Message.jsx';
import firebase from 'firebase';

const io = require('socket.io-client');
const socket = io();

const rooms = ['Main Room', 'Pong', 'Chess'];

export default class ChatBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			input: '',
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
		if(messages.length && messages[messages.length-1].sender === msg.sender ) {
			messages[messages.length-1].text += "\n"+msg.message;
		} else {
			messages.push({
				id: this.state.messages.length ? this.state.messages[this.state.messages.length - 1].id + 1 : 1,
				sender: msg.sender,
				text: msg.message,
			});
		}
		this.setState({ messages });
		setTimeout(function () {
			let messageDiv = document.getElementById('messages');
			messageDiv.scrollTop = messageDiv.scrollHeight;
		}, 1);
	}
	handleMessageSend() {
		if(this.state.userDetails === null) return;
		let input = this.state.input;
		input = input.trim();
		if(input === '') {
			this.setState({ input: ''});
			return;
		}
		let messages = this.state.messages;
		socket.emit('chat message', {msg: input, groupName: rooms[0]});
		this.setState({ messages, input: ''});
	}
	componentDidMount() {
		let messageDiv = document.getElementById('messages');
		messageDiv.scrollTop = messageDiv.scrollHeight;
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser) {
				//user is signed in
				this.setState({
					userDetails:{
						displayName: firebaseUser.displayName,
						email: firebaseUser.email,
						emailVerified: firebaseUser.emailVerified,
						photoURL: firebaseUser.photoURL,
						uid: firebaseUser.uid,
						providerData: firebaseUser.providerData,
					}
				});
				socket.emit("startSession", {userName: firebaseUser.displayName});
			} else {
				this.setState({userDetails: null})
			}
		}, error => {
			console.log(error);
		});
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
										disabled={!this.state.userDetails} />
					<button onClick={() => this.handleMessageSend()}><i className="fa fa-send" /></button>
				</div>
			</div>
		);
	}
}

ChatBar.propTypes = {
	open: React.PropTypes.bool,
	user: React.PropTypes.object
};

ChatBar.defaultProps = {
	open: true,
};