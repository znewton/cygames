const express = require('express');
const path = require('path');
const opn = require('opn');
const port = process.env.PORT || 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// serve static assets normally
app.use(express.static(__dirname + '/public'));

// Handles all routes so you do not get a not found error
app.get('/testing', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public/testingHTML', 'index.html'))
});
app.get('*', function (request, response){
	response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

app.listen(port);
console.log("server started on port " + port);

opn('http://localhost:'+port);

io.on('connection', function(socket){
	console.log("new connection");
})
