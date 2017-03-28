const socket = io();
socket.on("recieveConfig",function(data){
  firebase.initializeApp(data.data);
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  socket.emit("startSession",{userName: user.displayName})
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
});

socket.emit("hello");
socket.on("helloClient",function(data){
  console.log(data);
});

socket.on("signOut",function(data){
  firebase.auth().signOut().then(function() {
  console.log("Signed Out");
}).catch(function(error) {
  // An error happened.
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log("Error code: "+error.code);
  console.log("Error message: "+error.message);
});
});

function sendMessage(){
  socket.emit('chat message', {
    msg: $('#m').val(),
    groupName: "Main Room"
  });
  $('#m').val('');
  return false;
}

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.sender + ': '+msg.message));
});
