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
	getAllMessages();

	socket.on('hello',function () {
		console.log("Hello there litte one");
	});

	socket.on('startSession',function(msg){
		socket.userName = msg.userName;
		writeUserData(socket.userName);
		increment++;
		sayHello();
	});

	socket.on('chat message', function(msg){
			var messageString = msg.toString();
			var message = socket.userName +":"+msg;
			firebase.database().ref('message/m'+increment).set({
					msg: msg,
					sender: socket.userName
			});
			increment++;
			socket.emit('chat message',message);
			socket.broadcast.emit('chat message',message);
	});

	socket.on('disconnect', function(){
			console.log('user disconnected');
			firebase.database().ref('users/'+socket.id).remove();
	});

	function getAllMessages() {
		firebase.database().ref('message/').on('value',function(snapshot){
			console.log("Snapshot is: "+snapshot.val());
			for(var object in snapshot.val()){
				console.log(object.sender);
			}
		});
	}

	function writeUserData(name) {
  firebase.database().ref('users/' + name).set({
			name: name
  });
}
	function sayHello(){
		socket.emit('helloClient',{ username: socket.userName });
	}
});

//opn('http://localhost:'+port);

opn('http://localhost:'+port+"/testing");
