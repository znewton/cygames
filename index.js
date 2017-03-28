const express = require('express');
const path = require('path');
const opn = require('opn');
const port = process.env.PORT || 3000;
const app = express();
const server = app.listen(port);
const io = require('socket.io')(server);
const firebase = require('firebase');

var config = {
	apiKey: "AIzaSyA1fhVzgiiYt27zj98FabJN-fKGp4ioMCY",
	authDomain: "cygames-c3548.firebaseapp.com",
	databaseURL: "https://cygames-c3548.firebaseio.com",
	storageBucket: "cygames-c3548.appspot.com",
	messagingSenderId: "175107300140"
};

firebase.initializeApp(config);

const database = firebase.database();

var increment = 0;

// serve static assets normally
app.use(express.static(__dirname + '/public'));

// Handles all routes so you do not get a not found error
app.get('/testing', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public/testingHTML', 'index.html'))
});
app.get('*', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

console.log("server started on port " + port);

io.on('connection', function(socket){
	console.log("User connected");
	socket.emit('recieveConfig',{data: config});

	socket.on('startSession',function(msg){
		socket.userName = msg.userName;
		writeUserData(socket.userName, "Real Name");
		addUserToRoom(socket.userName, "Main Room");
		getMessagesForRoom("Main Room");
	});

	socket.on('chat message', function(msg){
		var messageData = {
			message: msg.msg,
			sender: socket.userName,
			timestamp: 1
		}
			var newMessageKey = firebase.database().ref().child('messages/' + msg.groupName).push().key;

		  // Write the new post's data simultaneously in the posts list and the user's post list.
		  var updates = {};
		  updates['/messages/'+ msg.groupName + "/" + newMessageKey] = messageData;

		  firebase.database().ref().update(updates);
			sendMessage(socket.userName, msg.msg);
			broadcastMessage(socket.userName, msg.msg);
	});

	socket.on('disconnect', function(){
			console.log('user disconnected');
			firebase.database().ref('users/'+socket.userName+'/groups').once('value').then(function(snapshot){
				snapshot.forEach(function(groupID){
					firebase.database().ref('groups/'+groupID.key+'/members/'+socket.userName).remove();
				});
				firebase.database().ref('users/'+socket.userName).remove();
			});
	});

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
					for (var key in groupID.val()) {
						if(key == groupName){
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
				sendMessage(messageID.val().sender, messageID.val().message);
			})
		});
	}

	function writeUserData(screenName,realName) {
	  firebase.database().ref('users/' + screenName).set({
				name: realName,
				groups: {}
	  });
	}

	function addUserToRoom(screenName, groupName){
		var updates = {}
		updates['/users/'+screenName+"/groups/"+groupName] = true;
		updates['/groups/'+groupName+'/members/'+screenName] = true;

		 firebase.database().ref().update(updates);
	}

	function sendMessage(sender, message){
		socket.emit('chat message', {sender: sender, message: message});
	}

	function broadcastMessage(sender, message){
		socket.broadcast.emit('chat message', {sender: sender, message: message});
	}
});

//opn('http://localhost:'+port);

// opn('http://localhost:'+port+"/testing");
