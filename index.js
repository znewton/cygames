const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const server = app.listen(port);
const io = require('socket.io')(server);
const firebase = require('firebase');
const pong = require('./pong');
const snake = require('./snake');

var config = {
	apiKey: "AIzaSyA1fhVzgiiYt27zj98FabJN-fKGp4ioMCY",
	authDomain: "cygames-c3548.firebaseapp.com",
	databaseURL: "https://cygames-c3548.firebaseio.com",
	storageBucket: "cygames-c3548.appspot.com",
	messagingSenderId: "175107300140"
};

let pongQueue = [];
let snakeQueue = [];

firebase.initializeApp(config);

const database = firebase.database();

var increment = 0;

// serve static assets normally
app.use(express.static(__dirname + '/public'));

app.get('/testing', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public/testingHTML', 'index.html'))
});
app.get('/snaketest', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public/snakeTest', 'snake.html'))
});
// Handles all routes so you do not get a not found error
app.post('*', function (request, response) {
	console.log('post');
});
app.get('*', function (request, response){
	//
	response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

console.log("server started on port " + port);

io.on('connection', function(socket){
	console.log("User connected");
	socket.emit('recieveConfig',{data: config});

	socket.on('startSession',function(msg){
		socket.userName = msg.userName;
		socket.uid = msg.uid;
		writeUserData(socket.uid, socket.userName);
		addUserToRoom(socket, "Main Room");
		getMessagesForRoom("Main Room");
	});
	socket.on('pong:enterQueue', function(data) {
		socket.userName = data.userName;
		socket.uid = data.uid;
		if(pongQueue.length) {
			//make match
			let player1 = pongQueue.pop();
			let player2 = socket;
			let roomName = player1.uid+player2.uid;
			addUserToRoom(player1, roomName);
			addUserToRoom(player2, roomName);
			getMessagesForRoom(roomName);
			pong.startGame(io.sockets.in(roomName), player1, player2, roomName);
			console.log('Pong Match: '+player1.userName+' vs. '+player2.userName);
		} else {
			//add to queue
			pongQueue.push(socket);
			console.log(socket.userName+' added to Pong Queue');
		}
	});
	socket.on('snake:enterQueue', function(data) {
		socket.userName = data.userName;
		socket.uid = data.uid;
		if(snakeQueue.length) {
			//make match
			let player1 = snakeQueue.pop();
			let player2 = socket;
			let roomName = player1.uid+player2.uid;
			addUserToRoom(player1, roomName);
			addUserToRoom(player2, roomName);
			getMessagesForRoom(roomName);
			snake.startGame(io.sockets.in(roomName), player1, player2, roomName);
			console.log('Snake Match: '+player1.userName+' vs. '+player2.userName);
		} else {
			//add to queue
			snakeQueue.push(socket);
			console.log(socket.userName+' added to Snake Queue');
		}
	});

	socket.on('chat:message', function(msg){
		let messageData = {
			message: msg.msg,
			sender: socket.userName,
			sid: socket.uid,
			timestamp: 1
		};
		let newMessageKey = firebase.database().ref().child('messages/' + msg.groupName).push().key;

		// Write the new post's data simultaneously in the posts list and the user's post list.
		let updates = {};
		updates['/messages/'+ msg.groupName + "/" + newMessageKey] = messageData;

		firebase.database().ref().update(updates);
		sendMessage(socket.uid, socket.userName, msg.msg);
		broadcastMessage(socket.uid, socket.userName, msg.msg);
	});

	socket.on('disconnect', function(){
			console.log('user disconnected');
			if(pongQueue.indexOf(socket) !== -1) {
				pongQueue.splice(pongQueue.indexOf(socket), 1);
			}
			socket.leave(socket.roomName);
			firebase.database().ref('users/'+socket.userName+'/groups').once('value').then(function(snapshot){
				snapshot.forEach(function(groupID){
					firebase.database().ref('groups/'+groupID.key+'/members/'+socket.userName).remove();
				});
				firebase.database().ref('users/'+socket.userName).remove();
			});
	});
	socket.on('manual-disconnect', function() {
		if(pongQueue.indexOf(socket) !== -1) {
			pongQueue.splice(pongQueue.indexOf(socket), 1);
		}
		socket.leave(socket.roomName);
		firebase.database().ref('users/'+socket.userName+'/groups').once('value').then(function(snapshot){
			snapshot.forEach(function(groupID){
				firebase.database().ref('groups/'+groupID.key+'/members/'+socket.userName).remove();
			});
			firebase.database().ref('users/'+socket.userName).remove();
		});
	})

	function createRoom(groupName){
		firebase.database().ref('groups/'+groupName).set({
			members: {},
			name: groupName
		});
	}

	function deleteRoom(groupName){
		socket.emit('signOut');
		firebase.database().ref('groups/'+groupName).remove();
		firebase.database().ref('users/').once('value').then(function(snapshot){
			snapshot.forEach(function(user){
				firebase.database().ref('users/'+user.key+'/groups/').once('value').then(function(groupID){
					console.log(groupID.val());
					for (let key in groupID.val()) {
						if(key === groupName){
							firebase.database().ref('users/'+user.key+'/groups/'+key).remove();
						}
					}
				});
			})
		})
	}

	function getMessagesForRoom(groupName) {
		firebase.database().ref('messages/'+ groupName).once('value').then(function(snapshot){
			snapshot.forEach(function(messageID){
				if(messageID.val().sid) {
					sendMessage(messageID.val().sid, messageID.val().sender, messageID.val().message);
				}
			})
		});
	}

	function writeUserData(screenName,realName) {
	  firebase.database().ref('users/' + screenName).set({
				name: realName,
				groups: {}
	  });
	}

	function addUserToRoom(sock, groupName){
		if(sock.roomName) {
			sock.leave(sock.roomName);
		}
		sock.roomName = groupName;
		sock.join(sock.roomName);
		let updates = {};
		updates['/users/'+sock.userName+"/groups/"+groupName] = true;
		updates['/groups/'+groupName+'/members/'+sock.userName] = true;

		 firebase.database().ref().update(updates);
	}

	function sendMessage(uid, sender, message){
		socket.emit('chat:message', {sid: uid, sender: sender, message: message});
	}

	function broadcastMessage(uid, sender, message){
		socket.broadcast.emit('chat:message', {sid: uid, sender: sender, message: message});
	}
});
