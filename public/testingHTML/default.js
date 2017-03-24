const socket = io();

socket.emit("hello");
socket.emit("startSession", {userName: "John"});
socket.on("helloClient",function(data){
  console.log(data);
});

$('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
});
